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

---
#### [15. 三数之和](https://leetcode.cn/problems/3sum/)

```go
func threeSum(nums []int) [][]int {
	// 先将数组从小到达排序
	sort.Ints(nums)
	n := len(nums)
	var ans [][]int

	lastA := nums[0] - 1
	for i := 0; i < n; i++ {
		// 如果第一个数跟上一次循环的数一致，跳过该循环
		cIdx := n - 1
		if nums[i] == lastA {
			continue
		}
		// 第二个数在往后寻找的时候
		// 如果下一个数跟上一个数相同，也应该跳过，否则会出现重复的三元组
		lastB := nums[0] - 1
		for j := i + 1; j < cIdx; j++ {
			if lastB == nums[j] {
				continue
			}
			for ; cIdx > j; cIdx-- {
				sum := nums[i] + nums[j] + nums[cIdx]
				
				if sum < 0 {
					// 如果和小于0，不必继往前遍历找第三个数
					// 让第二个数增大，才有可能让 sum 为零
					break
				} else if sum == 0 {
					elem := []int{nums[i], nums[j], nums[cIdx]}
					ans = append(ans, elem)
					break
				}
			}
			lastB = nums[j]
		}

		lastA = nums[i]
	}
	return ans
}
```

---
#### [438. 找到字符串中所有字母异位词](https://leetcode.cn/problems/find-all-anagrams-in-a-string/)

```go
func findAnagrams(s string, p string) []int {
	var ans []int
	m, n := len(p), len(s)
    if m > n {
        return ans
    }
	var pCnt, sCnt [26]int
    for i := range p {
        pCnt[p[i]-'a'] ++
        sCnt[s[i]-'a'] ++
    }

    if sCnt == pCnt {
        ans = append(ans, 0)
    }
    for i := m; i < n; i++ {
        sCnt[s[i]-'a']++
        sCnt[s[i-m]-'a']--
        if sCnt == pCnt {
            ans = append(ans, i-m+1)
        }
    }
    return ans
}
```

---
#### [560. 和为 K 的子数组](https://leetcode.cn/problems/subarray-sum-equals-k/)

```go
//        start      end
//  x x x x x x x x x x x x 
//  假设 end 为这个连续子数组的终点
//      start 为起点
//  pre[i] 为前缀和，pre[0] = nums[0]
// 求：pre[end] - pre[start-1] = k
// end 遍历 nums，此时 pre[end]，k 已知，只需要找到前面有几个 pre[i] 等于 pre[end] - k 即可
func subarraySum(nums []int, k int) int {
    preCnt := map[int]int{}
    // pre := make([]int, len(nums))
    pre := 0
    cnt := 0
    preCnt[0] = 1
    for end := 0; end < len(nums); end ++ {
        pre += nums[end]
        cnt += preCnt[pre - k]

        // 统计前缀和出现的次数
        preCnt[pre]++
    }
    return cnt
}
```
