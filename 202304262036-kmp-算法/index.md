# KMP算法

<!--more-->


#算法 

## 一、KMP 算法用途
- 在主串 S 中查找模式串 pattern

## 二、算法流程
### 2.1 举例说明1

**S="aabaabaac", pattern="aabaac"**

主串中存在模式串，应该返回起始下标 -3

![](images/posts/Pasted%20image%2020230426211149.png)

#### step1 首先定义两个下标 i 和 j，分别指向 S 和 pattern 中待比较的字符
> 注意点：（后续解释）
> 1. i 不会回头（时间复杂度O(N)）
> 2. j 左侧的字符一定是已经经过比较的（j 是会回头的）


![](images/posts/Pasted%20image%2020230426211316.png)

#### step2 当 S[i] == pattern[j]，i、j 均右移，继续往下比较

![](images/posts/Pasted%20image%2020230426211447.png)

#### step3 当 S[i] != pattern[j]，i 不动，**j 以一定的模式进行转移**，具体见下面的场景：
（[202304262152 KMP 算法之-获取 next 数组](content/posts/algorithm/202304262152%20KMP%20算法之-获取%20next%20数组.md)）


![](images/posts/Pasted%20image%2020230426211653.png)

（假设截取模式串 [0, j-1] 为 pattern‘）

当发现当前比较的字符不同时：

- 模式串找到 pattern’ 中**最长的相同前后缀**（假设为 comFix），如上图中的 B 和 C
- 那么主串在下标 i 之前也必定有一个 comFix（由于 j 前面的字符一定的经过比较的），也就是上图中的 A

所以 A = B = C，那么就可以把 j 的位置移动到 C 的下一个位置，这样就能够保证在 i 不回头的情况下，j 左边的字符都是已经经过比较的

![](images/posts/Pasted%20image%2020230426213140.png)

#### step4 进而继续往下比较

![](images/posts/Pasted%20image%2020230426213209.png)

那么 KMP 的伪代码就很容易能够写出来：
```
N M 为 S pattern 的长度
for i < N && j < M {
	字符不同
		循环：根据转移模式更新 j
		直到字符相同，或者已经是模式串的首字符

	if 字符相同
		j++
		i++
	否则
		i++
}
能够找到则 j == len(pattern)
	return i - M + 1
否则没有找到
	return -1
```

## 三、具体实现
```go
func getNext(pat string) []int {  
   n := len(pat)  
   next := make([]int, n)  
  
   for l, cur := 0, 1; cur < n; cur ++ {  
      // 不想等需要根据前面得到的 next，更新 l      
      // 直到相等或者 l == 0      
      for l > 0 && pat[l] != pat[cur] {l = next[l-1]}  
  
      if pat[cur] == pat[l] {  
         l++  
      }  
      next[cur] = l  
   }  
  
   return next  
}  
  
func KMP(s, pat string) int {  
   n, m := len(s), len(pat)  
   next := getNext(pat)  
   i, j := 0, 0  
   for i < n && j < m {  
      for j > 0 && pat[j] != s[i] {j = next[j-1]}  
  
      if s[i] == pat[j] {  
         j++  
      }  
      i++  
   }  
   if j == m {  
      return i - m  
   } else {  
      return -1  
   }  
}
```

## 四、一些习题

1. https://leetcode.cn/problems/repeated-substring-pattern/

--- 
1. 知乎专栏. 《KMP 算法详解》. 见于 2023年4月26日. [https://zhuanlan.zhihu.com/p/83334559](https://zhuanlan.zhihu.com/p/83334559).
2. 《KMP算法》. 收入 维基百科，自由的百科全书, 2022年7月8日. [https://zh.wikipedia.org/w/index.php?title=KMP%E7%AE%97%E6%B3%95&oldid=72556055](https://zh.wikipedia.org/w/index.php?title=KMP%E7%AE%97%E6%B3%95&oldid=72556055).
