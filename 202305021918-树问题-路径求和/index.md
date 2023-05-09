# 树问题-路径求和

<!--more-->


#算法 

# 方法一、使用广度优先搜索（层次遍历）

思路：
二叉树的层次遍历使用一个队列来保存每一层的节点，再增加一个队列，用来保存从根节点到当前节点的路径上的和

# 方法二、递归

思路：
原问题：是否存在从当前节点（根节点）到叶子节点的路径，和为 sum
子问题：是否存在从当前节点（根节点的子节点）到叶子节点的路径，和为 sum - val（父节点的值）
结束条件：当前节点为叶子节点

```go
func hasPathSum(root *TreeNode, targetSum int) bool {
    if root == nil {
        return false
    }
    return havePathToLeaf(root, targetSum)
}


func havePathToLeaf(root *TreeNode, tgtSum int) bool {  
   // end  
   if root.Left == nil && root.Right == nil {  
      return root.Val == tgtSum  
   }  
  
   have1, have2 := false, false  
   if root.Left != nil {  
      have1 = havePathToLeaf(root.Left, tgtSum - root.Val)  
   }  
   if root.Right != nil {  
      have2 = havePathToLeaf(root.Right, tgtSum - root.Val)  
   }  
  
   return have1 || have2  
}
```
