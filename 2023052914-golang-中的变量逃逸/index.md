# golang 中的变量逃逸

<!--more-->
#golang #变量逃逸

{{< admonition warning "about card" false >}}
这是一个临时性的**卡片文章**，之后可能:
1. `针对该卡片进行扩展，形成文章`
2. `与已有文章关联，组织到其他文章`
3. `删除`
{{< /admonition>}}


## draft

1. 如何查看某个变量是否发生了逃逸

```go
// 这里 n 为什么没有发生变量逃逸
// 我的理解：函数内部没有将这个指针存储在全局变量中，也没有返回这个指针
func test1(n *int) {
	*n++
	return
}

func test2() int {
	ans := 1
	return ans
}

func main() {
	n := 1
	test1(&n)
	//n does not escape

	a := test2()
	fmt.Println(a)
}
```

使用 `go build` 查看变量是否逃逸

```sh
 go build -gcflags '-m -l' main.go

 # command-line-arguments
.\main.go:7:12: n does not escape
.\main.go:23:13: ... argument does not escape
.\main.go:23:14: a escapes to heap
```


---
1. [逃逸分析是怎么进行的 | Go 程序员面试笔试宝典](https://golang.design/go-questions/compile/escape/)
