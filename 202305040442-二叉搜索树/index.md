# 二叉搜索树

<!--more-->


#算法 

## 二叉搜索树概述

二叉搜索树：`左子树所有节点的值` < `根节点` < `右子树所有节点的值`

比如：
![](images/posts/树-导出.png)

二叉搜索树的相关操作：
- 构建
- 判断
- 删除节点
- 增加节点

## 相关操作
### 判断是否是二叉搜索树
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

### 插入节点
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

### 删除节点

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

2023/05/23 重新回顾一下删除节点的操作，二叉搜索树的节点删除可以根据删除节点的子树数量分为三种情况来讨论：
- 没有子树
- 只有一棵子树
- 有两棵子树

#### 没有子树
![](images/posts/Pasted%20image%2020230523175351.png)

#### 有一棵子树
![](images/posts/Pasted%20image%2020230523175443.png)

#### 有两棵子树

**step1.** 找到目标节点
![](images/posts/Pasted%20image%2020230523182032.png)

**step2.** 将 **`目标节点的子树数量变成 1`**  
![](images/posts/Pasted%20image%2020230523182141.png)

**step3.** 用右子树根节点代替目标节点位置
![](images/posts/Pasted%20image%2020230523182231.png)

**总结：**
|子树数量|操作|
|-|-|
|0|直接删除|
|1|子树代替目标节点|
|2|重新构建子树，使其只有一颗子树，然后使用上面方法|

#### 有两棵子树的情况下，有多种方式来重建子树

使用「嫁接」的方式实现：
```go
// delete 使用「嫁接」的方式来删除  
func (bst *binarySearchTree) delete(val int)  {  
   tgt := bst.root  
   if tgt == nil {  
      return  
   }  
  
   var parent *treeNode = nil  
   for tgt != nil {  
      // 找到目标节点（待删除节点）  
      if tgt.val == val {  
         break  
      }  
  
      parent = tgt  
      if val < tgt.val {  
         tgt = tgt.left  
      } else {  
         tgt = tgt.right  
      }  
   }  
  
   // 不存在  
   if tgt == nil {  
      return  
   }  
  
   // 不存在子树或者只有一棵子树的情况  
   // - 若存在子树，则使用子树代替待删除节点即可  
   // - 否则直接将待删除节点删除  
   if tgt.left == nil || tgt.right == nil {  
      if tgt.left == nil {  
         tgt = tgt.left  
      } else {  
         tgt = tgt.right  
      }  
  
   // 存在两棵子树的情况  
   // child 为右节点根节点  
   } else {  
      tmp := tgt.right  
      // 将待删除节点的左子树嫁接到右子树的最左节点  
      for tmp.left != nil {  
         tmp = tmp.left  
      }  
      tmp.left = tgt.left  
  
      tgt = tgt.right  
   }  
  
   if parent == nil {  
      bst.root = tgt  
      return  
   }  
   if parent.left != nil && parent.left.val == val {  
      parent.left = tgt  
   } else {  
      parent.right = tgt  
   }  
}
```

使用「后继节点」替代待删除节点：
```go
/* 删除节点 */func (bst *binarySearchTree) remove2(num int) {  
   cur := bst.root  
   // 若树为空，直接提前返回  
   if cur == nil {  
      return  
   }  
   // 待删除节点之前的节点位置  
   var pre *treeNode = nil  
   // 循环查找，越过叶节点后跳出  
   for cur != nil {  
      if cur.val == num {  
         break  
      }  
      pre = cur  
      if cur.val < num {  
         // 待删除节点在右子树中  
         cur = cur.right  
      } else {  
         // 待删除节点在左子树中  
         cur = cur.right  
      }  
   }  
   // 若无待删除节点，则直接返回  
   if cur == nil {  
      return  
   }  
   // 子节点数为 0 或 1   if cur.left == nil || cur.right == nil {  
      var child *treeNode = nil  
      // 取出待删除节点的子节点  
      if cur.left != nil {  
         child = cur.left  
      } else {  
         child = cur.right  
      }  
      // 将子节点替换为待删除节点  
      if pre.left == cur {  
         pre.left = child  
      } else {  
         pre.right = child  
      }  
      // 子节点数为 2   } else {  
      // 获取中序遍历中待删除节点 cur 的下一个节点  
      tmp := cur.right  
      for tmp.left != nil {  
         tmp = tmp.left  
      }  
      // 递归删除节点 tmp      
      bst.remove2(tmp.val)  
      // 用 tmp 覆盖 cur      
      cur.val = tmp.val  
   }  
}
```
