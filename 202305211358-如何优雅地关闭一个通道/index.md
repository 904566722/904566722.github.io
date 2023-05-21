# 如何优雅地关闭一个通道

<!--more-->
#

## 通道关闭的原则

- 通用的通道关闭的原则是：`不要关闭一个已经关闭的通道`，因为这将导致一个恐慌


另外一个常用的相对容易遵守的原则： **`不要在数据的接收方或者在有多个发送者的情况下关闭通道`**，换句话说，最好让一个通道唯一的发送者来关闭通道

❌ 不要在数据的接收方关闭通道
![](images/posts/Pasted%20image%2020230521140747.png)

❌ 不要在有多个发送者的情况下关闭通道
![](images/posts/Pasted%20image%2020230521140813.png)

`如果一定要在上面的两种场景下关闭通道，记得使用 recover 来防止程序崩溃`

✅最好让通道的唯一发送者来关闭
![](images/posts/Pasted%20image%2020230521140843.png)

## 礼貌地关闭通道的方法（不能完全避免数据竞争）

可以通过 `sync.Once` 或者 `sync.Mutex` 来实现

实现1：
```go
type MyChannel struct {
	C    chan T
	once sync.Once
}

func NewMyChannel() *MyChannel {
	return &MyChannel{C: make(chan T)}
}

func (mc *MyChannel) SafeClose() {
	mc.once.Do(func() {
		close(mc.C)
	})
}
```


实现2：
```go
type MyChannel struct {
	C      chan T
	closed bool
	mutex  sync.Mutex
}

func NewMyChannel() *MyChannel {
	return &MyChannel{C: make(chan T)}
}

func (mc *MyChannel) SafeClose() {
	mc.mutex.Lock()
	defer mc.mutex.Unlock()
	if !mc.closed {
		close(mc.C)
		mc.closed = true
	}
}

func (mc *MyChannel) IsClosed() bool {
	mc.mutex.Lock()
	defer mc.mutex.Unlock()
	return mc.closed
}
```

## 优雅地关闭通道的办法
### M接收者 - 1发送者
```go {hl_lines=[20]}
func main() {
	rand.Seed(time.Now().UnixNano()) // Go 1.20之前需要
	log.SetFlags(0)

	// ...
	const Max = 100000
	const NumReceivers = 100

	wgReceivers := sync.WaitGroup{}
	wgReceivers.Add(NumReceivers)

	// ...
	dataCh := make(chan int)

	// 发送者
	go func() {
		for {
			if value := rand.Intn(Max); value == 0 {
				// 此唯一的发送者可以安全地关闭此数据通道。
				close(dataCh)
				return
			} else {
				dataCh <- value
			}
		}
	}()

	// 接收者
	for i := 0; i < NumReceivers; i++ {
		go func() {
			defer wgReceivers.Done()

			// 接收数据直到通道dataCh已关闭
			// 并且dataCh的缓冲队列已空。
			for value := range dataCh {
				log.Println(value)
			}
		}()
	}

	wgReceivers.Wait()
}
```

#### 变种1. 通过K第三方协程来关闭通道

可能由多个第三方协程中的任意一个协程来通知关闭 dataCh 通道

```go
func main() {
	rand.Seed(time.Now().UnixNano()) // Go 1.20之前需要
	log.SetFlags(0)

	// ...
	const Max = 100000
	const NumReceivers = 100
	const NumThirdParties = 15

	wgReceivers := sync.WaitGroup{}
	wgReceivers.Add(NumReceivers)

	// ...
	dataCh := make(chan int)
	closing := make(chan struct{}) // 信号通道
	closed := make(chan struct{})
	
	// 此stop函数可以被安全地多次调用。
	stop := func() {
		select {
		case closing<-struct{}{}:
			<-closed
		case <-closed:
		}
	}
	
	// 一些第三方协程
	for i := 0; i < NumThirdParties; i++ {
		go func() {
			r := 1 + rand.Intn(3)
			time.Sleep(time.Duration(r) * time.Second)
			stop()
		}()
	}

	// 发送者
	go func() {
		defer func() {
			close(closed)
			close(dataCh)
		}()

		for {
			select{
			case <-closing: return
			default:
			}

			select{
			case <-closing: return
			case dataCh <- rand.Intn(Max):
			}
		}
	}()

	// 接收者
	for i := 0; i < NumReceivers; i++ {
		go func() {
			defer wgReceivers.Done()

			for value := range dataCh {
				log.Println(value)
			}
		}()
	}

	wgReceivers.Wait()
}
```

代码片段解析：
```go
// 此stop函数可以被安全地多次调用。
stop := func() {
	select {
	case closing<-struct{}{}:
		<-closed
	case <-closed:
	}
}
```
当调用 stop 方法的时候，会执行：
- 向 closing 通道发送开始关闭的通知，如果发送成功，就等待 closed 通道的关闭，表示协程已经退出
- 如果发送失败，说明 closing 已经关闭，直接从 closed 通道接收一个值


- `closing ch` ：第三方协程用来通知发送方关闭通道
- `closed ch`：发送方用来通知第三方协程通道已经关闭


### 1接收者 - N发送者

新建一个用来通知发送者别再发送数据的通道，这个通道的发送者是这个场景下的接收者

```go {hl_lines=[54]}
func main() {
	rand.Seed(time.Now().UnixNano()) // Go 1.20之前需要
	log.SetFlags(0)

	// ...
	const Max = 100000
	const NumSenders = 1000

	wgReceivers := sync.WaitGroup{}
	wgReceivers.Add(1)

	// ...
	dataCh := make(chan int)
	stopCh := make(chan struct{})
		// stopCh是一个额外的信号通道。它的
		// 发送者为dataCh数据通道的接收者。
		// 它的接收者为dataCh数据通道的发送者。

	// 发送者
	for i := 0; i < NumSenders; i++ {
		go func() {
			for {
				// 这里的第一个尝试接收用来让此发送者
				// 协程尽早地退出。对于这个特定的例子，
				// 此select代码块并非必需。
				select {
				case <- stopCh:
					return
				default:
				}

				// 即使stopCh已经关闭，此第二个select
				// 代码块中的第一个分支仍很有可能在若干个
				// 循环步内依然不会被选中。如果这是不可接受
				// 的，则上面的第一个select代码块是必需的。
				select {
				case <- stopCh:
					return
				case dataCh <- rand.Intn(Max):
				}
			}
		}()
	}

	// 接收者
	go func() {
		defer wgReceivers.Done()

		for value := range dataCh {
			if value == Max-1 {
				// 此唯一的接收者同时也是stopCh通道的
				// 唯一发送者。尽管它不能安全地关闭dataCh数
				// 据通道，但它可以安全地关闭stopCh通道。
				close(stopCh)
				return
			}

			log.Println(value)
		}
	}()

	// ...
	wgReceivers.Wait()
}
```

这个例子中有两个通道 
- `stopCh`：通过接收者来关闭
- `dataCh`：用来传输数据的通道，这个通道`并没有关闭`，但是通过 stopCh 通道的关闭，使用 dataCh 通道的协程都将退出，那么这个通道`最终会被垃圾回收`，这也正是优雅性的体现（不关闭一个通道也实现了停用一个通道，没遵守通道关闭原则，也没违背？）

### M接收者 - N发送者

引入一个`调解协程`，让其关闭一个额外的信号通道，来通知所有的接收者和发送者结束工作

```go
func main() {
	rand.Seed(time.Now().UnixNano()) // Go 1.20之前需要
	log.SetFlags(0)

	// ...
	const Max = 100000
	const NumReceivers = 10
	const NumSenders = 1000

	wgReceivers := sync.WaitGroup{}
	wgReceivers.Add(NumReceivers)

	// ...
	dataCh := make(chan int)
	stopCh := make(chan struct{})
		// stopCh是一个额外的信号通道。它的发送
		// 者为中间调解者。它的接收者为dataCh
		// 数据通道的所有的发送者和接收者。
	toStop := make(chan string, 1)
		// toStop是一个用来通知中间调解者让其
		// 关闭信号通道stopCh的第二个信号通道。
		// 此第二个信号通道的发送者为dataCh数据
		// 通道的所有的发送者和接收者，它的接收者
		// 为中间调解者。它必须为一个缓冲通道。

	var stoppedBy string

	// 中间调解者
	go func() {
		stoppedBy = <-toStop
		close(stopCh)
	}()

	// 发送者
	for i := 0; i < NumSenders; i++ {
		go func(id string) {
			for {
				value := rand.Intn(Max)
				if value == 0 {
					// 为了防止阻塞，这里使用了一个尝试
					// 发送操作来向中间调解者发送信号。
					select {
					case toStop <- "发送者#" + id:
					default:
					}
					return
				}

				// 此处的尝试接收操作是为了让此发送协程尽早
				// 退出。标准编译器对尝试接收和尝试发送做了
				// 特殊的优化，因而它们的速度很快。
				select {
				case <- stopCh:
					return
				default:
				}

				// 即使stopCh已关闭，如果这个select代码块
				// 中第二个分支的发送操作是非阻塞的，则第一个
				// 分支仍很有可能在若干个循环步内依然不会被选
				// 中。如果这是不可接受的，则上面的第一个尝试
				// 接收操作代码块是必需的。
				select {
				case <- stopCh:
					return
				case dataCh <- value:
				}
			}
		}(strconv.Itoa(i))
	}

	// 接收者
	for i := 0; i < NumReceivers; i++ {
		go func(id string) {
			defer wgReceivers.Done()

			for {
				// 和发送者协程一样，此处的尝试接收操作是为了
				// 让此接收协程尽早退出。
				select {
				case <- stopCh:
					return
				default:
				}

				// 即使stopCh已关闭，如果这个select代码块
				// 中第二个分支的接收操作是非阻塞的，则第一个
				// 分支仍很有可能在若干个循环步内依然不会被选
				// 中。如果这是不可接受的，则上面尝试接收操作
				// 代码块是必需的。
				select {
				case <- stopCh:
					return
				case value := <-dataCh:
					if value == Max-1 {
						// 为了防止阻塞，这里使用了一个尝试
						// 发送操作来向中间调解者发送信号。
						select {
						case toStop <- "接收者#" + id:
						default:
						}
						return
					}

					log.Println(value)
				}
			}
		}(strconv.Itoa(i))
	}

	// ...
	wgReceivers.Wait()
	log.Println("被" + stoppedBy + "终止了")
}
```

注意：
- `toStop` 的容量必须为 1。如果它的容量为 0，那么如果调解协程未就绪，就已经有某个协程往 toStop 发送信号，这个信号会被忽略掉

### N发送者的变种：dataCh 必须被关闭

// todo

---
1. https://gfw.go101.org/article/channel-closing.html
