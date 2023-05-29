# string 底层存储

<!--more-->
#Golang 

{{< admonition warning "about card" false >}}
这是一个临时性的**卡片文章**，之后可能:
1. `针对该卡片进行扩展，形成文章`
2. `与已有文章关联，组织到其他文章`
3. `删除`
{{< /admonition>}}


## 底层存储结构

```go
type stringStruct struct {
	str unsafe.Pointer
	len int
}

type Pointer *ArbitraryType
type ArbitraryType int
```

-   `str` : 指向实际字符串的内存地址    
-   `len` : **字节**数（≠ **字符**数）

![](images/posts/Pasted%20image%2020230512114715.png)

## Q&A

##### 变量 a 与 b 在赋值的时候给到了相同的字符串值，底层会指向同一块地址吗（hello的字符串在底层是否只分配一次？）

答案是：是。

```go
func main() {
    a := "hello"
    b := "hello"
    c := b
    e := "world"

    fmt.Println(&a)
    fmt.Println(&b)
    fmt.Println(&c)
    fmt.Println(&e)

    fmt.Println(a==b)
    fmt.Println(b==c)
    fmt.Println("done")
}
```

![](images/posts/Pasted%20image%2020230512115044.png)

##### 两个字符串相加之后如果跟另一个字符串相同，是否指向同一个地址？

答案是：否

![](images/posts/Pasted%20image%2020230512115715.png)

查看两个不同的pointer指向的内容，都是”hello”，但是是两块不同的存储空间
![](images/posts/Pasted%20image%2020230512115749.png)

这说明了字符串连接的 + 操作是低效的，会**一直产生临时的字符串**
