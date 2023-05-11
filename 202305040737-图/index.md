# 图

<!--more-->

#算法 
## 一、基本概念
定义：G = (V, E)

图的分类

`边是否有方向`：
- 有向图
- 无向图

`图中是否有环`：
- 有环图
- 无环图

连通图和非连通图
- 连通图
- 非连通图

## 二、图的存储
- 顺序
- 链式

五种树的存储方式的比较：
|操作|邻接矩阵|边集数组|邻接表|链式前向星|哈希表实现邻接表|
|-|-|-|-|-|-|
|图的初始化|n^2|m|n+m|n+m||
|查某条边是否存在|1|m|TD(vi)|TD(vi)||
|遍历某个点的所有边|n|m|TD(vi)|TD(vi)||
|遍历整张图|n^2|nm|n+m|n+m||
|空间复杂度|n|m|n+m|n+m||
### 2.1 邻接矩阵（ 二维数组）
 
### 2.2 边集数组

### 2.3 邻接表（数组+链式结构）

```go
// 邻接点  
type AdjNode struct {  
   AdjN int   // 邻接点标号  
   Weight int //顶点到该邻接点的权重  
   Next *AdjNode  
}  
  
// 顶点  
type VNode struct {  
   Val int  
   FirstAdjNode *AdjNode  
}  
  
type Graph struct {  
   VNum int  
   ENum int  
   VNodes []VNode  
}  
  
type Edge struct {  
   V1, V2 int  
   Weight int  
}  
  
func InitGraph(VertexNum int) *Graph {  
   g := &Graph{  
      VNum: VertexNum,  
      ENum: 0,  
      VNodes: make([]VNode, VertexNum),  
   }  
  
   //for _, vnode := range g.VNodes {  
       //vnode.Val =   //}   return g  
}  
  
func InsertEdge(graph *Graph, e *Edge) {  
   v1VNode := graph.VNodes[e.V1-1]    // 假设 v1 节点存储在下标 0 的位置  
   // 新建一个 v2 的邻接点  
   v2Adj := &AdjNode{  
      AdjN: e.V2,  
      Weight: e.Weight,  
      Next: v1VNode.FirstAdjNode,  
   }  
   v1VNode.FirstAdjNode = v2Adj  
  
   // 如果是无向图，还需要添加从 v2 到 v1 的连接  
   v2VNode := graph.VNodes[e.V2-1]  
   v1Adj := &AdjNode{  
      AdjN: e.V1,  
      Weight: e.Weight,  
      Next: v2VNode.FirstAdjNode,  
   }  
   v2VNode.FirstAdjNode = v1Adj  
}  
  
func BuildGraph(vnum int, v1s, v2s []int, weight []int) *Graph {  
   graph := InitGraph(vnum)  
  
   for i := 0; i < len(v1s); i++ {  
      e := &Edge{  
         V1: v1s[i],  
         V2: v2s[i],  
         Weight: weight[i],  
      }  
      InsertEdge(graph, e)  
   }  
  
   return graph  
}  
  
func test1()  {  
   vnum := 4  
   v1s := []int{1,1,3,1}  
   v2s := []int{2,3,4,4}  
   weights := []int{1,2,3,4}  
   graph := BuildGraph(vnum, v1s, v2s, weights)  
  
   for i, vnode := range graph.VNodes {  
      adj := vnode.FirstAdjNode  
      for adj != nil {  
         fmt.Printf("(%d,%d) 权重 %d \n",i+1, adj.AdjN, adj.Weight)  
         adj = adj.Next  
      }  
   }  
}
```

### 2.4 链式前向星（数组+静态链表）

### 2.5 哈希表实现邻接表

## 三、图的遍历
### 3.1 DFS

### 3.2 BFS
