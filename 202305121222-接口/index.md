# Golang 接口学习

<!--more-->
#Golang 

> 1. Go 语言的接口相关概念？
> 2. Go 语言的接口长什么样？
> 3. Go 语言的接口用来做什么？
> 4. 与其他语言的接口有什么对比？

## 一、Go 语言的接口

### 1.1 相关概念

> 总结：
>
> - 接口： **方法定义**的**集合**，说明想要做的一系列事情
> - 一个类型可以实现多个接口

Go 语言并不是像 Java 那样传统的面向对象的语言，没有像 Java 中 类、继承之类的概念



如果把方法分为两部分：定义与实现

- 定义：定义其实就是在说明这个方法想要**做什么**
- 实现：实现就具体地说明了**怎么做**

举个例子：

```go
// Sum 求和
// 方法的组成部分：
// 1. 定义
// 2. 逻辑
func Sum(a int, b int) int {    		// 1. 定义（我想要求和）
    return a + b                        // 2. 具体逻辑（怎么求和）
}	
```



在Go 语言中，接口就是一系列**方法定义**的集合，用来**说明对象具备的行为**，接口的概念能够**让 Go 做一些面向对象的事情**

因此如果把 Go 的接口映射到生活中的话，接口相当于就是划分了一些想要做的事，谁如果有能力能够完成划分的这些事情，谁就相当与实现了这个接口

Go 一个类型可以实现多个接口（能力高的人能够完成更多想要做的事情）

![](images/posts/Pasted%20image%2020230512122455.png)

### 1.2 接口的写法

#### 1.2.1 正常实现

```go
// 程序员接口
type Programmer interface {
    // 一系列的方法定义，说明这个接口想要做的事情（或者说能够做到的事情）
    Coding() string
    Study() string
    //...
}

// 画家接口
type Painter interface {
    Observing() string
    Painting() string
    //...
}

// ... 其他接口
```

例如，一个程序员需要会编码、学习...，一个画家需要会观察、画画...

如果有个人具备程序员跟画家的能力，那么他就能实现这两个接口

```go
type Honghuiqiang struct {
    Name string
}

func (h *Honghuiqiang) Coding() string {
    return "i can coding..."
}

func (h *Honghuiqiang) Study() string {
    return "i can study..."
}

func (h *Honghuiqiang) Observing() string {
    return "i can observing"
}

func (h *Honghuiqiang) Painting() string {
    return "i can painting..."
}
```

![](images/posts/Pasted%20image%2020230512122532.png)

#### 1.2.2 嵌套接口

> 其实就是接口的组合

```go
// 程序员接口
type Programmer interface {
    // 一系列的方法定义，说明这个接口想要做的事情（或者说能够做到的事情）
    Coding() string
    Study() string
    //...
}

// 画家接口
type Painter interface {
    Observing() string
    Painting() string
    //...
}

type Artist interface {
    Programmer
    Painter
}
```

Artist 接口就等同于：

```go
type Artist interface {
    Coding() string
    Study() string
    
    Observing() string
    Painting() string
}
```

#### 1.2.3 空接口



### 1.3 接口可以用来做什么？

#### 1.3.1 如何利用接口编写更干净、更具扩展性的代码？

##### 1.3.1.1 Example 1. 排序

![](images/posts/Pasted%20image%2020230512122553.png)

#### 1.3.2 实现多态

> 多态：一个方法的多种状态

```go
type Stringer interface {
    Cut(s string) string
}

type CuterA struct {
    target string
}

type CuterB struct {
    target string
}

func (a CuterA) Cut(s string) string {
    return strings.Replace(s, a.target, "", -1)
}

func (b CuterB) Cut(s string) string {
    return strings.Replace(s, b.target, "", -1)
}

func cut(s string, t Stringer) string {
    return t.Cut(s)
}

func P2_1()  {
    var a Stringer = CuterA{target: "a"}
    var b Stringer = CuterB{target: "b"}
    fmt.Println(cut("ababab", a))
    fmt.Println(cut("ababab", b))
    /*
    相同的 cut 方法根据类型的不同体现出不同的行为
    rst:
    
    bbb
    aaa
    */
}
```



### 1.4 类型断言

既然一个接口可以被多个类型实现，那么就会产生对于接口实际类型的一个判断，即类型断言

比较好的写法应该是这样的：

```go
if v, ok := varT.(T); ok {
    // ...
}
```

结构：

![](images/posts/Pasted%20image%2020230512122901.png)
例子：

```go
// Stringer is Interface
var a Stringer = CuterA{target: "a"}
var b Stringer = CuterB{target: "b"}
var s = []Stringer{a, b}

for i, c := range s {
    if v, ok := c.(CuterA); ok {
        fmt.Printf("判断是类型 CuterA 成功(下标: %d; 值: %v)", i, v)
    }
}

/*
rst:
判断是类型 CuterA 成功(下标: 0; 值: {a})
*/
```



## Q&A

![](images/posts/Pasted%20image%2020230512122848.png)
