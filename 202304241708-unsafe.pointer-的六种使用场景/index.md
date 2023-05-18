# unsafe.Pointer 的六种使用场景

<!--more-->

#Golang #unsafe

概念：Pointer 表示一个指针，可以指向**任何类型**

四个特殊操作：
1. 任何类型的指针值 可转化为 Pointer
2. Pointer 可转化为 任何类型的指针值
3. uintptr 可转化为 Pointer
4. Pointer 可转化为 uinptr

由于以上四个特性，Pointer 能够实现让程序绕过类型系统，读写任意内存（使用时需格外小心）

## 下面列举 unsafe 包中列举的 unsafe.Pointer 使用的六种场景

### （1）\*T1 --> Pointer --> \*T2
需要满足要求：
- T2 不大于 T1
- T1、T2 共享相同的内存布局 ([202304242150 内存布局](content/posts/go/golang-underlying/202304242150%20内存布局.md))

则这种转换是允许的

例子1. 一个 float64 值转为 uint64 的值
```go
func float64bits(f float64) uint64 {  
   return *(*uint64)(unsafe.Pointer(&f))  
}
```

另外一个例子，`将字符串转换为字节切片`，首先我们看一下在 64 位系统中两者的尺寸
```go
var s string  
var bs []byte  
fmt.Println(unsafe.Sizeof(s))  // 16  
fmt.Println(unsafe.Sizeof(bs)) // 24
```
- 字符串 16 字节
- 字节切片 24 字节

字符串与字节切片的内存布局类似，且字节切片的尺寸不小于字符串的尺寸，因此将字节切片转到字符串是安全的，让我们来看实现：
```go
func byteSlice2String(bs []byte) string {  
   return *(*string)(unsafe.Pointer(&bs))  
}
```
**这种实现的优点是避免了底层对字节序列的一次开辟和复制**

而如果要用此方式来实现从 string 到 []byte 则是**不安全**的：
```go
// 这种转换是不安全的  
func string2Bytes(s string) []byte {  
   return *(*[]byte)(unsafe.Pointer(&s))  
}
```

### （2）Pointer --> uintptr （用途少）
从指针转到 uintptr 类型实际上产生了一个**没有指针语义的整数**（代表指针指向值的内存地址，只是一个整数，不是引用），所以这种情况下，再将 uintptr 转回指针是无效的，通常的用法是将这个 uintptr 打印出来
> 即使uintptr保存了某个对象的地址，如果对象移动，垃圾收集器也不会更新该uintptr的值，也不会阻止该对象被回收

下面的情况说明了从 uintptr 转到 Pointer 的可能场景
### （3）算数运算 （Pointer --> uintptr --> 运算 --> Pointer）
这种操作通常是用来访问：
- 结构的字段
- 数组的元素

一个例子：
```go
// ** 通过 uintptr 来访问结构中的字段、数组的元素 **  
type T struct {  
   a    int16  
   arr  [3]int32  
}  
  
func uintptr2PointerPractice() {  
   // unsafe.Sizeof(T{}.a)    // 2  
   M := unsafe.Offsetof(T{}.arr)        // 4  
   N := unsafe.Sizeof(T{}.arr[0])       // 4  
   fmt.Println(unsafe.Sizeof(T{}.a))    // 2  
   fmt.Println(unsafe.Sizeof(T{}.arr))  // 3 * 4 = 12  
   fmt.Println(unsafe.Sizeof(T{}))      // 16  
  
   t := &T{  
      arr: [3]int32{1, 2, 3},  
   }  
   // 直接访问 t.arr 的最后一个元素  
   tp := unsafe.Pointer(t) // 先将 t 转为非安全指针  
   // 将 uintptr 进行算数运算后再转为非安全指针  
   arrp := unsafe.Pointer(uintptr(tp) + M + N + N)  
   // 将非安全指针转为数组元素类型指针  
   ans := (*int32)(arrp)  
   // ans := (*int32)(unsafe.Pointer(uintptr(tp) + M + N + N))
  
   fmt.Println(*ans)  // output: 3  
}
```

特别注意在这种场景下，可能会发生的很隐秘的 bug：
```go
func uintptr2PointerPractice2() {  
   // unsafe.Sizeof(T{}.a)    // 2  
   M := unsafe.Offsetof(T{}.arr)       // 4  
   N := unsafe.Sizeof(T{}.arr[0])      // 4  
  
   t := T{  
      arr: [3]int32{1, 2, 3},  
   }  
   uptr := uintptr(unsafe.Pointer(&t)) + M + N + N  
     
   // 中间其他操作  
   
   elemP := (*int32)(unsafe.Pointer(uptr))  
  
   fmt.Println(*elemP) // output: 3  
}
```
`前面提到了，虽然 uintptr 保存了 t 的地址的值，但是并不会阻止垃圾回收机制将 t 回收，所以在中间其他操作的时候，一旦 t 被回收，后面的地址将指向不可预测的内容。`
> 实际上，像 Goland 编码工具在编码的时候就会给出提示：
> ![](images/posts/Pasted%20image%2020230425021503.png)

### （4）Pointer --> uintptr --> syscall
在 syscall 系统调用中，可能会根据调用的具体实现将 uintptr 重新转为指针

注意：转换必须在调用的表达式中出现，在系统调用期间隐式转换为指针之前，uintptr 不能保存在变量中
正确：
```go
syscall.Syscall(SYS_READ, uintptr(fd), uintptr(unsafe.Pointer(p)), uintptr(n))
```
错误
```go
u := uintptr(unsafe.Pointer(p))  
// p 所引用的对象可能在这个时候被垃圾回收，或者 p 的地址发生改变
syscall.Syscall(SYS_READ, uintptr(fd), u, uintptr(n))
```

### （5）将 `reflect.Value.Pointer` 或者 `reflect.Value.UnsafeAddr` 的结果从 uintptr 转到 Pointer
### （6）将一个`reflect.SliceHeader`或者`reflect.StringHeader`值的`Data`字段转换为非类型安全指针，以及其逆转换
首先我们来看`reflect.SliceHeader` 和 `reflect.StringHeader` 的定义：
```go
// StringHeader是字符串的运行时表示形式。
// 它不能安全或可移植地使用，并且它的表示可能在以后的版本中更改。
// 此外，Data字段不足以保证它引用的数据不会被垃圾收集，
// 因此程序必须保留一个单独的、类型正确的指向底层数据的指针。
type StringHeader struct {  
 Data uintptr  
 Len  int  
}

// SliceHeader是切片的运行时表示。
// 它不能安全或可移植地使用，并且它的表示可能在以后的版本中更改。
// 此外，Data字段不足以保证它引用的数据不会被垃圾收集，
// 因此程序必须保留一个单独的、类型正确的指向底层数据的指针。
type SliceHeader struct {  
 Data uintptr  
 Len  int  
 Cap  int  
}
```

一个使用 StringHeader 的例子：
```go
func uintptrPractice4() {  
   a := [...]byte{'a', 'b', 'c', 'd', 'e'}  
   b := "java"  
   hdr := (*reflect.StringHeader)(unsafe.Pointer(&b))  
   hdr.Data = uintptr(unsafe.Pointer(&a))  
   hdr.Len = len(a)  
   // 至此，a 和 b 共享底层的字节序列  
   a[1], a[2], a[3], a[4] = 'a', 'a', 'a', 'a'  
   fmt.Println(b) // out: aaaaa  
}
```
将字符串指针转为\*StringHeader，从而可以对字符串的内部进行修改


## 总结下 uintptr 和 Pointer 的区别

- Pointer：通用类型指针，不可以参与指针运算
- uintptr：用于指针运算，不持有对象，会被垃圾回收

---
1. 《非类型安全指针 -Go语言101》. 见于 2023年4月25日. [https://gfw.go101.org/article/unsafe.html](https://gfw.go101.org/article/unsafe.html).
