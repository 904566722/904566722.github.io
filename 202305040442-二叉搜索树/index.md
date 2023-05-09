# 二叉搜索树

<!--more-->


#算法 

二叉搜索树：`左子树所有节点的值` < `根节点` < `右子树所有节点的值`

二叉搜索树的相关操作：
- 构建
- 判断
- 删除节点
- 增加节点

# 判断是否是二叉搜索树
递归实现
```go
// 递归实现
// 从二叉搜索树当前节点的值可以推出左右节点的取值区间，递归判断每个节点即可
func isValidBST(root *TreeNode) bool {
    if root == nil {
        return true
    }
    return jud(root, math.MinInt, math.MaxInt)
}
 
func jud(root *TreeNode, start, end int) bool {
    if root == nil {
        return true
    }
    if root.Val <= start || root.Val >= end {
        return false
    }
  
    return jud(root.Left, start, root.Val) && jud(root.Right, root.Val, end)
}
```

# 插入节点
递归实现
```go
func insertIntoBST(root *TreeNode, val int) *TreeNode {  
   if root == nil {  
      return &TreeNode{  
         Val: val,  
      }  
   }  
  
   if val < root.Val {  
      root.Left = insertIntoBST(root.Left, val)  
   } else {  
      root.Right = insertIntoBST(root.Right, val)  
   }  
   return root  
}
```

非递归实现
```go
func insertIntoBST2(root *TreeNode, val int) *TreeNode {  
   if root == nil {  
      return &TreeNode{  
         Val: val,  
      }  
   }  
  
   pre := root  
   tmpRoot := root  
   for tmpRoot != nil {  
      if val < tmpRoot.Val {  
         pre = tmpRoot  
         tmpRoot = tmpRoot.Left  
      } else {  
         pre = tmpRoot  
         tmpRoot = tmpRoot.Right  
      }  
   }  
   newNode := &TreeNode{Val: val}  
   if val < pre.Val {  
      pre.Left = newNode  
   } else {  
      pre.Right = newNode  
   }  
   return root  
}
```

# 删除节点

```go
// 如果找到该节点，有四种情况：  
// 没有左节点，直接将右子树代替该节点的位置  
// 没有右节点，直接将左子树代替该节点的位置  
// 均有左右节点，根据中序节点的性质，当前的序列为：左子树、当前节点、右子树的最左节点  
//       删除当前节点之后，为了保持中序，需要将左子树嫁接到右子树的最左节点的左节点，然后将右子树的根节点替换当前节点的位置  
// 均没有左右节点（叶子节点），直接删除该节点  
func deleteNode(root *TreeNode, key int) *TreeNode {  
   if root == nil {  
      return nil  
   }  
  
   var curParent *TreeNode = nil  
   cur := root  
   for cur != nil && cur.Val != key {  
      curParent = cur  
      if key < cur.Val {  
         cur = cur.Left  
      } else {  
         cur = cur.Right  
      }  
   }  
  
   // not found  
   if cur == nil {  
      return root  
   }  
  
   if cur.Left != nil && cur.Right != nil {  
      rightMinNode := cur.Right  
      for rightMinNode.Left != nil {  
         rightMinNode = rightMinNode.Left  
      }  
  
      rightMinNode.Left = cur.Left  
      cur = cur.Right  
   } else if cur.Left != nil {  
      cur = cur.Left  
   } else if cur.Right != nil {  
      cur = cur.Right  
   } else {  
      cur = nil  
   }  
  
   if curParent == nil {  
      return cur  
   }  
   if curParent.Left != nil && curParent.Left.Val == key {  
      curParent.Left = cur  
   } else {  
      curParent.Right = cur  
   }  
   return root  
}
```
