# 提高性能的一些小优化

<!--more-->
#
---
- `for-range` 副本的问题

```go
func TestForRange()  {  
   arr := [3]int{1,2,3}  
   for _, v := range arr[:] {    // 转成切片
      fmt.Println(v)  
   }  
}
```

[202305181719 for-range 中的副本拷贝](content/posts/go/golang-why/202305181719%20for-range%20中的副本拷贝.md)

---

