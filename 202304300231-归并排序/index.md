# 归并排序

<!--more-->


#算法 

# 归并排序的思想
归并排序是一种采用了递归思想的排序，采用递归[[202304300007 递归]]的思想来分析就是：
1. 原问题 & 解决方法
	- 原问题：将 nums 排序
	- 解决办法：将数组 nums 分成两个序列 nums1、nums2，将 nums1、nums2 **排序后合并**
2. 子问题 & 解决方法
	- 子问题：将 nums1、nums2 排序
	- 解决办法：两个子数组都能够通过原问题的解决办法解决
3. 结束条件：当数组不能再划分（长度=1）

时间复杂度：
`合并的平均时间复杂度O(n)` x `拆分的深度 logn` = `O(nlogn)`

# 实现
Golang：
```go
// 1. 定义方法：将左右两个已经有序的序列合并成一个序列（原问题得解：原数组有序）  
// 2. 子问题：左右的数组需要有序，与原问题解决方法相同  
// 3. 结束条件：数组的长度为 1
func mergeSort(nums []int) []int {  
   // 结束条件  
   if len(nums) <= 1 {  
      return nums  
   }  
  
   // 子问题关系  
   mid := len(nums) / 2  
   left := mergeSort(nums[:mid])  
   right := mergeSort(nums[mid:])  
  
   // 方法定义  
   return merge(left, right)  
}  
  
// 将两个有序数组合并  
func merge(nums1, nums2 []int) []int {  
   n1, n2 := len(nums1), len(nums2)  
   nums := make([]int, n1 + n2)  
   i, j, idx := 0, 0, 0  
   for i < n1 && j < n2 {  
      if nums1[i] < nums2[j] {  
         nums[idx] = nums1[i]  
         i++  
      } else {  
         nums[idx] = nums2[j]  
         j++  
      }  
      idx++  
   }  
   for ; i < n1; i++ {  
      nums[idx] = nums1[i]  
      idx++  
   }  
   for ; j < n2; j++ {  
      nums[idx] = nums2[j]  
      idx++  
   }  
  
   return nums  
}
```


---
1.《图解排序算法(四)之归并排序 - dreamcatcher-cx - 博客园》. 见于 2023年4月30日. [https://www.cnblogs.com/chengxiao/p/6194356.html](https://www.cnblogs.com/chengxiao/p/6194356.html).
