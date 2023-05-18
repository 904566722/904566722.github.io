# for-range 中的副本拷贝

<!--more-->
#


```go
func TestForRange()  {  
   arr := [3]int{1,2,3}  
   for _, v := range arr {  
      arr[2] = 4  
      fmt.Println(v)  
   }  
  
   fmt.Println()  
   slice := []int{1,2,3}  
   for _, v := range slice {  
      slice[2] = 4  
      fmt.Println(v)  
   }  
}
```

以上的输出为什么是：
```txt
1
2
3

1
2
4
```

原因：

使用 for-range 遍历容器，实际上遍历的是容器的一个副本值，首先确定被遍历的两个对象的类型：
- `arr`：数组
- `slice`：切片

遍历 arr 数组的时候，复制另外一份数组 arr2 用来遍历，因此就算在循环内修改 arr 的值，是不会影响到 arr2 的；遍历 slice 切片的时候，副本 slice2 仍然是切片，slice、slice2 指向的都是同一个底层的序列，slice 的修改会影响到 slice2，因此输出的结果会随着修改产生变化


那么在遍历数组的时候可以用这样的方式来**提高效率**：
```go {hl_lines=[3]}
func TestForRange()  {  
   arr := [3]int{1,2,3}  
   for _, v := range arr[:] {    // 转成切片
      fmt.Println(v)  
   }  
}
```
