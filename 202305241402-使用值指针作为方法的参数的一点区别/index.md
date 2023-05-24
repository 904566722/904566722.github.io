# 使用值、指针作为方法的参数的一点区别

<!--more-->
#

## 观察测试结果

测试来自项目[go-tutorial](https://github.com/jincheng9/go-tutorial/tree/main)的其中一个片段：

https://github.com/jincheng9/go-tutorial/blob/main/workspace/senior/p28/pointer/pointer_test.go

先给出这个基准测试的一些结果：
```
honghuiqiang@192 pointer % go test -bench .
goos: darwin
goarch: arm64
pkg: pointer
BenchmarkByPointer-8    25197861                48.82 ns/op
BenchmarkByValue-8      37650502                31.92 ns/op
PASS
ok      pointer 3.511s
honghuiqiang@192 pointer % go test -bench .
goos: darwin
goarch: arm64
pkg: pointer
BenchmarkByPointer-8    25348558                48.21 ns/op
BenchmarkByValue-8      37798746                31.40 ns/op
PASS
ok      pointer 3.525
```

结果：
- 使用 **`指针传递更节省内存`**，这是显然的
- 使用指针传递比使用值传递更慢，这是为什么？既然省去了新开辟内存的时间，不应该更快吗？


## 为什么指针传递比值传递更慢？

给出该测试具体的代码：
```go {hl_lines=["50-52", 58, 83]}
type foo struct {  
   ID            string  `json:"_id"`  
   Index         int     `json:"index"`  
   GUID          string  `json:"guid"`  
   IsActive      bool    `json:"isActive"`  
   Balance       string  `json:"balance"`  
   Picture       string  `json:"picture"`  
   Age           int     `json:"age"`  
   EyeColor      string  `json:"eyeColor"`  
   Name          string  `json:"name"`  
   Gender        string  `json:"gender"`  
   Company       string  `json:"company"`  
   Email         string  `json:"email"`  
   Phone         string  `json:"phone"`  
   Address       string  `json:"address"`  
   About         string  `json:"about"`  
   Registered    string  `json:"registered"`  
   Latitude      float64 `json:"latitude"`  
   Longitude     float64 `json:"longitude"`  
   Greeting      string  `json:"greeting"`  
   FavoriteFruit string  `json:"favoriteFruit"`  
}  
  
type bar struct {  
   ID            string  
   Index         int  
   GUID          string  
   IsActive      bool  
   Balance       string  
   Picture       string  
   Age           int  
   EyeColor      string  
   Name          string  
   Gender        string  
   Company       string  
   Email         string  
   Phone         string  
   Address       string  
   About         string  
   Registered    string  
   Latitude      float64  
   Longitude     float64  
   Greeting      string  
   FavoriteFruit string  
}  
  
var input foo  
  
func init() {  
   err := json.Unmarshal([]byte(`{  
    "_id": "5d2f4fcf76c35513af00d47e",    "index": 1,    "guid": "ed687a14-590b-4d81-b0cb-ddaa857874ee",    "isActive": true,    "balance": "$3,837.19",    "picture": "http://placehold.it/32x32",    "age": 28,    "eyeColor": "green",    "name": "Rochelle Espinoza",    "gender": "female",    "company": "PARLEYNET",    "email": "rochelleespinoza@parleynet.com",    "phone": "+1 (969) 445-3766",    "address": "956 Little Street, Jugtown, District Of Columbia, 6396",    "about": "Excepteur exercitation labore ut cupidatat laboris mollit ad qui minim aliquip nostrud anim adipisicing est. Nisi sunt duis occaecat aliquip est irure Lorem irure nulla tempor sit sunt. Eiusmod laboris ex est velit minim ut cillum sunt laborum labore ad sunt.\r\n",    "registered": "2016-03-20T12:07:25 -00:00",    "latitude": 61.471517,    "longitude": 54.01596,    "greeting": "Hello, Rochelle Espinoza!You have 9 unread messages.",    "favoriteFruit": "banana"  }`), 
    &input)  
   if err != nil {  
      panic(err)  
   }  
}  
  
func byPointer(in *foo) *bar {  
   return &bar{  
      ID:            in.ID,  
      Address:       in.Address,  
      Email:         in.Email,  
      Index:         in.Index,  
      Name:          in.Name,  
      About:         in.About,  
      Age:           in.Age,  
      Balance:       in.Balance,  
      Company:       in.Company,  
      EyeColor:      in.EyeColor,  
      FavoriteFruit: in.FavoriteFruit,  
      Gender:        in.Gender,  
      Greeting:      in.Greeting,  
      GUID:          in.GUID,  
      IsActive:      in.IsActive,  
      Latitude:      in.Latitude,  
      Longitude:     in.Longitude,  
      Phone:         in.Phone,  
      Picture:       in.Picture,  
      Registered:    in.Registered,  
   }  
}  
  
func byValue(in foo) bar {  
   return bar{  
      ID:            in.ID,  
      Address:       in.Address,  
      Email:         in.Email,  
      Index:         in.Index,  
      Name:          in.Name,  
      About:         in.About,  
      Age:           in.Age,  
      Balance:       in.Balance,  
      Company:       in.Company,  
      EyeColor:      in.EyeColor,  
      FavoriteFruit: in.FavoriteFruit,  
      Gender:        in.Gender,  
      Greeting:      in.Greeting,  
      GUID:          in.GUID,  
      IsActive:      in.IsActive,  
      Latitude:      in.Latitude,  
      Longitude:     in.Longitude,  
      Phone:         in.Phone,  
      Picture:       in.Picture,  
      Registered:    in.Registered,  
   }  
}  
  
var pointerResult *bar  
  
func BenchmarkByPointer(b *testing.B) {  
   var r *bar  
   b.ResetTimer()  
   for i := 0; i < b.N; i++ {  
      r = byPointer(&input)  
   }  
   pointerResult = r  
}  
  
var valueResult bar  
  
func BenchmarkByValue(b *testing.B) {  
   var r bar  
   b.ResetTimer()  
   for i := 0; i < b.N; i++ {  
      r = byValue(input)  
   }  
   valueResult = r  
}
```

两个方法：
```go
func byPointer(in *foo) *bar {
	// 访问 in 的所有字段
}

func byValue(in foo) bar {
	// 访问 in 的所有字段
}
```

设传递指针的方法花费的时间 `pTime`, 值传递的方法花费的时间 vTime`，`结构体的字段数量 `m`
- pTime =  **`拷贝一次指针`**  +  m * (**`指针解引用`** + `访问字段`)
- vTime = **`拷贝一次结构体`**  + m * `访问字段`

当传递的是结构体指针类型，访问字段需要两个步骤，一次是指针解引用，一次是访问字段，而传递结构体值，不需要指针解引用，因此两个方法时间的不同主要体现在 `拷贝参数的时间` 以及传递指针需要额外的 m 次 `指针解引用` 的时间。

上面的例子中 vTime < pTime 是因为 `拷贝一次结构体` < `拷贝一次指针` +  `m 次指针解引用`，这种情况通常发生在结构体的尺寸较小的情况下，那么如果让结构体的尺寸变得很大，增加拷贝结构体的时间，能否达到指针方法用时更短的效果

稍微做一下修改，传参分别使用**保存指针的切片**跟**保存值的数组**，观察一下结果：
```go
const N = 10000  
  
var inputs [N]foo  
var inputsPtr []*foo  
  
func init() {  
   testTxt := []byte(`{  
    "_id": "5d2f4fcf76c35513af00d47e",    "index": 1,    "guid": "ed687a14-590b-4d81-b0cb-ddaa857874ee",    "isActive": true,    "balance": "$3,837.19",    "picture": "http://placehold.it/32x32",    "age": 28,    "eyeColor": "green",    "name": "Rochelle Espinoza",    "gender": "female",    "company": "PARLEYNET",    "email": "rochelleespinoza@parleynet.com",    "phone": "+1 (969) 445-3766",    "address": "956 Little Street, Jugtown, District Of Columbia, 6396",    "about": "Excepteur exercitation labore ut cupidatat laboris mollit ad qui minim aliquip nostrud anim adipisicing est. Nisi sunt duis occaecat aliquip est irure Lorem irure nulla tempor sit sunt. Eiusmod laboris ex est velit minim ut cillum sunt laborum labore ad sunt.\r\n",    "registered": "2016-03-20T12:07:25 -00:00",    "latitude": 61.471517,    "longitude": 54.01596,    "greeting": "Hello, Rochelle Espinoza!You have 9 unread messages.",    "favoriteFruit": "banana"  }`)  
   err := json.Unmarshal(testTxt, &input)  
   if err != nil {  
      panic(err)  
   }  
   for i := 0; i < len(inputs); i++ {  
      inputs[i] = input  
      inputsPtr = append(inputsPtr, &input)  
   }  
}  
  
func byPointer(ins []*foo) *bar {  
   in := ins[0]  
   return &bar{  
      ID:            in.ID,  
      Address:       in.Address,  
      Email:         in.Email,  
      Index:         in.Index,  
      Name:          in.Name,  
      About:         in.About,  
      Age:           in.Age,  
      Balance:       in.Balance,  
      Company:       in.Company,  
      EyeColor:      in.EyeColor,  
      FavoriteFruit: in.FavoriteFruit,  
      Gender:        in.Gender,  
      Greeting:      in.Greeting,  
      GUID:          in.GUID,  
      IsActive:      in.IsActive,  
      Latitude:      in.Latitude,  
      Longitude:     in.Longitude,  
      Phone:         in.Phone,  
      Picture:       in.Picture,  
      Registered:    in.Registered,  
   }  
}  
  
func byValue(ins [N]foo) bar {  
   in := ins[0]  
   return bar{  
      ID:            in.ID,  
      Address:       in.Address,  
      Email:         in.Email,  
      Index:         in.Index,  
      Name:          in.Name,  
      About:         in.About,  
      Age:           in.Age,  
      Balance:       in.Balance,  
      Company:       in.Company,  
      EyeColor:      in.EyeColor,  
      FavoriteFruit: in.FavoriteFruit,  
      Gender:        in.Gender,  
      Greeting:      in.Greeting,  
      GUID:          in.GUID,  
      IsActive:      in.IsActive,  
      Latitude:      in.Latitude,  
      Longitude:     in.Longitude,  
      Phone:         in.Phone,  
      Picture:       in.Picture,  
      Registered:    in.Registered,  
   }  
}
```

测试结果：
```txt
goos: darwin
goarch: arm64
pkg: pointer
BenchmarkByPointer-8    17808786                66.36 ns/op
BenchmarkByValue-8         10000            110766 ns/op
PASS
ok      pointer 3.703s
```

> 指针的尺寸通常跟机器相关，在 64 位的机器上，为 8 Byte

总结：在使用传进来的指针访问结构体字段时，需要先通过指针获取结构体的地址，然后再访问结构体的每个字段。这涉及两个操作：首先要解引用指针以获取结构体的地址，然后才能访问结构体的每个字段。这两个步骤都需要额外的操作和时间。

而当使用传进来的结构体值来访问结构体字段时，可以直接访问结构体中的每个字段，不需要解引用指针获取结构体地址。因此，它只涉及一次操作，所需的时间比使用指针少。
