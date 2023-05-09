# KMP算法之-获取next数组

<!--more-->
 
#算法 

KMP 算法中 j 的转移是通过一个保存 j 转移信息的数组 next 来实现的，那么如何获得这个数组是 KMP 算法的关键

首先根据 KMP 的工作流程可知，next 中保存的其实是最长公共前后缀的长度，也可以理解为最长公共前后缀中前缀的下一个下标
> next[i] 保存了 pattern[0,i] 这个字符串最长公共前后缀的长度

举个例子说明：pattern = "aabaac"
![[Pasted image 20230426220927.png]]
推导过程：
|子串|最长公共前后缀|next|
|-|-|-|
|a|无(长度为1没有前缀与后缀)|0|
|aa|a|1|
|aab|无|0|
|aaba|a|1|
|aabaa|aa|2|
|aabaac|无|0|

如何在 O(M) 的时间复杂度内获得这个 next 数组？
使用两个指针，从头开始遍历 pattern：
- len：记录了最长公共前后缀的长度（初始 0）
- cur：子串结尾（初始 1）
首先初始化 next[0] = 0，所有的模式串都符合

![[Pasted image 20230426223405.png]]

判断 pattern[cur] == pattern[len]；
说明存在相同前后缀，那么将 len++，next[cur] = len（说明子串 pattern[0, cur] 的最长公共前缀长度为 len）
再将 cur++，继续判断下一个子串

![[Pasted image 20230426223414.png]]

当 pattern[cur] != pattern[len]
说明当前的子串是不存在公共前后缀的，那么将 len 重置 len = next[len-1]（找子串[0, len-1]的最大相同前后缀，直到首字符的位置 或者 pattern[len] == pattern[cur]），
end 继续右移动
> 这个步骤往往是容易出错的，看下面的一个例子
> ![[Pasted image 20230426232305.png]]

重复以上过程，直到获取整个 next 数组

![[Pasted image 20230426223513.png]]

一个错误例子：
```go
func getNext(pat string) []int {  
   n := len(pat)  
   next := make([]int, n)  
  
   for l, cur := 0, 1; cur < n; cur ++ {  
      if pat[cur] == pat[l] {
         l++  
      } else {  // error
         l = 0  
      }  
      next[cur] = l  
   }  
  
   return next  
}
```
测试例：
pat="afdabeafdaf"
getNext() = [0 0 0 1 0 0 1 2 3 4 0], want [0 0 0 1 0 0 1 2 3 4 2]

正确实现：
```go
func getNext(pat string) []int {  
   n := len(pat)  
   next := make([]int, n)  
  
   for l, cur := 0, 1; cur < n; cur ++ {  
      // 不相等需要根据前面得到的 next，更新 l      
      // 直到相等或者 l == 0      
      for l > 0 && pat[l] != pat[cur] {l = next[l-1]}  
  
      if pat[cur] == pat[l] {  
         l++  
      }  
      next[cur] = l  
   }  
  
   return next  
}
```
