# t1016 子串能表示从 1 到 N 数字的二进制串

<!--more-->
#leetcode 

[1016. 子串能表示从 1 到 N 数字的二进制串](https://leetcode.cn/problems/binary-string-with-substrings-representing-1-to-n/)

```go
//
// 思路1. 遍历 n，每个字符串都判断是否是 s 的子串， 如果使用 kmp 算法，时间复杂度是 s 的长度 m
//		o(n * m)  * 数字转二进制字符串的时间
//	n's max = 1000000000 n * 每个数字转二进制的时间应该很长，再加上匹配的时间可能会超时
// 假设	n
//		15:1111		如果是子串，那么 111、11、1 都是子串 15 7 3 1
//		14:1110		如果是子串，那么 110、10、0 都是子串
//		13:1101		如果是子串，那么 101、1 都是子串
//		12:1100		..
//		11:1011
//		10:1010
//		 9:1001
//		...
//		 1:0001
//
// 思路2. 通过上面的分析可以找到一种优化
//		从最大的数开始比较，如果这个数符合，那么持续右移(/2)，放入一个符合条件的 map，
//		遍历的时候如果这个数已经被放入 map，就跳过
func queryString(s string, n int) bool {
	set := map[int]bool{}
	for num := n; num >= 1; num-- {
		if _, ok := set[num]; ok {
			continue
		}
		binaryStr := strconv.FormatInt(int64(num), 2)
		if kmp(s, binaryStr) {
			tmpNum := num
			for tmpNum > 0 {
				set[tmpNum] = true
				tmpNum /= 2
			}
		} else {
			return false
		}
	}

	return len(set) == n
}

func kmp(s, pat string) bool {
	n, m := len(s), len(pat)
	i, j := 0, 0
	next := getNext(pat)
	for i < n && j < m {
		for j > 0 && pat[j] != s[i] {j = next[j-1]}

		if pat[j] == s[i] {
			j++
		}
		i++
	}
	return j == m
}


func getNext(pat string) []int {
	i, j, n := 1, 0, len(pat)
	next := make([]int, n)
	next[0] = 0
	for i < n {
		for j > 0 && pat[j] != pat[i] {j = next[j-1]}

		if pat[i] == pat[j] {
			j++
		}
		next[i] = j


		i++
	}
	return next
}
```

![](images/posts/Pasted%20image%2020230511154025.png)
