# t128 最长连续序列

<!--more-->
#leetcode 

#### [128. 最长连续序列](https://leetcode.cn/problems/longest-consecutive-sequence/)

```go  {hl_lines=[19]}
// 思路1. 排序 + 双指针
//      o(nlogn) + o(n)
// 
// 如何在 o(n) 时间复杂度之内完成？
// 先遍历一遍，把 num 都放入map ，用来标记数组中存在这个数(appeared)
// 再遍历一遍，如果该数能够作为数组的起点，就持续 +1 直到数组中不存在这个数，记录长度
// 前面使用 o(n) 空间复杂度来换取了 o(1) 的查找效率，最差情况下也就是整个数组不连续，也是 o(n)
func longestConsecutive(nums []int) int {
    if len(nums) == 0 {
        return 0
    }
    appeared := map[int]bool{}
    for _, num := range nums {
        appeared[num] = true
    }

    maxLen := math.MinInt
    for _, num := range nums {
        if !appeared[num-1] {
            cnt := 0
            for appeared[num] {
                num++
                cnt++
            }
            maxLen = max(maxLen, cnt)
        }
    }
    return maxLen
}

func max(a, b int) int {
    if a < b {
        return b
    }
    return a
}
```

