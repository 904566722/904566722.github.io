# 内嵌类型

<!--more-->
#

## 例子


```go
type Person struct {
	Name string
	Age  int
}
func (p Person) PrintName() {
	fmt.Println("Name:", p.Name)
}
func (p *Person) SetAge(age int) {
	p.Age = age
}

type Singer struct {
	Person // 通过内嵌Person类型来扩展之
	works  []string
}

func main() {
	t := reflect.TypeOf(Singer{}) // the Singer type
	fmt.Println(t, "has", t.NumField(), "fields:")
	for i := 0; i < t.NumField(); i++ {
		fmt.Print(" field#", i, ": ", t.Field(i).Name, "\n")
	}
	fmt.Println(t, "has", t.NumMethod(), "methods:")
	for i := 0; i < t.NumMethod(); i++ {
		fmt.Print(" method#", i, ": ", t.Method(i).Name, "\n")
	}

	pt := reflect.TypeOf(&Singer{}) // the *Singer type
	fmt.Println(pt, "has", pt.NumMethod(), "methods:")
	for i := 0; i < pt.NumMethod(); i++ {
		fmt.Print(" method#", i, ": ", pt.Method(i).Name, "\n")
	}
}

```

上面代码的输出结果：
```txt
main.Singer has 2 fields:
 field#0: Person
 field#1: works
main.Singer has 1 methods:
 method#0: PrintName
*main.Singer has 2 methods:
 method#0: PrintName
 method#1: SetAge
```

输出的结果是符合预期的，但是有一个疑问：`Singer 的字段并没有 Name，为什么使用 gaga.Name 是合法的？`

答：如果一个选择器的中部对应一个内嵌字段，则此项可以被省略，因此`内嵌字段又被称为匿名字段`
