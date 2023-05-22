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
#前缀和

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

---
#### [139. 单词拆分](https://leetcode.cn/problems/word-break/)
#动态规划

```go
// 字典中的字符串按长度从大到小排列  
// 假设：aaaopen,open，aaaa  
// 如果字符串中有 aaaopen，一定要先用 aaaopen 来构成，而不是 open + aaa// s：aaaaopen，裁剪 aaaopen 之后剩下 a，但是 s 是可以由 aaaa + open 组成的  
// 所以上面的思路行不通！  
//  
// 如果用递归的思路来做  
// 按照给定的字典，把所有可能的情况都裁剪一遍  
// 如果最后 s 为 “” true// 如果没有可以裁剪的子字符串，false  
// 超时！  
//  
// 如果列举出所有 wordDict 能够组成的单词，再来比较怎么样？ n <= 1000// 比递归还慢吧  
//  
// 动态规划
//                i-len(word)+1  
// s： x    x  x  x  x  x  x  x  x  x  x  x//                      i  想要判断 s[:i+1] 是否合法，遍历字典，  
//                |  -  |  
//                         如果存在一个 word，当 s[:i+1] - word 剩下的字符串是合法的，那么 s[:i+1] 就合法  
// 使用 dp[i] 来保存 s[:i+1] 是否合法  
// success  
func wordBreak(s string, wordDict []string) bool {  
   n := len(s)  
   dp := make([]int, n)  
  
   for i := 0; i < n; i++ {  
      for _, word := range wordDict {  
         m := len(word)  
         if i-m+1 < 0 {  
            continue  
         }  
         if s[i-m+1:i+1] == word && i-m+1 == 0 {  
            // 考虑第一个字母为一个单词的情况  
            dp[i] = 1  
            break  
         } else if s[i-m+1:i+1] == word && dp[i-m] == 1 {  
            dp[i] = 1  
            break  
         }  
      }  
  
   }  
   return dp[n-1] == 1  
}  
  
// 递归  
func cut(s string, wordDict []string) bool {  
   if s == "" {  
      return true  
   }  
  
   for _, word := range wordDict {  
      idx := strings.Index(s, word)  
      if idx >= 0 {  
         if cut(s[:idx], wordDict) && cut(s[idx+len(word):], wordDict) {  
            return true  
         }  
      }  
   }  
   return false  
}
```

---
#### [739. 每日温度](https://leetcode.cn/problems/daily-temperatures/)

#单调栈

```go
// 数组从后往前遍历
// 使用一个栈保存温度的下标
// 如果当前温度 >= 栈顶的温度 --》出栈
//                      否则 --》 入栈
func dailyTemperatures(temperatures []int) []int {
    var stack []int
    var ans []int
    n := len(temperatures)
    if n == 0 {
        return ans
    }
    stack = append(stack, n-1)
    ans = append(ans, 0)

    for i := n-2; i >= 0; i-- {
        t := temperatures[i]
        for len(stack) != 0 && t >= temperatures[stack[len(stack)-1]] {
            stack = stack[:len(stack)-1]
        }
        if len(stack) == 0 {
            ans = append(ans, 0)
        } else {
            ans = append(ans, stack[len(stack)-1] - i)
        }
        stack = append(stack, i)
    }


    for i := 0; i < n/2; i++ {
        ans[i], ans[n-i-1] = ans[n-i-1], ans[i]
    }
    return ans
}
```
