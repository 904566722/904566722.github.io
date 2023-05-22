# 树问题-判断子树

<!--more-->


#算法 

## 方法1. 递归

子问题是：判断左右子树是否会等于预期的子树（判断左右子树是否相等的问题也可以递归来实现）

```go
// 判断根节点为起始的树与目标树是否相同  
// 如果不相同，递归判断左子树和右子树  
func isSubtree(root *TreeNode, subRoot *TreeNode) bool {  
   if root == nil && subRoot == nil {  
      return true  
   }  
   if root == nil {  
      return false  
   }  
   if isSameTree(root, subRoot) {  
      return true  
   }  
   return isSubtree(root.Left, subRoot) || isSubtree(root.Right, subRoot)  
}

func isSameTree(p *TreeNode, q *TreeNode) bool {  
   if p == nil && q == nil {  
      return true  
   }  
   if p == nil || q == nil {  
      return false  
   }  
   if p.Val != q.Val {  
      return false  
   }  
  
   return isSameTree(p.Left, q.Left) && isSameTree(p.Right, q.Right)  
}
```

## 方法2. dfs（先序） + kmp

（local [202304262036 KMP 算法](content/posts/algorithm/202304262036%20KMP%20算法.md) remote [202304262036 KMP 算法](http://honghuiqiang.com/202304262036-kmp-%E7%AE%97%E6%B3%95)）

设主树s，子树t，主树的先序序列 ss，子树的先序序列 tt

利用先序序列的性质：

如果A.【 t 是 s 的子树】 那么B.【ss 中 包含 tt】

可以知道 B 是 A 的必要条件，是没有办法从 B 推出 A 的，原因是什么呢，假设主树：[4, 5]，子树：[4, nil, 5]，这种情况下的先序序列都是 4  5，但是两颗树是不一样的

但是我们可以通过补充两个代表空的左右节点来解决这个问题

```go
// 通过树的先序遍历  
// 补充树的每个节点，让度为2，输出树的先序遍历  
// 判断主树的序列包含子树的序列  
func isSubtree2(root *TreeNode, subRoot *TreeNode) bool {  
   nums1 := dlrNums(root)  
   nums2 := dlrNums(subRoot)  
   return kmpSearch(nums1, nums2)  
}  
  
const lrNilVal = -10001  
var leftNilNode = TreeNode{  
   Val: lrNilVal,  
}  
var rightNilNode = TreeNode{  
   Val: lrNilVal,  
}  
  
func dlrNums(root *TreeNode) []int {  
   var nums []int  
   if root == nil {  
      return nums  
   }  
  
   var st []*TreeNode  
   st = append(st, root)  
   tmpRoot := root  
   for len(st) > 0 {  
      // pop  
      tmpRoot = st[len(st) - 1]  
      st = st[:len(st) - 1]  
      // visit  
      nums = append(nums, tmpRoot.Val)  
      if tmpRoot.Val != lrNilVal && tmpRoot.Left == nil {  
         tmpRoot.Left = &leftNilNode  
      }  
      if tmpRoot.Val != lrNilVal && tmpRoot.Right == nil {  
         tmpRoot.Right = &rightNilNode  
      }  
  
      if tmpRoot.Right != nil {  
         st = append(st, tmpRoot.Right)  
      }  
      if tmpRoot.Left != nil {  
         st = append(st, tmpRoot.Left)  
      }  
   }  
   return nums  
}  
  
// i  
//     nums a a  b  a  a  b  a  a  c  
// pat  
// j  
func kmpSearch(nums, pat []int) bool {  
   next := getNext(pat)  
   j := 0  
   for i := 0; j < len(pat) && i < len(nums); i++ {  
      for ; j > 0 && nums[i] != pat[j]; j = next[j-1]{}  
  
      if nums[i] == pat[j] {  
         j++  
      }  
   }  
  
   return j == len(pat)  
}  
  
func  getNext(pat []int) []int {  
   next := make([]int, len(pat))  
   next[0] = 0  
  
   for l, j := 0, 1 ; j < len(pat); j++ {  
      for l > 0 && pat[l] != pat[j] {l = next[l-1]}  
  
      if pat[l] == pat[j] {  
         l++  
      }  
      next[j] = l  
   }  
   return next  
}
```
