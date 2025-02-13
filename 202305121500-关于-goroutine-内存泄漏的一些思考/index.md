# 关于 goroutine 内存泄漏的一些思考

<!--more-->
#Golang 

## 为什么会内存泄漏

**内存泄漏**是指 `GC 没有办法不被使用的空间`，内存无法释放，最终导致内存不足或者占满

为什么会内存泄漏，可能会有这些原因：
- 无限循环
- 循环引用，两个对象存在互相引用的情况会导致这两个对象最终都无法被回收
- 请求的资源被占用，一直阻塞
- 未关闭的通道，如果一个协程往一个未关闭的通道发送数据，但是一直没有被接受，就会一直阻塞
- ...

## 如何判断一个 goroutine 是否内存泄漏

如何使用  pprof 排查

## 场景

---
❌ 下面的代码会启动一个协程来处理一个请求，尽管当这个请求被取消，这个协程还是会一直存在，直到处理结束（谁又知道结没结束呢）
```go
func users(req *Request) { 
    // 启动一个 goroutine 来处理请求 
    go func() { 
        // 处理请求... 
    }() 
}
```

✅ 使用 `context` 来控制这个协程的生命周期（你不停也得停）
```go
func users(ctx context.Context, req *Request) { 
    // 启动一个 goroutine 来处理请求 
    go func(ctx context.Context) { 
        // 处理请求... 
    }(ctx) 
}
```
