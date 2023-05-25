# 回溯算法

<!--more-->
#算法 #回溯

## 一、什么是回溯算法

[回溯算法]^(Backtracking)的本质就是**穷举**可能的情况，将符合的预期的情况加入结果集的方法

回溯算法通常分为两个步骤：「**尝试**」与「**回退**」
- 尝试：选择下一种可能
- 回退：当某个状态无法继续前进，或者已经能够判断无法得到满足的解时，回到之前的状态，继续尝试其他可能

回溯算法的优化：
- **剪枝**：通过题目给定的约束条件，减少穷举的情况

	比如：
	![](images/posts/Pasted%20image%2020230525095942.png)

## 二、回溯通用化模版

```go
/* 回溯算法框架 */func backtrack(state *State, choices []Choice, res *[]State) {  
   // 判断是否为解  
   if isSolution(state) {  
      // 记录解  
      recordSolution(state, res)  
      return  
   }  
   // 遍历所有选择  
   for _, choice := range choices {  
      // 剪枝：判断选择是否合法  
      if !isValid(state, choice) {  
         continue  
      }  
      // 尝试：做出选择，更新状态  
      makeChoice(state, choice)  
      backtrack(state, choices, res)  
      // 回退：撤销选择，恢复到之前的状态  
      undoChoice(state, choice)  
   }  
}
```

- `state`：已经作出的选择组合成的状态
- `choices`：可以作出的选择

一个通用的模版应该包括：`检查` - `剪枝` - `尝试` - `回退`

## 三、例题

1. 在二叉树中搜索所有值为 7 的节点，返回根节点到这些节点的路径。条件：路径中不能包含值为 3 的节点

```go
func backtracking1(state *[]*treeNode, choices *[]*treeNode, ans *[][]*treeNode) {  
   /* 检查是否符合解的条件 */   
   if len(*state) != 0 && (*state)[len(*state)-1].val == 7 {  
      tmpState := make([]*treeNode, len(*state))  
      copy(tmpState, *state)  
      *ans = append(*ans, tmpState)  
      return  
   }  
  
   for _, choice := range *choices {  
      /* 根据给定条件剪枝 */      
      if !(choice != nil && choice.val != 3) {  
         continue  
      }  
  
      *state = append(*state, choice)  
      // 尝试  
      backtracking1(state, &[]*treeNode{choice.left, choice.right}, ans)  
      // 回退  
      *state = (*state)[:len(*state)-1]  
   }  
}
```

测试：
```go
func TestBT01() {  
   root := &treeNode{  
      val: 1,  
      left: &treeNode{  
         val: 7,  
         left: &treeNode{  
            val: 4,  
         },  
         right: &treeNode{  
            val: 5,  
         },  
      },  
      right: &treeNode{  
         val: 5,  
         left: &treeNode{  
            val: 6,  
            left: &treeNode{  
               val: 3,  
            },  
         },  
         right: &treeNode{val: 7},  
      },  
   }  
  
   var state []*treeNode  
   var ans [][]*treeNode  
   backtracking1(&state, &[]*treeNode{root}, &ans)  
   for _, path := range ans {  
      fmt.Print("path:\t")  
      for _, node := range path {  
         fmt.Print(node.val, ",")  
      }  
      fmt.Println()  
   }  
}


out:
path:   1,7,
path:   1,5,7,
```

2. [17. 电话号码的字母组合](https://leetcode.cn/problems/letter-combinations-of-a-phone-number/)

```go
func letterCombinations(digits string) []string {  
   if digits == "" {  
      return []string{}  
   }  
   var state []byte  
   digitsBs := []byte(digits)  
   var ans []string  
   helper(&state, digitsBs, &ans)  
   return ans  
}  
  
var number2chs = map[int][]byte{  
   2: {'a', 'b', 'c'},  
   3: {'d', 'e', 'f'},  
   4: {'g', 'h', 'i'},  
   5: {'j', 'k', 'l'},  
   6: {'m', 'n', 'o'},  
   7: {'p', 'q', 'r', 's'},  
   8: {'t', 'u', 'v'},  
   9: {'w', 'x', 'y', 'z'},  
}  
  
func helper(state *[]byte, digits []byte, ans *[]string) {  
   /*检查是否符合解的条件*/  
   if len(digits) == 0 {  
      *ans = append(*ans, string(*state))  
      return  
   }  
  
   num, _ := strconv.Atoi(string(digits[0]))  
   choices := number2chs[num]  
  
   for _, choice := range choices {  
      /*没有剪枝条件*/  
      //if !() {      
      // continue      
      //}  
      /*尝试*/  
      *state = append(*state, choice)  
      helper(state, digits[1:], ans)  
      /*回退*/  
      *state = (*state)[:len(*state)-1]  
   }  
}
```

---
1. https://www.hello-algo.com/chapter_backtracking/backtracking_algorithm/#1211


