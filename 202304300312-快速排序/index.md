# 快速排序

<!--more-->


#算法 

# 快速排序的思想
快速排序采用了分治的思想，可以通过递归来实现

# 步骤

1. 原问题 & 解决办法
	- 原问题：nums 数组排序
	- 解决办法：选一个元素作为基准，将小于基准的数放到左边，大于基准的数放到右边（分区间）
2. 子问题 & 解决办法
	- 子问题：左右区间的排序
	- 解决办法：同原问题
3. 结束条件：数组只有一个元素

![[微信图片_20230430032831.jpg]]

# 实现

```go
// nums 数组排序  
func quickSort(nums []int, start, end int) {  
   // 结束条件  
   if start >= end {  
      return  
   }  
  
   // 子问题关系  
   pivot := partition(nums, start, end)  
   quickSort(nums, start, pivot)  
   quickSort(nums, pivot+1, end)  
   return  
}  
  
func partition(nums []int, start, end int) int {  
   if start == end {  
  
   }  
   pivot := start  
   idx := start + 1  
   for i := start+1; i <= end; i++ {  
      if nums[i] < nums[pivot] {  
         swap(&nums[i], &nums[idx])  
         idx++  
      }  
   }  
   swap(&nums[pivot], &nums[idx-1])  
   return idx-1  
}
```


---
《1.6 快速排序 | 菜鸟教程》. 见于 2023年4月30日. [https://www.runoob.com/w3cnote/quick-sort-2.html](https://www.runoob.com/w3cnote/quick-sort-2.html).
