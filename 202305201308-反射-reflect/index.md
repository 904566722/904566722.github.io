# 反射 reflect

<!--more-->
#

{{< admonition warning "about card" false >}}
这是一个临时性的**卡片文章**，之后可能:
1. `针对该卡片进行扩展，形成文章`
2. `与已有文章关联，组织到其他文章`
3. `删除`
{{< /admonition>}}


[目前 Go 支持的种类类型](https://golang.google.cn/pkg/reflect/#Kind)


## `reflect.Type` 

`reflect.Type` 为一个接口类型，指定了[若干方法](https://golang.google.cn/pkg/reflect/#Type)

![](images/posts/Pasted%20image%2020230520131815.png)
需要注意的是，这一些列的方法并不是适用于所有的类型，如果属主类型调用了不合适的方法，将产生一个恐慌，举个例子：
```go
// Elem returns a type's element type.// It panics if the type's Kind is not Array, Chan, Map, Pointer, or Slice.  
Elem() Type
```

Elem 防范将返回一个类型的元素类型。但是如果类型的Kind不是Array、Chan、Map、Pointer或Slice，则会出现panic。

## `reflect.Value`

`reflect.Value` 为一个结构体类型，指定了[若干方法](https://golang.google.cn/pkg/reflect/#Value.Addr)
