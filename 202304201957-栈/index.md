# 栈

<!--more-->

#Golang 

栈的相关操作有：入栈（push）、出栈（pop）（出栈的同时删除），获取栈顶元素（top）

```go
type myStack struct {  
   Nums []int  
}  
  
func (s *myStack) push(n int) {  
   s.Nums = append(s.Nums, n)  
}  
  
func (s *myStack) pop() int {  
   if s.isEmpty() {  
      return 0  
   }  
   top := s.Nums[len(s.Nums)-1]  
   s.Nums = s.Nums[:len(s.Nums)-1] // num[n:m] 的下标范围 [n,m)   return top  
}  
  
func (s *myStack) top() int {  
   return s.Nums[len(s.Nums)-1]  
}  
  
func (s *myStack) isEmpty() bool {  
   if len(s.Nums) == 0 {  
      return true  
   }  
   return false  
}
```

