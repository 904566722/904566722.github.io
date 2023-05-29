# 非类型安全指针

<!--more-->
#

{{< admonition warning "about card" false >}}
这是一个临时性的**卡片文章**，之后可能:
1. `针对该卡片进行扩展，形成文章`
2. `与已有文章关联，组织到其他文章`
3. `删除`
{{< /admonition>}}


## 一些事实

- 使用非类型安全指针一个较大的风险：`使用了非类型安全指针的代码可能从今后的某个 Go 版本开始将不能通过编译，或者运行行为发生变化`
- 非类型安全指针值是指针，但 uintptr 是整数

## Pointer 的代码

```go
type ArbitraryType int

type Pointer *ArbitraryType
```

## 如何正确地使用非类型安全指针？

unsafe 标准包的文档中列出了六种非类型安全指针的使用标准：

（local [202304241708 unsafe.Pointer 的六种使用场景](content/posts/go/golang-origin/202304241708%20unsafe.Pointer%20的六种使用场景.md) remote [202304241708 unsafe.Pointer 的六种使用场景](http://honghuiqiang.com/202304241708-unsafe.pointer-%E7%9A%84%E5%85%AD%E7%A7%8D%E4%BD%BF%E7%94%A8%E5%9C%BA%E6%99%AF)）
