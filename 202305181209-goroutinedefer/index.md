# goroutine、defer

<!--more-->

## goroutine

- 并发与并行
![](images/posts/Pasted%20image%2020230518121541.png)

**并发**：两个计算只在一小段时间内会同时运行，但大部分是分开运行的，cpu 通过不断的上下文切换让两个计算看起来是同时运行的

**并行**：任何时间内，两个计算都是同时运行的

|类型|特点|是否共享资源|
|-|-|-|
|并发|交替运行，也有可能同时运行|共享|
|并行|同时运行|不共享|

- 协程和线程

|类型|调度|切换开销|
|-|-|-|
|协程|用户态|开销小|
|线程|系统调度|开销大|

### 并发控制

❌ 先看个错误的例子：
```go
func main() {  
   rand.Seed(time.Now().UnixNano()) // Go 1.20之前需要  
   log.SetFlags(0)  
   go SayGreetings("hi!", 10)  
   go SayGreetings("hello!", 10)  
   time.Sleep(2 * time.Second)  
}  
  
func SayGreetings(greeting string, times int) {  
   for i := 0; i < times; i++ {  
      log.Println(greeting)  
      d := time.Second * time.Duration(rand.Intn(5)) / 2  
      time.Sleep(d) // 睡眠片刻（随机0到2.5秒）  
   }  
}
```

上面程序的输出可能为：
```go
hi!
hello!
hello!
hello!
hi!
hi! 
```
并没有各自打印完 10 次结果，因为在程序的主协程推出之后，两个 SayGreetings 的任务也退出了，**没有等到任务结束**

#### 数据竞争
在并发任务中，常见的数据竞争：
- 一个写数据，一个读数据
- 两个都写数据
如果不做同步，都可能导致数据出错

#### WaitGroup

```go {hl_lines=[1,6,9,18]}
var wg sync.WaitGroup  
  
func main() {  
   rand.Seed(time.Now().UnixNano()) // Go 1.20之前需要  
   log.SetFlags(0)  
   wg.Add(2)  
   go SayGreetings("hi!", 10)  
   go SayGreetings("hello!", 10)  
   wg.Wait()  
}  
  
func SayGreetings(greeting string, times int) {  
   for i := 0; i < times; i++ {  
      log.Println(greeting)  
      d := time.Second * time.Duration(rand.Intn(5)) / 2  
      time.Sleep(d) // 睡眠片刻（随机0到2.5秒）  
   }  
   wg.Done()  
}
```

经过上面的修改，总共打印了 20 条语句，说明主协程等两个任务都完成了才退出

#### 协程的状态

- 运行
- 阻塞 （协程不区分睡眠、就绪状态，比如通过 time.Sleep 调用让协程进入睡眠，时间到了之后应该处于就绪态，等待系统调度。协程认为睡眠、就绪为运行状态）
> `协程不能从阻塞状态退出`
> 
> 协程的阻塞状态必须是被动结束的（被另一个协程通过某种同步方法被动结束）

#### 协程的调度

同一时刻，最多同时运行的协程数量 = 逻辑 cpu 的数量。

>  `逻辑cpu`，是由计算机的处理器、超线程技术同时决定的
>  
>  比如：
>  - 一个不支持超线程的双核处理器，逻辑cpu = 2
>  - 一个支持超线程的双核四线程处理器，相当于 2 个物理 cpu、4 个逻辑 cpu

![](images/posts/Pasted%20image%2020230518130309.png)

go 标准编译器通过 MPG 模型（[202305181327 Go 的并发调度：MPG模型](content/posts/go/golang-underlying/202305181327%20Go%20的并发调度：MPG模型.md)）来实现协程的调度

## defer

一个延迟调用的语句被执行时，其中的延迟函数不会马上被执行，而是推入由当前协程维护的一个**栈**中，在方法退出之前再依次执行

注意点：
- 如果发生了 panic，defer 的内容是不会执行的
- 传入的参数是注册时求值，而不是执行时求值

```go
func main() {
	defer fmt.Println("The third line.")
	defer fmt.Println("The second line.")
	fmt.Println("The first line.")
}
```
输出结果：
```txt
The first line.
The second line.
The third line.
```

关于估值的问题：
- 延迟调用的**实参**在`注册的时候估值`
- **匿名函数**体内的表达式实在函数`被执行的时候估值`
```go
func main() {
	func() {
		for i := 0; i < 3; i++ {
			defer fmt.Println("a:", i)
		}
	}()
	fmt.Println()
	func() {
		for i := 0; i < 3; i++ {
			defer func() {
				fmt.Println("b:", i)
			}()
		}
	}()
}
```
因此上面的程序输出：
```txt
a: 2
a: 1
a: 0

b: 3
b: 3
b: 3
```



----
1. https://gfw.go101.org/article/control-flows-more.html
