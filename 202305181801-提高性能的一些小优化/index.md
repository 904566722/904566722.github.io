# Golang 提高性能的一些小优化记录

<!--more-->
#

## `for-range` 副本的问题

```go
func TestForRange()  {  
   arr := [3]int{1,2,3}  
   for _, v := range arr[:] {    // 转成切片
      fmt.Println(v)  
   }  
}
```

（local [202305181719 for-range 中的副本拷贝](content/posts/go/golang-why/202305181719%20for-range%20中的副本拷贝.md) remote [202305181719 for-range 中的副本拷贝](http://honghuiqiang.com/202305181719-for-range-%E4%B8%AD%E7%9A%84%E5%89%AF%E6%9C%AC%E6%8B%B7%E8%B4%9D)）

## 字节切片跟字符串的转换

以下几种情况是不需要做深拷贝的

- 从**字节切片**到**字符串**
```go {hl_lines=[5,14]}
func fc() {
	// 下面的四个转换都不需要深复制。
	// 一个（至少有一个被衔接的字符串值为非空字符串常量的）字符串衔接表达式中的从字节切片到字符串的转换不需要深拷贝
	if string(x) != string(y) {
		s = (" " + string(x) + string(y))[1:]
	}
}


func fd() {
	// 两个在比较表达式中的转换不需要深复制，
	// 但两个字符串衔接中的转换仍需要深复制。
	// 请注意此字符串衔接和fc中的衔接的差别。
	if string(x) != string(y) {
		s = string(x) + string(y)
	}
}

```

- 从**字符串**到**字节切片**
```go {hl_lines=[3]}
func main() {
	var str = "world"
	for i, b := range []byte(str) {
		//...
	}
}
```

## 字符串剪切

```go
func f(s1 string) {
	s0 = (" " + s1[:50])[1:]
}
```
上面这种方法可能在将来失效，可以使用一种啰嗦一点的方式：

```go
func f(s1 string) {
	var b strings.Builder
	b.Grow(50)
	b.WriteString(s1[:50])
	s0 = b.String()
}
```


