# golang 一些问题记录

<!--more-->
#

## Go 语言中，结构体中长度为 0 的字段为什么会影响结构体的大小？

{{< admonition type=quote title="ans" open=false >}}
举个例子：
```go
type A struct {
	a int32
	b struct{}
}
```

结构体 A.a 为 4 个字节，b 的尺寸为 0 ，但是结构体 A 的尺寸为 8，说明 b 的字段影响到了结构体的尺寸，为什么？

结论：为了防止访问字段的时候发生越界

假设结构体 A 的尺寸为 4，那么当 b 的字段不为空的时候，访问字段 b 就会访问到 A 对象内存之外的空间，这是不可知的
{{< /admonition >}}


## 赋值是原子操作吗？

{{< admonition type=quote title="ans" open=false >}}
不是。

{{< mermaid >}}
flowchart LR
a[寄存器 or 内存]-->|读取|b[寄存器]
b-->|写入|c["内存地址(变量)"]
{{< /mermaid >}}

可以将赋值分为两步：
1. 从寄存器或者内存中读取右侧变量的值，读到寄存器中
2. 将寄存器中的值写入左侧变量所在的内存地址

{{< /admonition >}}


## time.Sleep(d) 的状态转换？

{{< admonition type=quote title="and" open=false >}}

{{< mermaid >}}
stateDiagram-v2
[*]-->运行

运行-->阻塞: time.Sleep(d)

阻塞-->就绪: 到达指定的 d 时间

就绪-->运行: 被调度器重新调度 t
{{< /mermaid >}}

从上面的状态转换可以看出来，使用 time.Sleep(d) 并不能精确的达到 d 时间之后继续执行的效果，还需要考虑上被调度器重新调度的时间 t

{{< /admonition >}}


## 标准库包`math/rand`和`crypto/rand`生成的随机数之间有什么区别？

{{< admonition type=quote title="ans" open=false >}}

通过`math/rand`标准库包生成的伪随机数序列对于给定的种子是确定的。 这样生成的随机数不适用于安全敏感的环境中。

`crypto/rand` 包提供了一个安全的随机数生成器，它可以用于生成密码学上安全的伪随机序列。这个伪随机序列是根据操作系统提供的熵池（entropy pool）中的随机数据生成的。

熵池是由操作系统维护的一些随机数据的集合，包括硬件事件（如键盘输入、鼠标移动、磁盘访问等）和软件事件（如进程调度、网络流量等）。这些事件产生的随机数据被混合在一起，并经过加密哈希函数处理，生成一个种子值。然后，这个种子值被输入到伪随机数生成算法中，生成伪随机序列。

由于熵池中的随机数据是由多个不可预测的源产生的，因此生成的伪随机序列具有高度的随机性和不可预测性，可以满足密码学上的安全要求。

{{< /admonition >}}


## Go 语言中，哪些类型是不能比较的？

{{< admonition type=quote tile=example" open=false >}}

Go 语言中，引用类型不能比较，值类型可以比较
- 引用类型：map、slice、function
- 值类型：int、bool、float、string、array...

对于引用类型来说，他们通常指向一个底层的数据，如果直接对引用类型进行比较，比较的是他们的地址，而不是实际的底层数据，这是不符合期望的

{{< /admonition >}}


## 定义可寻址跟不可寻址的出发点是什么

{{< admonition type=quote title="example" open=false >}}

在 Go 语言中，定义可寻址和不可寻址的出发点是为了保证程序的安全性和正确性。

可寻址的值是指可以通过取地址符 & 获取其内存地址的值。在 Go 语言中，变量、数组元素、结构体字段以及通过指针间接引用的值都是可寻址的。

不可寻址的值是指不能通过取地址符 & 获取其内存地址的值。在 Go 语言中，常量、字面量、表达式结果以及函数返回值等都是不可寻址的。

这种区分可寻址和不可寻址的值的做法可以避免一些潜在的问题，例如：

1.  防止对常量进行修改：常量是不可寻址的，因此无法通过指针来修改常量的值，从而保证了常量的不可变性。
    
2.  避免对临时变量进行取地址操作：临时变量是不可寻址的，如果对其进行取地址操作，则可能会导致程序崩溃或者产生不可预期的结果。
    
3.  确保函数返回值的安全性：如果函数返回值是不可寻址的，那么就可以避免在函数外部对其进行修改，从而保证了函数返回值的安全性。
    

总之，Go 语言中定义可寻址和不可寻址的出发点是为了保证程序的安全性和正确性，避免一些潜在的问题。


{{< /admonition >}}


## 列举一些可寻址类型、不可寻址类型

{{< admonition type=quote title="example" open=false >}}

可寻址的类型：
1. 指针类型
```go
var p *int = new(int)
```
2. 数组类型
```go
var arr [3]int
```
3. 切片类型
```go
var s []int
```
4. 结构体类型
```go
var p Person
```
5. 数组指针类型
```go
var p *[3]int = new([3]int)
```
6. 结构体指针类型
```go
var p *Person = new(Person)
```


不可寻址的类型：
1. 常量
```
const PI = 3.14
```
2. 字面量
```go
var p *int = &10 // error:cannot take the address of 10
```
3. 表达式结果
```go
var x int = 1 + 2 // 错误：cannot take the address of 1 + 2
```
4. 接口类型
```go
var i interface{} = 42 // 错误：cannot take the address of i
```

{{< /admonition >}}


## &T{} 的写法是允许的，能够说明 T{} 是能够被寻址的吗？

{{< admonition type=quote title="example" open=false >}}

`T{}`  并不能被寻址


`&T{}` 实际上是一个**语法糖**：

```go
tmp := T{}
(&tmp)
```

由于变量是能够被寻址的，因此上面的写法是允许的

{{< /admonition >}}


## 为什么 map（映射）元素不可被取地址

{{< admonition type=quote title="example" open=false >}}

1. 映射元素的地址可能改变
2. 可能是零值

{{< /admonition >}}


## 在 Go 中，为什么返回一个局部变量的地址是安全的

{{< admonition type=quote title="example" open=false >}}

当一个函数返回局部变量的地址时，会将该变量的值赋值到堆上，并返回该变量的地址

{{< /admonition >}}


## 一个值的地址在程序运行的过程中为什么会发生改变

{{< admonition type=quote title="example" open=false >}}

比如当一个协程的栈的大小发生改变时，开辟在此栈上的内存块需要移动，因此地址就会发生改变

{{< /admonition >}}

## Go 101 中的一些总结

[https://gfw.go101.org/article/summaries.html#type-with-underlyings](https://gfw.go101.org/article/summaries.html#type-with-underlyings)

---
## 为什么遍历 map 是无序的

{{< admonition type=quote title="example" open=false >}}
1. map 扩容之后，key 的位置会发生变化
2. 在 1. 的认知上，是不是只要给定一个只读的 map，遍历结果就会是有序的？不是的，go 为了防止新手勿用 map，甚至设定了这样一个机制：每次开始遍历的桶是随机的，并不是每次都从第一个桶开始遍历
{{< /admonition >}}

## 数组与切片的关系

![图 5](images/posts/20230528-153032089.png)  

修改切片：

![图 6](images/posts/20230528-153043313.png)  

![图 7](images/posts/20230528-153102978.png)  

当切片长度已经达到容量，继续添加元素会重新开辟一个空间


## 内存被开辟在哪里？

Go 程序运行的时候，每个协程维护一个`栈`，开辟在栈上的内存块只能在此协程内部使用

每个程序有一个`堆`，堆是一个虚拟的概念，开辟在堆上的内存块所有的协程都能够访问

**如何决定开辟在栈还是堆上？**

如果编译器察觉到一个内存块可能会被多个协程访问，或者无法保证一个内存块只被一个协程访问，那么这个内存块就会被开辟在堆上，这是保守且安全的。

`栈让 Go 的运行效率更高`
- 在栈上开辟内存**更快**
- 栈上的内存块**不需要垃圾回收**（栈式内存管理：当函数被调用时，编译器会将栈帧压入栈中，当函数执行完毕后，编译器会将栈帧从栈中弹出，这样就自动释放了该函数所使用的所有内存空间）
- 对 **CPU 缓存**更友好
