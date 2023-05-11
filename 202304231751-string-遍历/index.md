# string 遍历

<!--more-->

#Golang 

在使用 for-range 遍历 string 中每个字符的时候，取出来的值是什么类型？

![[Pasted image 20230423173934.png]]
```go
func isAlienSorted(words []string, order string) bool {  
   // 首先要将 order 顺序映射成数值，来做比较  
   orderNums := make(map[rune]int, len(order))  
   for i, ch := range order {  
      fmt.Println(reflect.TypeOf(order[i])) // uint8  
      fmt.Printf("%c", order[i])  
      fmt.Println(reflect.TypeOf(ch)) // int32  
      fmt.Printf("%c", ch)  
      orderNums[ch] = i  
   }  
   return false  
}
```

对比：在遍历字符串的时候，有两种获取值的方式，如上面代码中的 ch、order[id]（索引的方式）
1. ch 实际上的类型是 int32（与 rune 相同，应该是考虑到 string 中如果存储了中文字符，能够直接使用 "%c" 的表达式将这个中文输出）
2. order[i] 实际上的类型是 uint8 （与 byte 相同，也就是一个字符的大小，占一个字节，但没法输出中文字符）
