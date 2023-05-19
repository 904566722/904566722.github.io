# string 字符串

<!--more-->
#string #Golang 

## 关于字符串的一些事实

- 使用索引的方式 **aString[i]** 来获得第 i 个字节，表达式 aString[i] 是不可寻址的
- 使用子切片语法 **aString[start:end]** 来获得一个子串

	> 使用子切片的语法来创建一个新的字符串，只会创建一个新的字符串对象（指针持有者），并不会对实际底层的字节序列做复制操作，也就是说，两个字符串对象共享部分的字节序列


## 字符串编码和 unicode 码点

字符串编码是为了将**字符**映射到**二进制数据**

unicode 编码为不同的人类语言进行了编码，使用 unicode 码点（code point）来找到对应的结果，比如：
|字符|码点|
|-|-|
|A|U+0041|
|你|U+4F60|

通常情况下大部分码点对应着一个字符，大部分的汉字需要 3 个字节来保存

在 Go 中，码点用 rune 来表示，rune 的底层结构是 int32（4 个字节）

## 字符串转换

{{< mermaid >}}
flowchart LR
a(字符串)<-->b(byte slice)
a<-->c(rune slice)
{{< /mermaid >}}

- 字符串能够直接转成 byte 切片，反之亦然
- 字符串能够直接转成 rune 切片，反之亦然

{{< mermaid >}}
flowchart TD
b(byte slice)
c(rune slice)

b-.-xc
{{< /mermaid >}}

[]byte 和 []rune 是没法直接转换的，可以使用 `unicode/utf8 库函数`来实现这些转换
```go
func Runes2Bytes(rs []rune) []byte {
	n := 0
	for _, r := range rs {
		n += utf8.RuneLen(r)
	}
	n, bs := 0, make([]byte, n)
	for _, r := range rs {
		n += utf8.EncodeRune(bs[n:], r)
	}
	return bs
}
```

## 编译器对于转换是否做深拷贝的优化

以下几种情况是不需要深拷贝的

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

## 一个语法糖
```go
hello := []byte("Hello ")
world := "world!"

// helloWorld := append(hello, []byte(world)...) // 正常的语法
helloWorld := append(hello, world...)            // 语法糖
```

## 字符串的比较

{{< mermaid >}}
flowchart TD
classDef important stroke:red, stroke-width:2px
classDef success stroke:green

a[长度是否相同]-->|Yes|b[持有指针是否相同]

a-->|No|endFailure
b-->|Yes|endSuccess

b-->|No|f[比较每个字节是否相同]
f-->|Yes|endSuccess
f-->|No|endFailure


endSuccess[相同]
endFailure[不相同]

class endFailure important
class endSuccess success
{{< /mermaid >}}

两个字符串比较的时间复杂度取决于 `持有的指针` 是否相同，如果相同，时间复杂度为 `O(1)`，如果不同，时间复杂度 `O(n)`



