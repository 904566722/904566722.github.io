# struct

<!--more-->

#Golang #struct 

直接看一个例子，熟悉 struct 的简单使用：
```go
// ** struct practice  
type person struct {  
   name string  
   age  int32  
}  
  
func structPractice() {  
   people := &person{  
      name: "索隆不喝酒",  
      age:  20,  
   }  
  
   fmt.Println(people)  // &{索隆不喝酒 20}   fmt.Println(*people) // {索隆不喝酒 20}   fmt.Println(&people) // 0x1400000e038  
  
   fmt.Printf("[value]\tname:%s\tage:%d\n", people.name, people.age)  
   // [value] name:索隆不喝酒 age:20   
   fmt.Printf("[value]\tname:%s\tage:%d\n", (*people).name, (*people).age)  
   // [value] name:索隆不喝酒 age:20   
   fmt.Printf("[addr]\tname:%d\tage:%d\n", &people.name, &people.age)  
   // [addr]  name:1374389584016 age:1374389584032  
}
```

- struct 存在方法集的概念，即所属于一个类型的方法的集合

	（local [202304241738 struct 方法集](content/posts/go/golang-why/202304241738%20struct%20方法集.md) remote [202304241738 struct 方法集](http://honghuiqiang.com/202304241738-struct-%E6%96%B9%E6%B3%95%E9%9B%86)）
