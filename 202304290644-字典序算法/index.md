# 字典序算法

<!--more-->

#算法 

用途：给定一个数组，返回基于字典序的下一个数组排列
四个步骤：
1. 找上坡
2. 找大于且最小
3. 交换
4. 倒序


Go 实现：
```go
func nextDicArr(nums []int) []int {  
	if len(nums) <= 1 {  
	   return  
	}
   pos := -1  
   for i := len(nums)-2; i >= 0; i-- {  
      if nums[i] < nums[i+1] {  
         pos = i  
         break  
      }  
   }  
   // 没找到上坡（左值小于右值），说明已经是降序排列  
   if pos == -1 {  
      for i,n := 0,len(nums); i < n/2; i++ {  
         nums[i], nums[n-i-1] = nums[n-i-1], nums[i]  
      }  
      return nums  
   }  
  
   // 找到 pos，接着找右边大于该值的最小值（也就是第一个大于标记的值）  
   biggerThanPos := -1  
   for i := len(nums)-1; i >= pos+1; i-- {  
      if nums[i] > nums[pos] {  
         biggerThanPos = i  
         break  
      }  
   }  
   nums[pos], nums[biggerThanPos] = nums[biggerThanPos], nums[pos]  
  
   // 剩下的倒序  
   for i,n,cnt := pos+1, len(nums),0; i < (n + pos+1)/2; i++ {  
      nums[i], nums[n-cnt-1] = nums[n-cnt-1], nums[i]  
      cnt++  
   }  
   return nums  
}
```

习题练习：
1. https://leetcode.cn/problems/VvJkup/

---

《字典序算法详解_HappyRocking的博客-CSDN博客》. 见于 2023年4月29日. [https://blog.csdn.net/HappyRocking/article/details/83619392](https://blog.csdn.net/HappyRocking/article/details/83619392).
