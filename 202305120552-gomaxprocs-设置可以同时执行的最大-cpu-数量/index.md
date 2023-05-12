# GOMAXPROCS 设置可以同时执行的最大 CPU 数量

<!--more-->
#并行

## 简单测试

```go {hl_lines=[15]}
func HighUseCPU(n int) float64 {
    numCPU := runtime.NumCPU()

    if n <= 1 {
        numCPU = 1
    } else if n < numCPU {
        numCPU = n
    } else {
        // pass
    }

    //log.Printf("set the number of cpu that can run simultaneously: %d", numCPU)

    // 设置可以同时执行的最大 CPU 的数量，提高并发的效率
    runtime.GOMAXPROCS(numCPU)

    // 并发测试
    startTime := time.Now()
    var wg sync.WaitGroup
    for i := 0; i < 16; i++ {
        wg.Add(1)
        go func(i int) {
            defer wg.Done()
            process()
        }(i)
    }
    wg.Wait()

    timeSpend := time.Since(startTime).Seconds()
    //log.Printf("time: %f\n", timeSpend)
    return timeSpend
}

func process()  {
    cnt := 0
    for i := 0; i < 1000000; i++ {
        cnt++
    }
}
```

分别进行1、4、8 核的测试（在8核环境上测试）：

```go
func TestHighUseCPU(t *testing.T) {
    var avgOneCpu float64 = 0
    for i := 0; i < 100; i++ {
        avgOneCpu += HighUseCPU(1)
    }

    var avgFourCpu float64 = 0
    for i := 0; i < 100; i++ {
        avgFourCpu += HighUseCPU(4)
    }

    var avgEightCpu float64 = 0
    for i := 0; i < 100; i++ {
        avgEightCpu += HighUseCPU(8)
    }

    log.Printf("\naverage time(1cpu): %f\naverage time(4cpu): %f\naverage time(8cpu):%f\n", avgOneCpu/100, avgFourCpu/100, avgEightCpu/100)
}
```

测试结果：

```go
average time(1cpu): 0.006329
average time(4cpu): 0.001883
average time(8cpu): 0.001284
```

可以看到设置设置的数值越接近环境的 cpu 核数，并发的效率越高，当然不是固定的，继续增加这个数量可能会带来更好的性能，也可能更坏，可以根据实际场景进行压测

## 源码

```go
// GOMAXPROCS sets the maximum number of CPUs that can be executing// simultaneously and returns the previous setting. It defaults to  
// the value of runtime.NumCPU. If n < 1, it does not change the current setting.  
// This call will go away when the scheduler improves.  
func GOMAXPROCS(n int) int {  
   if GOARCH == "wasm" && n > 1 {  
      n = 1 // WebAssembly has no threads yet, so only one CPU is possible.  
   }  
  
   lock(&sched.lock)  
   ret := int(gomaxprocs)  
   unlock(&sched.lock)  
   if n <= 0 || n == ret {  
      return ret  
   }  
  
   stopTheWorldGC("GOMAXPROCS")  
  
   // newprocs will be processed by startTheWorld  
   newprocs = int32(n)  
  
   startTheWorldGC()  
   return ret  
}
```

该函数主要用来控制可以同时执行的最大 cpu 数量，默认为系统 cpu 数量（在 [webassembly](https://webassembly.org/) 中是没有线程的，设置为1）

todo

## 越大越好？

该方法主要用来优化程序的性能，控制 golang 程序执行的并发程度，但是这个值并 **`不是越大越好`** 的，举个如下的例子：

- 执行 1 + 1 的任务
- 4 个 cpu
- 设置 GOMAXPROCS 的值为 1000

每个 cpu 分到 250 个任务，为了能够同时运行这 250 个任务，cpu 的时间可能会大量浪费在 `上下文切换` 的任务上，而不是实际的计算任务

同时每个线程都需要有自己的内存空间，过多的线程也会 `给内存带来压力`

实际测试：

环境：具有 4 个 cpu 的 centos
![](images/posts/Pasted%20image%2020230512075016.png)

给方法多传入一个变量，控制程序创建的协程数量
```go
func HighUseCPU(n int, par int) float64 {  
   numCPU := runtime.NumCPU()  
  
   if n <= 1 {  
      numCPU = 1  
   } else {  
      numCPU = n  
   }  
  
   log.Printf("set the number of cpu that can run simultaneously: %d", numCPU)  
  
   // 设置可以同时执行的最大 CPU 的数量，提高并发的效率  
   runtime.GOMAXPROCS(numCPU)  
  
   // 并发测试  
   startTime := time.Now()  
   var wg sync.WaitGroup  
   for i := 0; i < par; i++ {  
      wg.Add(1)  
      go func(i int) {  
         defer wg.Done()  
         process()  
      }(i)  
   }  
   wg.Wait()  
  
   timeSpend := time.Since(startTime).Seconds()  
   return timeSpend  
}  
  
func process()  {  
   cnt := 0  
   for i := 0; i < 100000000; i++ {  
      cnt++  
   }  
}
```


先看一下当协程数量发生变化的时候，花费时间情况是怎么样的

协程数量：4

```
average time(1cpu): 0.251251
average time(4cpu): 0.095817
average time(8cpu):0.090954
```

协程数量：8

```
average time(1cpu): 0.490758
average time(4cpu): 0.189642
average time(8cpu):0.173086
```

从上面协程数量变化导致的结果来看，随着协程数量的不断上升，cpu 数量设置较小的情况下，时间上升明显，可以看出来为了处理大量并发，cpu 把时间浪费在了上下文切换的时间上，当我把协程数量设置成 16 的时候，时间已经很慢了


## Q&A

1. 我们已经知道 GOMAXPROCS 设置的值并非越大越好，那么什么情况可能会导致这个值比我们预期的要大？

	在 `容器` 场景下可能会出现这种情况，如果容器中的程序获取到了宿主机的 cpu 数量，比如宿主机有几十核，而容器可能只有两核或者更少

