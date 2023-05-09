# struct 方法集概念

<!--more-->

#Golang #struct

Go 语言中 struct 存在方法集（method set）的概念，看下面一段代码
```go
type T struct {  
   a int  
}  
  
func (t T) M1() {  
   t.a++  
}  
  
func (t *T) M2() {  
   t.a++  
}  
  
func structPractice2() {  
   var t1 T  
   var t2 = &T{}  
  
   fmt.Println(reflect.TypeOf(t1)) // T  
   fmt.Println(reflect.TypeOf(t2)) // *T  
  
   t1.M1()  
   t1.M2()  // (&t1).M2()
  
   t2.M1()  // (*t2).M1()
   t2.M2()  
}
```
|变量|类型|方法集|
|-|-|-|
|t1|T|{M1}|
|t2|\*T|{M1,M2}|

- 那么为什么 t1.M2() 不报错？

	可以看到 t1 的方法集只有 M1，M2方法的接收者类型是 \*T 但是为什么 t1.M2() 这段代码不报错，这是由于 Go 语言提供的语法糖，Go 的编译器判断 t1 的类型为 T，跟 M2 方法的接收者不一致，自动转化成了 (&t1).M2()；同理可解释 t2.M1()

那么既然存在这样的语法糖，来看看这样调用是不是可行的：
```go
T{}.M2() // Cannot call a pointer method on 'T{}'

(&T{}).M2()//OK
(&T{}).M1()//ok
```
会直接报错：无法通过 T{} 来调用一个指针方法

原因其实是上面提到的语法糖有一个前提：
- T 类型的实例，需要是可被取地址的（[addressable](https://colobu.com/2018/02/27/go-addressable/)）


---
1. 《为什么这个T类型实例无法调用*T类型的方法 | Tony Bai》. 见于 2023年4月24日. [https://tonybai.com/2022/02/27/go-addressable/](https://tonybai.com/2022/02/27/go-addressable/).
2. 鸟窝. 《go addressable 详解》, 2018年2月27日. [https://colobu.com/2018/02/27/go-addressable/](https://colobu.com/2018/02/27/go-addressable/).
3. 吴润写字的地方. 《Golang 不可寻址的理解》, 2021年11月12日. [http://www.wu.run/2021/11/12/not-addressable-in-golang/index.html](http://www.wu.run/2021/11/12/not-addressable-in-golang/index.html).
