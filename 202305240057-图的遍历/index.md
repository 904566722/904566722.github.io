# 图的遍历

<!--more-->
#

## 一、两种遍历方式

- [BFS]^(Breadth First Search)：广度优先
- [DFS]^(Depth First Search)：深度优先

### 1.1 广度优先
![](images/posts/Pasted%20image%2020230524013254.png)

### 1.2 深度优先
![](images/posts/Pasted%20image%2020230524020843.png)

## 二、代码实现
### 2.1 BFS
```go
func (g *graphAdjMp) bfs(startVt vertex) []vertex {  
   if g.adjMp == nil {  
      fmt.Println("graph is nil")  
   }  
  
   var queue []vertex  
   visited := make(map[vertex]struct{})  
   var visitRst []vertex  
  
   // visitRst 用来存储访问结果  
   visitRst = append(visitRst, startVt)  
   // 标记已经访问  
   visited[startVt] = struct{}{}  
   queue = append(queue, startVt)  
  
   for len(queue) > 0 {  
      cur := queue[0]  
      queue = queue[1:]  
      // 遍历相邻节点，如果还没访问，就访问，并加入队列  
      for toVt, _ := range g.adjMp[cur] {  
         if _, ok := visited[toVt]; ok {  
            // 节点已经访问过，跳过  
            continue  
         }  
  
         visitRst = append(visitRst, toVt)  
         visited[toVt] = struct{}{}  
         queue = append(queue, toVt)  
      }  
   }  
   return visitRst  
}
```

时间复杂度，所有的节点都会入队列一次，时间 O(|V|)，每条边都会遍历两次，时间 O(2|E|)，总的时间复杂度 O(|V|+|E|)

测试
```go
var edges = [][]vertex {  
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

func TestGraphBFS()  {  
   g := newGraphAdjMp(edges)  
   if g.adjMp == nil {  
      return  
   }  
   // 从某个节点开始遍历  
   for vt := range g.adjMp {  
      // 标记为已访问  
      visitRst := g.bfs(vt)  
      for _, vt := range visitRst {  
         fmt.Println("visit rst:", vt)  
      }  
      break  
   }  
}


visit rst: {5}
visit rst: {2}
visit rst: {4}
visit rst: {1}
visit rst: {3}
```

### 2.2 DFS
```go
func (g *graphAdjMp) dfs(startVt vertex) []vertex {  
   visited := make(map[vertex]struct{})  
   var visitRst []vertex  
   g.dfsHelper(startVt, visited, &visitRst)  
   return visitRst  
}  
  
func (g *graphAdjMp) dfsHelper(startVt vertex, visited map[vertex]struct{}, visitRst *[]vertex)  {  
   *visitRst = append(*visitRst, startVt)  
   visited[startVt] = struct{}{}  
   for toVt := range g.adjMp[startVt] {  
      if _, ok := visited[toVt]; ok {  
         continue  
      }  
  
      g.dfsHelper(toVt, visited, visitRst)  
   }  
}
```

---
1. https://www.hello-algo.com/chapter_graph/graph_traversal/#932
