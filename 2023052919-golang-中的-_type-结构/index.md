# Golang 中的 _type 结构

<!--more-->
#

{{< admonition warning "about card" false >}}
这是一个临时性的**卡片文章**，之后可能:
1. `针对该卡片进行扩展，形成文章`
2. `与已有文章关联，组织到其他文章`
3. `删除`
{{< /admonition>}}


```go
type _type struct {
    size       uintptr
    ptrdata    uintptr // size of memory prefix holding all pointers
    hash       uint32
    tflag      tflag
    align      uint8
    fieldAlign uint8
    kind       uint8
    // function for comparing objects of this type
    // (ptr to object A, ptr to object B) -> ==?
    equal func(unsafe.Pointer, unsafe.Pointer) bool
    // gcdata stores the GC type data for the garbage collector.
    // If the KindGCProg bit is set in kind, gcdata is a GC program.
    // Otherwise it is a ptrmask bitmap. See mbitmap.go for details.
    gcdata    *byte
    str       nameOff
    ptrToThis typeOff
}
```
在 Golang 源码中，_type 结构体的每个字段分别代表以下内容：

- size：类型的大小（字节）。
- ptrdata：指向类型的指针所需的前缀大小（字节）。
- hash：类型的哈希值。
- tflag：类型标志位，用于描述类型的一些特性，如是否为指针、是否可比较等。
- align：类型的对齐方式（字节）。
- fieldAlign：结构体字段的对齐方式（字节）。
- kind：类型的种类，如 int、string、struct 等。
- equal：比较两个对象是否相等的函数指针。
- gcdata：垃圾回收器使用的类型数据。如果 kind 中设置了 KindGCProg 标志位，则 gcdata 是一个 GC 程序；否则它是一个 ptrmask 位图。
- str：类型名称在字符串表中的偏移量。
- ptrToThis：指向该类型的指针的类型信息在类型表中的偏移量。

其中，size 字段的单位是字节。
