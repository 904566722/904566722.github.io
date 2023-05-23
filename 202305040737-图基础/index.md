# 图基础

<!--more-->

#算法 
## 一、基本概念
定义：G = (V, E)
![](images/posts/Pasted%20image%2020230523221729.png)

图的分类

`边是否有方向`：
- 有向图
- 无向图
![](images/posts/Pasted%20image%2020230523232313.png)

`图中是否有环`：
- 有环图
- 无环图
![](images/posts/Pasted%20image%2020230523232638.png)


`连通图和非连通图`
- 连通图
- 非连通图
![](images/posts/Pasted%20image%2020230523232438.png)

`边是否有权重`
- 有权图
- 无权图
![](images/posts/Pasted%20image%2020230523233328.png)


## 二、图的表示
- 顺序
- 链式

一个无向图的例子，展示如何用「邻接矩阵」和「邻接表」来表示一个图：
![](images/posts/Pasted%20image%2020230523235445.png)

邻接矩阵中保存着很多不存在的边，由于二维数组的连续性，会**浪费很多空间，但是查询速度快 O(1)**；在邻接表中，采用了一个数组来保存图的所有点，每个元素扩展成一个链表，只保存存在的边，**节省空间，但是查询效率 O(n)**，可以通过一些手段来优化这个链表，比如将链表转化为 AVL 或者 红黑树，查询效率能够优化到 O(logn)，或者采用哈希表，再将时间复杂度降至 O(1)


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

实现1.
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

2023/05/24 重新回顾

使用 map 来实现
```go
type vertex struct {  
   val int  
}  
  
/* 基于邻接表实现的无向图 */
type graphAdjMp struct {  
   adjMp map[vertex]map[vertex]struct{}  
}  
  
func (g *graphAdjMp) addVertex(v vertex)  {  
   if _, ok := g.adjMp[v]; ok {  
      // 该顶点已经存在，无需重复加入  
      return  
   }  
   // 新加一个节点，以及初始化一个链表  
   g.adjMp[v] = map[vertex]struct{}{}  
}  
  
func (g *graphAdjMp) deleteVertex(v vertex)  {  
   if _, ok := g.adjMp[v]; !ok {  
      // 节点是不存在的  
      return  
   }  
   /* 1.删除顶点 */   
   delete(g.adjMp, v)  
   /* 2.删除其他顶点中与之存在的关联 */   
   for _, rt := range g.adjMp {  
      delete(rt, v)  
   }  
}  
  
func (g *graphAdjMp) addEdge(v1, v2 vertex)  {  
   _, ok1 := g.adjMp[v1]  
   _, ok2 := g.adjMp[v2]  
   if !ok1 || !ok2 || v1 == v2 {  
      log.Fatal("add edge error")  
   }  
   g.adjMp[v1][v2] = struct{}{}  
   g.adjMp[v2][v1] = struct{}{}  
}  
  
func (g *graphAdjMp) deleteEdge(v1, v2 vertex) {  
   _, ok1 := g.adjMp[v1]  
   _, ok2 := g.adjMp[v2]  
   if !ok1 || !ok2 || v1 == v2 {  
      log.Fatal("delete edge error")  
   }  
   delete(g.adjMp[v1], v2)  
   delete(g.adjMp[v2], v1)  
}  
  
  
// newGraphAdjMp 使用边来初始化一个图  
// edges 的形式应该是 [(v1,v2),(v1,v3)...]
func newGraphAdjMp(edges [][]vertex) *graphAdjMp {  
   g := &graphAdjMp{  
      adjMp: make(map[vertex]map[vertex]struct{}),  
   }  
   for _, e := range edges {  
      g.addVertex(e[0])  
      g.addVertex(e[1])  
      g.addEdge(e[0], e[1])  
   }  
   return g  
}  
  
func (g *graphAdjMp) print()  {  
   if g.adjMp == nil {  
      fmt.Println("graph is nil")  
   }  
   for vt, toMp := range g.adjMp {  
      fmt.Print("vertex#", vt, "have edge: ")  
      for toVt := range toMp {  
         fmt.Print("(", vt.val, toVt.val, ")")  
      }  
      fmt.Println()  
   }  
}
```

测试：
```go
func TestGraphAdjMp()  {  
   edges := [][]vertex {  
      {vertex{val: 1},vertex{val: 2}},  
      {vertex{val: 1},vertex{val: 3}},  
      {vertex{val: 2},vertex{val: 1}},  
      {vertex{val: 2},vertex{val: 4}},  
      {vertex{val: 2},vertex{val: 5}},  
      {vertex{val: 3},vertex{val: 1}},  
      {vertex{val: 3},vertex{val: 4}},  
      {vertex{val: 4},vertex{val: 3}},  
      {vertex{val: 4},vertex{val: 2}},  
      {vertex{val: 4},vertex{val: 5}},  
   }  
   g := newGraphAdjMp(edges)  
   g.print()  
   g.deleteEdge(vertex{val: 1}, vertex{val: 3})  
   fmt.Println("delete edge(1,3)")  
   g.print()  
   g.addEdge(vertex{val: 3}, vertex{val: 5})  
   fmt.Println("delete edge(5,3)")  
   g.print()  
   g.addVertex(vertex{val: 6})  
   fmt.Println("add vertex 6")  
   g.print()  
   g.deleteVertex(vertex{val: 4})  
   fmt.Println("delete vertex 4")  
   g.print()  
}

out:
vertex#{1}have edge: (1 2)(1 3)
vertex#{2}have edge: (2 1)(2 4)(2 5)
vertex#{3}have edge: (3 4)(3 1)
vertex#{4}have edge: (4 5)(4 2)(4 3)
vertex#{5}have edge: (5 2)(5 4)
delete edge(1,3)
vertex#{1}have edge: (1 2)
vertex#{2}have edge: (2 1)(2 4)(2 5)
vertex#{3}have edge: (3 4)
vertex#{4}have edge: (4 3)(4 5)(4 2)
vertex#{5}have edge: (5 2)(5 4)
delete edge(5,3)
vertex#{1}have edge: (1 2)
vertex#{2}have edge: (2 1)(2 4)(2 5)
vertex#{3}have edge: (3 4)(3 5)
vertex#{4}have edge: (4 2)(4 3)(4 5)
vertex#{5}have edge: (5 3)(5 2)(5 4)
add vertex 6
vertex#{2}have edge: (2 4)(2 5)(2 1)
vertex#{3}have edge: (3 5)(3 4)
vertex#{4}have edge: (4 2)(4 3)(4 5)
vertex#{5}have edge: (5 2)(5 4)(5 3)
vertex#{6}have edge: 
vertex#{1}have edge: (1 2)
delete vertex 4
vertex#{3}have edge: (3 5)
vertex#{5}have edge: (5 2)(5 3)
vertex#{6}have edge: 
vertex#{1}have edge: (1 2)
vertex#{2}have edge: (2 1)(2 5)
```

### 2.4 链式前向星（数组+静态链表）

### 2.5 哈希表实现邻接表



---
1. https://www.hello-algo.com/chapter_graph/graph_operations/#922
