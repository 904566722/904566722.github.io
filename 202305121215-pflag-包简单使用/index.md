# pflag 包简单使用

<!--more-->



## 一、基本了解

> https://github.com/spf13/pflag

### 1.1 基本概念

pflag 是 Go 的 flag 包的替代品， 实现了 POSIX/GNU 风格的 --flags

## 二、安装、使用

### 2.1 安装

`go.mod`

```
module Go

go 1.17

require (
	"github.com/spf13/pflag" v1.0.5
)
```

### 2.2 使用

导入包

```go
import "github.com/spf13/pflag"
```

#### 2.2.1 简单使用

```go
import (
    "github.com/spf13/pflag"
    "log"
)

const DefaultIP = "192.168.1.1"

type MyServerOption struct {
	LogDir string
	Ip     string
}

func NewServerOption() *MyServerOption {
    return &MyServerOption{}
}

func (s *MyServerOption) AddFlags(fs *pflag.FlagSet)  {
    log.Println(fs)

    fs.StringVar(&s.LogDir, "log-dir", s.LogDir, "服务的日志路径")
    fs.StringVar(&s.Ip, "ip", DefaultIP, "服务ip")				// 运行二进制的时候不指定 ip 参数将设置为该默认值
}

func main()  {
    s := testpflag.NewServerOption()
    s.AddFlags(pflag.CommandLine)
    pflag.Parse()

    log.Println(s)
}
```

```shell
[root@master pflag]# ./pflag  --help
Usage of ./pflag:
      --ip string        服务ip (default "192.168.1.1")
      --log-dir string   服务的日志路径
pflag: help requested
```

#### 2.2.2 提供单字母简写

```go
fs.StringVarP(&s.Name, "name", "n", "default name", "服务名称")
```

使用 `VarP` 的形式绑定参数之后，可以以 "--name" 或者 "-n" 来指定

```shell
[root@master pflag]# ./pflag  --help
Usage of ./pflag:
      --ip string        服务ip (default "192.168.1.1")
      --log-dir string   服务的日志路径
  -n, --name string      服务名称 (default "default name")
pflag: help requested

```

#### 2.2.3 规范化标志的名称(相当于设置别名)

使用 FlagSet 的方法 `SetNormalizeFunc` 允许我们自定义一个函数来翻译标志名，例如一个 "URL" 的标志名可以被翻译为 "url"

**规范化前：**

```go
[root@master pflag]# ./pflag  --url="hello.com"
unknown flag: --url
Usage of ./pflag:
      --URL string       地址 (default "hhq.com")
      --ip string        服务ip (default "192.168.1.1")
      --log-dir string   服务的日志路径
  -n, --name string      服务名称 (default "default name")
unknown flag: --url
```

**规范化后：**

```
./pflag  --url="hello.com"
2022/09/16 02:41:43 &{ 192.168.1.1 default name hello.com}
```

**代码：**

```go
func main()  {
    s := testpflag.NewServerOption()
    fs := pflag.CommandLine
    s.AddFlags(fs)
    fs.SetNormalizeFunc(CaseInsensitiveFunc)
    pflag.Parse()

    log.Println(s)
}

// CaseInsensitiveFunc 不区分标志名的大小写
func CaseInsensitiveFunc(fs *pflag.FlagSet, name string) pflag.NormalizedName {
    return pflag.NormalizedName(strings.ToLower(name))
}
```

#### 2.2.4 弃用一个标志

```go
err := fs.MarkDeprecated("bad-flag", "这个标志已经弃用,请使用新的标志：--good-flag")
if err != nil {
    log.Println("弃用标志失败")
}
```

说明弃用 "--bad-flag" 这个标志，如果用户继续使用这个标识，将给出说明

```shell
[root@master pflag]# ./pflag  --bad-flag=aa
Flag --bad-flag has been deprecated, 这个标志已经弃用,请使用新的标志：--good-flag
2022/09/16 02:47:10 &{ 192.168.1.1 default name hhq.com aa}
```


