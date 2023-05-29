# new 和 make

<!--more-->
#

{{< admonition warning "about card" false >}}
这是一个临时性的**卡片文章**，之后可能:
1. `针对该卡片进行扩展，形成文章`
2. `与已有文章关联，组织到其他文章`
3. `删除`
{{< /admonition>}}


## 区别

|new|make|
|-|-|
|分配内存|分配内存并初始化|
|返回指向类型的指针|返回对象的引用|

## 使用场景

- new 用来创建值类型的对象，比如 int、float...
- make 用来创建指针持有者类型的对象，比如 slice、map、channel...

看下面的例子：

```go
package main

import "fmt"

func main() {
	a := make([]int, 1)
	mp := make(map[int]int, 1)
	b := new(int)
	c := new(string)
	d := new(float32)
	fmt.Println(a, b, mp, c, d)
}
```

- `a := make([]int, 1)`

    ```text
    main.go:6       0x6097d5        e88630faff              call $runtime.makeslice

    进入 runtime.makeslice 并打印 et（元素类型）
    (dlv) print et
    *runtime._type {size: 8, ptrdata: 0, hash: 3413333906, tflag: tflagUncommon|tflagExtraStar|tflagNamed|tflagRegularMemory (15), align: 8, fieldAlign: 8, kind: 2, equal: runtime.memequal64, gcdata: *0, str: 576, ptrToThis: 20480}
    ```
    通过汇编可以看到调用了 [makeslice](https://github.com/golang/go/blob/7ad92e95b56019083824492fbec5bb07926d8ebd/src/runtime/slice.go#L88) 方法，返回一个 unsafe.Pointer 指向初始化的内容

    `runtime.makeslice`:
    ```go
    func makeslice(et *_type, len, cap int) unsafe.Pointer {
        ...
    }
    ```
    其中 `_type` ([[2023052919 Golang 中的 _type 结构]]) 用来描述类型 

- `mp := make(map[int]int, 1)`

    ```text
    main.go:7       0x3097f1        e88a4ef6ff              call $runtime.makemap_small
    
    ```
    由于 mp 的长度比较小，调用了 [runtime.makemap_small](https://github.com/golang/go/blob/7ad92e95b56019083824492fbec5bb07926d8ebd/src/runtime/map.go#L294) 方法，返回一个 hmap 类型的指针

    `runtime.makemap_small`

    ```go
    func makemap_small() *hmap {
        ...
    }
    ```
    打印 hmap 结果：
    ```text
    *runtime.hmap {
        count: 0,
        flags: 0,
        B: 0,
        noverflow: 0,
        hash0: 1065545564,
        buckets: unsafe.Pointer(0x0),
        oldbuckets: unsafe.Pointer(0x0),
        nevacuate: 0,
        extra: *runtime.mapextra nil,}
    ```

- `b := new(int)`

    调用了 [runtime.newobject](https://github.com/golang/go/blob/7ad92e95b56019083824492fbec5bb07926d8ebd/src/runtime/malloc.go#L1323) 方法，分配一个类型为 int 的零值，返回其指针

- `c := new(string)`

    调用了 [runtime.newobject](https://github.com/golang/go/blob/7ad92e95b56019083824492fbec5bb07926d8ebd/src/runtime/malloc.go#L1323) 方法，分配一个类型为 string 的零值，返回其指针

- `d := new(float32)`

    调用了 [runtime.newobject](https://github.com/golang/go/blob/7ad92e95b56019083824492fbec5bb07926d8ebd/src/runtime/malloc.go#L1323) 方法，分配一个类型为 float32 的零值，返回其指针


总的来说，make 会调用具体类型的初始化方法来初始化该类型，new 会调用 newobject 方法来初始化这个类型，返回其指针
