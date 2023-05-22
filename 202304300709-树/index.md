# 树

<!--more-->


#算法 

## 一些基本概念

树四度：
- 度
	- 节点的度：节点拥有的子节点数量
	- 树的度：节点的度的最大值
- 深度：根节点到当前节点的距离
- 高度：根节点到最低节点的距离

树的实际应用：
- 帮助分析时间复杂度
- 搜索
- 排序
- 路径查找

## 几种常见的树
- 二叉树
	- 满二叉树
	- 完全二叉树
	- 二叉搜索树 （local [202305040442 二叉搜索树](content/posts/algorithm/202305040442%20二叉搜索树.md) remote [202305040442 二叉搜索树](http://honghuiqiang.com/202305040442-%E4%BA%8C%E5%8F%89%E6%90%9C%E7%B4%A2%E6%A0%91)）
	- 平衡二叉搜索树
- 线段树
- 平衡树
- B 树 
- 红黑树

## 树的遍历方式

深度：前序（DLR）、中序（LDR）、后序（LRD）
广度：层序遍历

### 前序遍历

用递归的思想可以将问题看作：
1. 访问跟节点
2. 前序遍历左节点
3. 前序遍历右节点

```go
// 前序遍历: 访问根节点，以前序遍历的方式访问左节点，以前序遍历的方式访问右节点  
func pOrder(root *treeNode)  {  
   // end  
   if root == nil {  
      return  
   }  

   fmt.Printf("%d ", root.val)
   pOrder(root.left)  
   pOrder(root.right)  
   return  
}
```

使用栈实现：
1. 将根节点入栈
2. 出栈，加入右节点跟左节点
3. 重复以上操作，直到栈空

```go
func pOrderStack(root *treeNode)  {  
   if root == nil {  
      return  
   }  
  
   var st []*treeNode  
   st = append(st, root)  
   var pnt []int  
   for len(st) > 0 {  
      // pop  
      cur := st[len(st)-1]  
      st = st[:len(st)-1]  
      pnt = append(pnt, cur.val)  
  
      // judge left\right  
      if cur.right != nil {  
         st = append(st, cur.right)  
      }  
      if cur.left != nil {  
         st = append(st, cur.left)  
      }  
   }  
   fmt.Println(pnt)  
}
```

### 中序遍历

递归实现：
```go
// 按中序遍历访问左节点，访问节点元素，按中序遍历访问右节点  
func ldrOrder(root *treeNode)  {  
   if root == nil {  
      return  
   }  
  
   ldrOrder(root.left)  
   fmt.Printf("%d ", root.val)  
   ldrOrder(root.right)  
  
   return  
}
```

栈实现：
1. 从根节点开始入栈，一直往左，直到最左叶子节点
2. 出栈，访问节点
3. 将右节点当作步骤1的根节点（若存在）
```go
func ldrOrderStack(root *treeNode) {  
   if root == nil {  
      return  
   }  
  
   var st []*treeNode  
   cur := root  
   // 找到最左叶子节点  
   for cur != nil {  
      st = append(st, cur)  
      cur = cur.left  
   }  
  
   // 出栈，访问元素  
   // 如果存在右节点，继续入栈，直到最左叶子节点  
   var pnt []int  
   for len(st) > 0 {  
      cur := st[len(st)-1]  
      st = st[:len(st)-1]  
      pnt = append(pnt, cur.val)  
  
      tmp := cur.right  
      for tmp != nil {  
         st = append(st, tmp)  
         tmp = tmp.left  
      }  
   }  
  
   return  
}

// 代码优化
func ldrOrderStack2(root *treeNode) {  
   if root == nil {  
      return  
   }  
  
   var st []*treeNode  
   // 出栈，访问元素  
   // 如果存在右节点，继续入栈，直到最左叶子节点  
   var pnt []int  
   tmp := root  
   for len(st) > 0 || tmp != nil {  
      // 入栈直到最左节点  
      for tmp != nil {  
         st = append(st, tmp)  
         tmp = tmp.left  
      }  
  
      // 出栈，访问节点元素  
      tmp = st[len(st)-1]  
      st = st[:len(st)-1]  
      pnt = append(pnt, tmp.val)  
      // 继续找右节点的最左叶子节点  
      tmp = tmp.right  
   }  
  
   return  
}
```

### 后续遍历

递归实现：
```go
func lrdOrder(root *treeNode)  {  
   if root == nil {  
      return  
   }  
  
   lrdOrder(root.left)  
   lrdOrder(root.right)  
   fmt.Printf("%d ", root.val)  
  
   return  
}
```

栈实现：
1. 从根节点开始入栈，直到最左节点
2. **获取**栈顶，判断右节点
	- 右节点不存在：访问该节点，**出栈**
	- 右节点已经访问过：访问该节点，**出栈**
	- 右节点未访问，进入步骤3
3. 将该右节点当作步骤1的根节点
```go
func lrdOrderStack(root *treeNode)  {  
   var st []*treeNode  
   tmpRoot := root  
   pre := root  
   for len(st) > 0 || tmpRoot != nil {  
      for tmpRoot != nil {  
         st = append(st, tmpRoot)  
         tmpRoot = tmpRoot.left  
      }  
  
      tmpRoot = st[len(st)-1]  
      // 当节点右节点为空 或者 右子树已经访问过的情况下，访问根节点  
      if tmpRoot.right == nil || tmpRoot.right == pre {  
         fmt.Printf("%d ", tmpRoot.val)  
         pre = tmpRoot  
         tmpRoot = nil  // 将当前节点标记为空，避免下一个循环又将该节点入栈  
         st = st[:len(st)-1]  
      } else {  
         // 右节点还没访问，后序遍历右节点  
         tmpRoot = tmpRoot.right  
      }  
   }  
   return  
}
```

### 层序遍历

层序遍历使用**队列**实现：
```go
func levelOrder(root *treeNode)  {  
   if root == nil {  
      return  
   }  
   var queue []*treeNode  
   queue = append(queue, root)  
   for len(queue) > 0 {  
      cur := queue[0]  
      queue = queue[1:]  
      fmt.Printf("%d ", cur.val)  
  
      if cur.left != nil {  
         queue = append(queue, cur.left)  
      }  
      if cur.right != nil {  
         queue = append(queue, cur.right)  
      }  
   }  
   return  
}
```

### 遍历的复杂度

|遍历|时间复杂度|空间复杂度|
|-|-|-|
|先序|O(n)<br>递归调用的时间复杂度为O(1)，递归调用的次数为数中节点的数量n|栈实现的空间复杂度为：O(h)<br>h为数的高度<br>在较差的情况下，h = n；如果是平衡二叉树，h = logn|
|中序|O(n)|同上|
|后序|O(n)|同上|
|层序|O(n)|O(w)<br>w 为树的宽度|

## 树的一些常见问题

[202305021918 树问题-路径求和](content/posts/algorithm/202305021918%20树问题-路径求和.md)

[202305031652 树问题-判断子树](content/posts/algorithm/202305031652%20树问题-判断子树.md)

---
1. 《02.二叉树的遍历知识》. 见于 2023年4月30日. [https://algo.itcharge.cn/07.Tree/01.Binary-Tree/02.Binary-Tree-Traverse/](https://algo.itcharge.cn/07.Tree/01.Binary-Tree/02.Binary-Tree-Traverse/).

2. https://algo.itcharge.cn/07.Tree/01.Binary-Tree/01.Binary-Tree-Basic/
