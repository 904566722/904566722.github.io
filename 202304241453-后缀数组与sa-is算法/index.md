# 后缀数组与SA-IS算法

<!--more-->

#算法

## 一、后缀数组

概念：将 s 的所有后缀排序后的数组

见下面的一个例子：

![](images/posts/Pasted%20image%2020230424145648.png)

### 在 Go 中获得后缀数组的方法
```go
type Index struct {  
   _  []byte  
   sa []int32  
}  
  
func lastSubstring3(s string) string {  
   index := suffixarray.New([]byte(s))  
   idx := (*Index)(unsafe.Pointer(index))  
   fmt.Println(idx.sa)  // s="aabaaaab" output:[3 4 5 0 6 1 7 2]
   return ""  
}
```
思考：
1. unsafe.Pointer 的使用

	([202304241708 unsafe.Pointer 的六种使用场景](content/posts/go/golang-origin/202304241708%20unsafe.Pointer%20的六种使用场景.md))

1. 为什么是 (\*Index) 这样的写法？

	![](images/posts/Pasted%20image%2020230424165450.png)
	
	顺便复习下 struct 结构体（[202304241633 struct](content/posts/go/golang-simple/202304241633%20struct.md)）

## 二、SA-IS 算法

概念：（**S**uffix **A**rray **I**nduce **S**ort；SA-IS）

todo

---
参考资料：
1. 《诱导排序与SA-IS算法 - riteme.site》. 见于 2023年4月24日. [https://riteme.site/blog/2016-6-19/sais.html](https://riteme.site/blog/2016-6-19/sais.html).
2. 第一次接触到后缀数组以及SA-IS算法是在leetcode每日一题（[1163.按字典序排在最后的字串](https://leetcode.cn/problems/last-substring-in-lexicographical-order/)）中
