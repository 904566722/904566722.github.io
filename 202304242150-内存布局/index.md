# 内存布局

<!--more-->

#Golang 


![](images/posts/Pasted%20image%2020230424234822.png)
问题：两个数据有相同的内存布局，应该满足什么条件？

# 类型对齐保证
出于对程序性能的考虑，每个类型都会有对应的对齐保证，根据该类型是否被作为结构字段，对齐保证分为两类：
- 字段对齐保证
- 一般对齐保证
> 说法：如果一个类型的对齐保证为N，那么就说这个类型是 **N 字节对齐**的

这两类对齐保证对应的获取方式：
- `unsafe.Alignof(t)`   （编译的时候估值）
- `reflect.TypeOf(t).Align()`
- `reflect.TypeOf(t).FieldAlign()`
```go
type X struct {  
   c int32  
   d int64  
}  
  
func getAlignmentGuarantee() {  
   var a int32  
   // 使用 unsafe.Alignof()   fmt.Println(unsafe.Alignof(a))     // 4    （获取 int32 的一般对齐保证）  
   fmt.Println(unsafe.Alignof(X{}.c)) // 4    （获取 int32 的字段对齐保证）  
   fmt.Println(unsafe.Alignof(X{}.d)) // 8  
   fmt.Println(unsafe.Alignof(X{}))   // 8  
  
   // 使用  reflect.TypeOf(a).Align() 以及 reflect.TypeOf(a).FieldAlign()
   fmt.Println(reflect.TypeOf(a).Align())    // 4  
   fmt.Println(reflect.TypeOf(a).FieldAlign())    // 4  
}
```
> 注意上面程序的输出并不是固定的，相同的编译器在不同的架构上、不同的编译器在相同的架构上，都有可能产生不同的输出
> Go 编译器中，对类型对齐保证要求：
> 1. unsafe.Alignof(t) >= 1
> 2. unsafe.Alignof(结构) = 结构体字段的字段对齐保证的**最大值**
> 3. unsafe.Alignof(数组) = unsafe.Alignof(元素类型) 
# 结构体的字节填充
为了能够让结构体的尺寸为类型对齐保证的 N 倍，有时候需要对结构进行字节补齐，看下面的一个例子，展示了两个内容：
- 结构体尺寸的计算
- 结构体的字节填充
```go
// 假设在 64 位机器上的情况  
type T1 struct {  
   a int8  
   // 为了让 b 能够8字节对齐，这里要填充 7 个字节  
   b int64  
   c int16  
   // 前面一共的尺寸为 1 + 7 + 8 + 2 = 18 个字节  
   // 为了让 T1 的尺寸为 8 的倍数，这里需要填充 24 - 18 = 6 个字节  
}  
// 因此 T1 类型的尺寸为 24 个字节  
  
type T2 struct {  
   a int8  
   // 为了让 b 能够 2 字节对齐，这里填充 1 字节  
   b int16  
   // 为了让 c 能够 8 字节对齐，这里填充 4 字节  
   c int64  
   // 前面一共 1 + 1 + 2 + 4 + 8 = 16 字节，因此这里不需要再填充  
}  
// 因此 T2 类型的尺寸为 16 个字节
```
从上面这个例子可以看到，尽管 T1 跟 T2 拥有一样的字段类型，但因为排列的不同，导致字节填充的数量不同，因此其尺寸也不同。
问题：[[202304242320 一个零尺寸的类型有没有可能影响到结构体的尺寸]]


---
1. 《内存布局 -Go语言101》. 见于 2023年4月24日. [https://gfw.go101.org/article/memory-layout.html](https://gfw.go101.org/article/memory-layout.html).
2. 《The Go Programming Language Specification - The Go Programming Language》. 见于 2023年4月24日. [https://go.dev/ref/spec](https://go.dev/ref/spec).
3. The Go Programming Language Specification 中文：[https://github.com/saberuster/Go-Language-Specification](https://github.com/saberuster/Go-Language-Specification)
