# 切片的一些操作

<!--more-->
#

## 切片克隆

```go
sClone := make([]T, len(s))
copy(sCLone, s)
```

## 删除元素

### 保证剩下的元素有序
```go
s = append(s[:i], s[i+1:]...)
```

### 不保证剩下的元素有序
```go
s[i] = s[len(s)-1]
s = s[:len(s)-1]
```

### tip：避免暂时性的内存泄漏

如果切片元素引用着其他值（如指针、切片、映射），应该重置多出来的元素槽上的元素值，避免暂时性的内存泄漏：
```go
s[len(s) : len(s)+1][0] = t0 // 类型零值
```

{{< admonition type=quote title="example" open=false >}}
```go
type Person struct {
    Name string
    Age  int
}

func main() {
    people := []*Person{
        {Name: "Alice", Age: 25},
        {Name: "Bob", Age: 30},
        {Name: "Charlie", Age: 35},
    }

    // 删除第二个元素
    copy(people[1:], people[2:])
    people[len(people)-1] = nil // 将最后一个元素设置为零值
    people = people[:len(people)-1]

    // 处理被删除的元素
    // ...
}
```

在上面的示例中，我们使用 `copy` 函数将第三个元素复制到第二个元素的位置，并将最后一个元素设置为零值。这样做可以确保被删除的元素所引用的值被及时释放，从而避免内存泄漏。
{{< /admonition >}}

## 把一个切片的所有元素插入到另一个切片
```go
s = append(s[:i], append(elements, s[i:]...)...)
```
