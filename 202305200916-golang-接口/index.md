# golang 接口

<!--more-->
#

## 一些了解

- Go 1.18版本开始，有些接口类型只能被用做`类型约束`。 可被用做值类型的接口类型称为`基本接口类型`
- 一个接口类型定义了一些类型条件，通过内嵌一些接口元素来定义类型条件，Go 1.20 支持两种接口元素：`方法元素` 和 `类型元素`
- 接口类型可以分为：`基本接口类型` 和 `约束接口类型`（自定义泛型中使用的）
	- 基本接口类型不需要内嵌任何类型元素
- 如果两个接口类型的类型集相同，则他们互相实现了对方

## 基本接口类型和约束接口类型

示例代码
```go
// 此接口直接指定了两个方法和内嵌了两个其它接口。
// 其中一个为类型名称，另一个为类型字面表示形式。
type ReadWriteCloser = interface {
	Read(buf []byte) (n int, err error)
	Write(buf []byte) (n int, err error)
	error                      // 一个类型名称
	interface{ Close() error } // 一个类型字面表示形式
}

// 此接口类型内嵌了一个近似类型。
// 它的类型集由所有底层类型为[]byte的类型组成。
type AnyByteSlice = interface {
	~[]byte
}

// 此接口类型内嵌了一个类型并集。它的类型集包含6个类型：
// uint、uint8、uint16、uint32、uint64和uintptr。
type Unsigned interface {
	uint | uint8 | uint16 | uint32 | uint64 | uintptr
}
```

别名`ReadWriteCloser`表示的接口类型为一个基本接口类型， 但是`Unsigned`接口类型和别名`AnyByteSlice`表示的接口类型均不是基本接口类型。 后两者均只能用做约束接口类型。

## 类型实现

- 如果一个类型 `T` 实现了接口类型 `X` ，那么 T 类型的方法集一定是接口类型 X 的超集
- Go编译器将自动在需要的时候检查两个类型之间的实现关系

## 值包裹

[值包裹]^(Value Wrapping) 是一种将值封装到另一个类型中的技术

看一个简单例子：
```go
type Person struct {
    Name string
    Age  int
}

type PersonWrapper struct {
    Person
}

func (pw PersonWrapper) String() string {
    return fmt.Sprintf("Name: %s, Age: %d", pw.Name, pw.Age)
}


```
通过值包裹，我们可以轻松地为现有类型添加新的功能，而不必修改原始类型的定义。这使得代码更加灵活和可维护。

- `动态值` ：当一个非接口值被包裹在一个接口中，此非接口值称作此接口值的动态值
- `动态类型`：同上，此非接口类型称作此接口的动态类型

所以一个接口可以包裹 nil 非接口值（包裹了 nil 非接口值的接口值 !=  nil 接口值）

## 多态

了解了上面值包裹的概念，就可以容易地理解如何用接口来实现多态

**`调用一个接口值的方法`** = **`调用一个接口值的动态值的方法`**

比如：一个非接口类型 `T`， 它的一个示例 `t` 被包裹在接口类型 `I` 的接口值 `i` 中，那么 `i.m` = `t.m`（m为定义的方法）

## 反射

### 类型断言

`i.(T)`

断言类型为非接口类型：
```go
func main() {
	// 编译器将把123的类型推断为内置类型int。
	var x interface{} = 123

	// 情形一：
	n, ok := x.(int)
	fmt.Println(n, ok) // 123 true
	n = x.(int)
	fmt.Println(n) // 123

	// 情形二：
	a, ok := x.(float64)
	fmt.Println(a, ok) // 0 false

	// 情形三：
	a = x.(float64) // 将产生一个恐慌
}
```

断言类型为接口类型：
```go
type Writer interface {
	Write(buf []byte) (int, error)
}

type DummyWriter struct{}
func (DummyWriter) Write(buf []byte) (int, error) {
	return len(buf), nil
}

func main() {
	var x interface{} = DummyWriter{}
	// y的动态类型为内置类型string。
	var y interface{} = "abc"
	var w Writer
	var ok bool

	// DummyWriter既实现了Writer，也实现了interface{}。
	w, ok = x.(Writer)
	fmt.Println(w, ok) // {} true
	x, ok = w.(interface{})
	fmt.Println(x, ok) // {} true

	// y的动态类型为string。string类型并没有实现Writer。
	w, ok = y.(Writer)
	fmt.Println(w, ok) //  false
	w = y.(Writer)     // 将产生一个恐慌
}
```

### `type-switch`

```go
switch aSimpleStatement; v := x.(type) {
case TypeA:
	...
case TypeB, TypeC:
	...
case nil:
	...
default:
	...
}
```

## 接口值的比较

接口的内部实现可视为：
```go
type _interface struct {
	dynamicType  *_type         // 引用着接口值的动态类型
	dynamicValue unsafe.Pointer // 引用着接口值的动态值
}
```

接口值是可以通过 `==` 来比较的，可以分为两种情况
- 非接口值跟接口值比较（非接口类型必须实现接口类型，因此也就转换成了第二种比较）
- 两个接口值的比较

两个接口值的比较过程：
{{< mermaid >}}
flowchart TD

classDef important stroke:red, stroke-width:2px
classDef success stroke:green
classDef stick fill:yellow, stroke:yellow
classDef stickImp fill:pink, stroke:pink, color:black

a[比较两个接口值]
b{是否都为 nil}

end1[相同]
end2[不同]
end3[panic]

a-->b-->|yes|end1

c[比较动态类型]-.-stick1
    b-->|no|c

c-->|不同的动态类型|end2
c-->|相同的动态类型|d[比较动态值]
d-->end1
d-->end2
d-->end3

end3-.-stick1[如果动态类型是不能比较的将产生一个恐慌]


class end1 success
class end2,end3 important
class stick1 stickImp

{{< /mermaid >}}

简而言之，两个接口值的比较结果只有在下面两种任一情况下才为`true`：

1.  这两个接口值都为nil接口值。
2.  这两个接口值的动态类型相同、动态类型为可比较类型、并且动态值相等。

## 尽量包裹指针类型

看下面一个具体例子：
```go {hl_lines=[15]}
type LargeValue struct {
    data [1024]int
}

func (lv LargeValue) String() string {
    return fmt.Sprintf("%v", lv.data[0])
}

func main() {
    // 包裹大尺寸值
    var v1 interface{} = LargeValue{}
    fmt.Println(v1)

    // 包裹指针
    var v2 interface{} = &LargeValue{}
    fmt.Println(v2)
}
```
在上面的代码中，我们定义了一个名为 `LargeValue` 的结构体，其中包含了一个长度为 1024 的整型数组。然后，我们分别创建了两个接口值 `v1` 和 `v2`，并将它们分别包裹了 `LargeValue` 类型的值和指针。

在输出结果中，我们可以看到 `v1` 和 `v2` 的值都是相同的，但是它们的类型不同。具体来说，`v1` 的类型是 `interface {}`，而 `v2` 的类型是 `interface {}`，但是它们所包裹的值都是 `&{[0 0 0 ... 0]}`，即 `LargeValue` 类型的指针。

这个例子说明了在接口值中包裹大尺寸值和包裹指针的区别。如果我们直接将 `LargeValue` 类型的值包裹到接口值中，那么每次复制接口值时都会复制整个 `LargeValue` 结构体，这会导致性能问题。而如果我们包裹指针，则只需要复制指针，而不是整个结构体，这可以提高性能并减少内存使用。因此，在处理大尺寸值时，**`应该尽量包裹它的指针，而不是直接包裹值`**。





---
1. https://gfw.go101.org/article/interface.html
