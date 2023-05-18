# leetcode 做题记录 v2

<!--more-->
#

---
#### [11. 盛最多水的容器](https://leetcode.cn/problems/container-with-most-water/)

#双指针

```go
func maxArea(height []int) int {
    l, r := 0, len(height) - 1
    ans := math.MinInt
    for l < r {
        ans = max(ans, (r-l) * min(height[l], height[r])) // calc area

        if height[l] < height[r] {
            l++
        } else {
            r--
        }
    }
    return ans
}

func max(a, b int) int {
    if a < b {
        return b
    }
    return a
}

func min(a, b int) int {
    if a < b {
        return a
    }
    return b
}
```

看到一条有趣的评论：
![](images/posts/Pasted%20image%2020230518115520.png)
