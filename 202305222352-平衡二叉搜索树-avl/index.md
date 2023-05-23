# 平衡二叉搜索树-AVL

<!--more-->
#树 

## 一、概念

- 二叉搜索树：`left` < `root` < `right`
- **平衡**二叉搜索树：在二叉搜索树的基础上，具有良好的**平衡性**（在插入的时候，需要借助一次或者多次树旋转），避免出现极端不平衡的情况

|树类型|最坏情况下的时间复杂度|插入、删除、查找|
|-|-|-|
|二叉搜索树|`O(n)`(当整棵树只有左节点或者只有右节点的情况)||
|平衡二叉搜索树|`O(logn)`|效率更高(都为`O(logn)`)|

常见的平衡二叉搜索树
- AVL
- 红黑树
- B 树- B+ 树
- ...

本文主要介绍 AVL 树

## 二、AVL 的概念以及旋转分析

- `[|h(ls) - h(rs)|]^(平衡因子) <= 1`：左右树高的差值不大于 1
- 空树是 AVL 树

通过一张动态图观察树的几种旋转情况
![](images/posts/AVL_Tree_Example.gif)

### 2.1 节点高度、平衡因子
为了能够计算节点的平衡因子，节点结构中加入一个高度字段：
```go {hl_lines=[3]}
type treeNode struct {  
   val    int  
   height int // 节点高度  
   left   *treeNode  
   right  *treeNode  
}
```

> - **节点高度** 表示节点到最远叶子节点的举例（也就是边的数量）
> - 叶子节点的高度 = 0
> - 空节点的高度 = -1


- 定义两个分别用来**获取节点高度、更新节点高度**的方法：
```go
func (t *avlTree) getHeight(node *treeNode) int {  
   // 空节点高度为 -1   if node == nil {  
      return -1  
   }  
   return node.height  
}  
  
func (t *avlTree) updateHeight(node *treeNode) {  
   // 节点高度等于最高子树的高度 + 1   
   t.height = max(t.getHeight(node.left), t.getHeight(node.right)) + 1  
}
```

- **获取节点的平衡因子**
```go
// balanceFactor 获取平衡因子  
// 设平衡因子为 f，平衡二叉树的平衡因子需满足：-1 <= f <= 1  
func (t *avlTree) balanceFactor(node *treeNode) int {  
   // 空节点的平衡因子为 0   if node == nil {  
      return 0  
   }  
   // 节点平衡因子 = 左子树高度 - 右子树高度  
   return t.getHeight(node.left) - t.getHeight(node.right)  
}
```

### 2.2 四种旋转类型

AVL 的特点就在于旋转（Roration），通过旋转可以让二叉树不失衡，根据节点的失衡情况，可以将分为四种旋转方式：`左旋`、`右旋`、`先左旋再右旋`、`先右旋再左旋`

#### 2.2.1 左旋

具体图示分析与右旋类似

```go
func (t *avlTree) leftRotate(node *treeNode) *treeNode  {  
   child := node.right  
   // 消除碰撞，执行旋转  
   node.right = child.left  
   child.left = node  
   // 更新节点高度  
   t.updateHeight(node)  
   t.updateHeight(child)  
  
   return child  
}
```

#### 2.2.2 右旋

**step1.** 下面这棵树是 AVL 树
![](images/posts/Pasted%20image%2020230523141413.png)

**step2.** 添加一个节点之后失衡
![](images/posts/Pasted%20image%2020230523141447.png)

**step3.** 聚焦失衡子树
![](images/posts/Pasted%20image%2020230523141505.png)

**step4.** 旋转操作
![](images/posts/Pasted%20image%2020230523141944.png)

> **step4.a** 这里的 `child` 节点是没有右节点的，因此 `node` 节点的右旋过程是顺利的。在右旋操作中，如果 `child` 存在右节点，是会产生**碰撞**（碰撞只是为了个人方便记住存在这种情况引入的一个概念）的，那么在旋转之前，就必须**消除碰撞**：让 `grandchild` 作为 `node` 的左节点：
> ![](images/posts/Pasted%20image%2020230523144334.png)

**step5.** 子节点上移
![](images/posts/Pasted%20image%2020230523142022.png)

右旋代码：
```go
// 右旋，返回平衡子树的根节点  
func (t *avlTree) rightRotate(node *treeNode) *treeNode {  
   child := node.left  
   // 消除碰撞，执行旋转  
   node.left = child.right  
   child.right = node  
   // 更新节点高度  
   t.updateHeight(node)  
   t.updateHeight(child)  
  
   return child  
}
```

#### 2.2.3 先左旋后右旋

下面是同样的一颗 AVL 树，如果新节点添加在最左叶子节点的左节点，是能够通过一次右旋操作恢复平衡的，但是如果新节点**添加在最左叶子节点的右节点**，需要先通过一次`左旋`（这次左旋是不会产生碰撞的）达到类似于新节点是添加在最左边的效果，然后就能通过上面提到的`右旋`操作来恢复平衡

![](images/posts/Pasted%20image%2020230523153918.png)


#### 2.2.4 先右旋后左旋

相当于「先左旋后右旋」的镜像操作

### 2.3 如何选择旋转类型

通过 2.2 的分析，我们可以总结得到：
![](images/posts/Pasted%20image%2020230523155729.png)

设平衡因子为 f
- 左偏树：f > 1
- 右偏树：f < -1

我们可以通过分别判断 node 和 child 的平衡因子来选择执行哪种旋转操作
|失衡节点的 f|子节点的 f|操作|
|-|-|-|
|>1|>=0|右旋|
|>1|<0|先左旋后右旋|
|<-1|<=0|左旋|
|<-1|>0|先右旋后左旋|

```go
func (t *avlTree) rotate(node *treeNode) *treeNode {  
   // 失衡节点的平衡因子  
   bf := t.balanceFactor(node)  
   if bf > 1 {  
      if t.balanceFactor(node.left) >= 0 {  
         return t.rightRotate(node)  
      } else {  
         // 先左旋，后右旋  
         node.left = t.leftRotate(node.left)  
         return t.rightRotate(node)  
      }  
   } else if bf < -1 {  
      if t.balanceFactor(node.right) <= 0 {  
         return t.leftRotate(node)  
      } else {  
         // 先右旋，后左旋  
         node.right = t.rightRotate(node.right)  
         return t.leftRotate(node)  
      }  
   }  
   // 已经是平衡状态  
   return node  
}
```

## 三、其他操作
### 3.1 插入节点

平衡二叉搜索树在节点插入之后要维持树的平衡，从插入的节点开始，需要 **`自底向上执行旋转操作，使所有失衡节点恢复平衡`** 
```go
func (t *avlTree) insert(val int)  {  
   t.root = t.insertHelper(t.root, val)  
}  
  
func (t *avlTree) insertHelper(node *treeNode, val int) *treeNode {  
   if node == nil {  
      return &treeNode{  
         val: val,  
      }  
   }  
  
   /* 1. 插入 */   
   if val < node.val {  
      node.left = t.insertHelper(node.left, val)  
   } else if val > node.val {  
      node.right = t.insertHelper(node.right, val)  
   } else {  
      // 重复节点不插入  
      return node  
   }  
  
   // 更新节点高度  
   t.updateHeight(node)  
   /* 2.执行旋转，恢复平衡 */   
   node = t.rotate(node)  
   return node  
}
```

### 3.2 删除节点

```go
func (t *avlTree) remove(val int)  {  
   t.removeHelper(t.root, val)  
}  
  
func (t *avlTree) removeHelper(node *treeNode, val int) *treeNode {  
   if node == nil {  
      return nil  
   }  
  
   if val < node.val {  
      node.left = t.removeHelper(node.left, val)  
   } else if val > node.val {  
      node.right = t.removeHelper(node.right, val)  
   } else {  
      if node.left == nil || node.right == nil {  
         child := node.left  
         if node.right != nil {  
            child = node.right  
         }  
  
         if child == nil {  
            // 没有子树，直接删除节点即可  
            return nil  
         } else {  
            // 有至多一个节点，返回该节点  
            return child  
         }  
      } else {  
         // 子节点的数量为 2，删除当前节点的后继节点，并用后继节点的值替换当前节点  
         tmp := node.right  
         for tmp.left != nil {  
            tmp = tmp.left  
         }  
  
         // 递归删除这个后继节点  
         node.right = t.removeHelper(node.right, tmp.val)  
         // 替换当前节点  
         node.val = tmp.val  
      }  
   }  
  
   // 更新节点高度  
   t.updateHeight(node)  
   /* 执行旋转，保持平衡 */   
   node = t.rotate(node)  
   return node  
}
```

---
1. https://www.hello-algo.com/chapter_tree/avl_tree/#751-avl
