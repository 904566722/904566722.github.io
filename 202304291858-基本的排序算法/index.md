# 基本的排序算法

<!--more-->


#算法 

复习一下基本的排序算法

有几种基本的排序算法：
1. 冒泡排序
2. 选择排序
3. 插入排序
	- 希尔排序（递减增量的排序；插入排序的改进版本）
4. 归并排序
5. 快速排序
6. 桶排序
7. 堆排序
8. 计数排序
9. 基数排序


## 冒泡
步骤：
- 一直往前走，比较相邻两个数，大数往后放

![[bubbleSort.gif]]

```go
func bubbleSort(nums []int)  {  
   if len(nums) <= 1 {  
      return  
   }  
   // nums: 6 10 2 4 7 3 2 1 2  
   // loop1                  j (loop2每进行一轮往前移，直到1)  
   // loop2 i   for j := len(nums)-1; j >= 1; j--{  
      for i := 0; i < j; i++ {  
         if nums[i] > nums[i+1] {  
            swap(&nums[i], &nums[i+1])  
         }  
      }  
   }  
}
```

时间复杂度分析：O(n^2)
> 第一轮比较 n-1 次
> 第二轮比较 n-2 次
> ....
> 第n-1轮比较 1 次
> 1 + 2 + ... + (n-1) = n (n-1 + 1) / 2


## 选择排序 
步骤：
- 每次从**未排序找最小**

![[selectionSort.gif]]

```go
func selectSort(nums []int)  {  
   for i := 0; i < len(nums)-1; i++ {  
      minIdx := i  
      for j := i+1; j < len(nums); j++ {  
         if nums[j] < nums[i] {  
            minIdx = j  
         }  
      }  
      swap(&nums[i], &nums[minIdx])  
   }  
}
```
时间复杂度也是 O(n^2)

## 插入排序
步骤：
- 从**已排序找合适的位置**

![[insertionSort.gif]]

```go
func insertSort(nums []int)  {  
   // nums 1  2  5  3  4  
   //          i (i极其右边为一个 未排序的序列)  
   //      j=i-1 (j 负责往前找大于等于cur的值)  
   for i := 1; i < len(nums); i++ {  
      cur := nums[i]  
      j := i-1  
      for ; j>=0 && nums[j]>cur; j-- {  
         nums[j+1] = nums[j]  
      }  
      // 由于 j 当前的位置小于或者等于cur or 越界  
      // 故把前面一个位置，给到cur（前面的数已经往前前的位置移动）  
      nums[j+1] = cur  
   }  
}
```
## 归并排序
[[202304300231 归并排序]]
## 快速排序
[[202304300312 快速排序]]
