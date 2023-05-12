# Gorm 基本使用

<!--more-->
#gorm #Golang 


## **一、基本用法**

### **1.1 创建与 mysql 的连接**

```go
require (
	gorm.io/driver/mysql v1.0.5
	gorm.io/gorm v1.21.3
)
// createConn 创建与 myslq 的连接
func createConn() (db *gorm.DB, err error) {
    dsn := "root:APTX4869@tcp(127.0.0.1:3306)/db_gorm_test?charset=utf8mb4&parseTime=True&loc=Local"
    db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Println("create db connection failed.")
        return nil, err
    }
    return
}
```

### **1.2 增删改查**

#### **1.2.1 增加记录**

1. 增加单条记录、批量增加记录

   ```go
   type Role struct {
   	RoleId string `json:"role_id"`
   	Name   string `json:"name"`
   }
   
   func (role *Role) Create(db *gorm.DB) error {
   	// 创建 role 记录
   	if result := db.Create(&role); result.Error != nil {
   		return errors.New("create role error")
   	}
   	return nil
   }
   
   func CreateBatch(db *gorm.DB, roles []Role) error {
   	if tx := db.Create(&roles); tx.Error != nil {
   		return errors.New("create role batch error")
   	}
   	return nil
   }
   ```

2. 可以根据 map 来创建

   ```go
   func CreateByMapTest(db *gorm.DB) error {
   	db.Model(&Role{}).Create(map[string]interface{}{"RoleId": "role-mapdf", "Name": "roleMap"})
   	return nil
   }
   ```

3. 使用 Model

   ```go
   type Model struct {
       ID        string `gorm:"primarykey"`
       CreatedAt time.Time
       UpdatedAt time.Time
       DeletedAt sql.NullTime `gorm:"index"`
   }
   
   type User struct {
       Model
       Name string
   }
   
   func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
       u.ID = utils.GenerateId("user", 10)
       u.CreatedAt = time.Now()
       u.UpdatedAt = time.Now()
       u.DeletedAt = sql.NullTime{}
       return
   }
   
   func CreateUseModel()  {
       db, err := createConn()
       if err != nil {
           log.Println("open db failed.")
       }
   
       user := &models.User{Name: "honghuiqiang"}
       db.Create(&user)
   }
   ```


1. 关联创建

   ```go
   type Model struct {
       ID        string `gorm:"primarykey"`
       CreatedAt time.Time
       UpdatedAt time.Time
       DeletedAt sql.NullTime `gorm:"index"`
   }
   
   type User struct {
   	Model
   	Name string
   	CreditCard CreditCard
   }
   
   type CreditCard struct {
   	ID     string
   	Number string
   	UserId string
   }
   
   func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
   	if len(u.ID) == 0 {
   		u.ID = utils.GenerateId("user", 10)
   	}
   	u.CreatedAt = time.Now()
   	u.UpdatedAt = time.Now()
   	u.DeletedAt = sql.NullTime{}
   
   	u.CreditCard.ID = utils.GenerateId("cc", 10)
   	u.CreditCard.UserId = u.ID
   	return
   }
   
   func CreateAssociation()  {
       db, err := createConn()
       if err != nil {
           log.Println("open db failed.")
       }
       user := models.User{Name: "honghuiqiang2", CreditCard: models.CreditCard{Number: "904566722"}}
       db.Create(&user)
   }
   ```

#### **1.2.2 删除记录**

1. 删除一条记录

   ```go
   db.Where("role_id = ?", "role-9j1t3").Delete(&models.Role{})
   ```

2. 删除多条记录

   ```go
   ids := []string{
       "role-sdftf",
       "role-sdjfu",
   }
   db.Debug().Where("role_id IN ?", ids).Delete([]models.Role{})
   // DELETE FROM `roles` WHERE role_id IN ('role-sdftf','role-sdjfu')
   ```

3. 软删除

   模型需包含 `gorm.DeletedAt` 字段

   ```go
   type Model struct {
       ID        string `gorm:"primarykey" json:"id"`
       CreatedAt time.Time `json:"created_at"`
       UpdatedAt time.Time `json:"updated_at"`
       DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
   }
   
   type User struct {
   	Model
   	Name                string `json:"name"`
   	StorageProtocolType string `json:"storage_protocol_type" gorm:"default:iscsi;comment:'存储协议类型'"`
   }
   
   db.Debug().Where("id = ?", "user-9mucs0t3zr").Delete(&models.User{})
   // UPDATE `users` SET `deleted_at`='2021-10-14 17:22:57.853' WHERE id = 'user-9mucs0t3zr' AND `users`.`deleted_at` IS NULL
   ```

   软删除之后，将不能以正常方式查找到该记录，可以使用 `Unscoped` 来查找

   ```go
   db.Debug().Where("id = ?", "user-9mucs0t3zr").First(&findUser)
   // [rows:0] SELECT * FROM `users` WHERE id = 'user-9mucs0t3zr' AND `users`.`deleted_at` IS NULL ORDER BY `users`.`id` LIMIT 1
   db.Debug().Unscoped().Where("id = ?", "user-9mucs0t3zr").First(&findUser)
   // [rows:1] SELECT * FROM `users` WHERE id = 'user-9mucs0t3zr' ORDER BY `users`.`id` LIMIT 1
   ```

4. 永久删除

   ```go
   db.Debug().Unscoped().Where("id = ?", "user-9mucs0t3zr").Delete(&models.User{})
   // [rows:1] DELETE FROM `users` WHERE id = 'user-9mucs0t3zr'
   ```

#### **1.2.3 修改记录**

1. 更新记录的全部字段

   即使字段是零值也会更新到数据库

   ```go
   var findUser models.User
   db.Debug().Where("id = ?", "user-5pu8tlxpg5").Find(&findUser)
   
   findUser.Name = "modify-name"
   db.Debug().Save(&findUser)
   // [rows:1] UPDATE `users` SET `created_at`='2021-10-14 10:21:07',`updated_at`='2021-10-14 17:41:26.304',`deleted_at`=NULL,`name`='modify-name' WHERE `id` = 'user-5pu8tlxpg5'
   ```

2. 更新指定字段

   ```go
   // 更新单个字段
   db.Model(&models.User{}).Where("id = ?", "user-5pu8tlxpg5").Update("qq", "904566722")
   
   // 更新多个字段
   db.Debug().Where("id = ?", "user-5pu8tlxpg5").Updates(models.User{Name: "hhq", QQ: "123"})
   // [rows:1] UPDATE `users` SET `updated_at`='2021-10-14 17:50:14.392',`name`='hhq',`qq`='123' WHERE id = 'user-5pu8tlxpg5'
   ```

#### **1.2.4 查询记录**

1. 搜索单个对象

   > `First` `Take` `Last`
   >
   > 查询数据库时添加了 LIMIT 1 条件
   >
   > 没找到： ErrRecordNotFound

   ```go
   db.Where("name = ?", "honghuiqiang").First(&user)
   ```

2. 搜索全部对象

   ```go
   var users []models.User
   db.Debug().Find(&users)
   ```

### **1.3 钩子**

> ```
> BeforeSave`、`AfterSave`、`BeforeCreate`、`AfterCreate`、`BeforeDelete`、`AfterDelete`、`BeforeUpdate`、`AfterUpdate
> ```

#### **1.3.1 BeforeCreate && AfterCreate**

1. BeforeCreate

   ```go
   // BeforeCreate 创建之前做的动作，为记录生成id
   func (role *Role) BeforeCreate(tx *gorm.DB) (err error) {
   	role.RoleId = utils.GenerateId("role", 10)
   	return
   }
   ```

   跳过钩子方法：使用会话模式

   ```go
   DB.Session(&gorm.Session{SkipHooks: true}).Create(&user)
   ```

#### **1.3.2 BeforeSave &&  AfterSave**

#### **1.3.3 BeforeDelete && AfterDelete**

1. BeforeDelete

   ```go
   func (role *Role) BeforeDelete(tx *gorm.DB) (err error) {
   	var findRole Role
   	tx.Debug().Where("role_id = ?", role.RoleId).First(&findRole)
       // SELECT * FROM `roles` WHERE role_id = 'role-fsi21' ORDER BY `roles`.`role_id` LIMIT 1
   	if findRole.Name == "Admin" {
   		return errors.New(fmt.Sprintf("delete role Admin failed"))
   	}
   	return
   }
   
   func DeleteTest()  {
       db, err := CreateConn()
       if err != nil {
           log.Println("create connection failed.")
       }
   
       db.Debug().Delete(&models.Role{RoleId: "role-fsi21"})
   }
   ```

#### **1.3.4 BeforeUpdate && AfterUpdate**

## **二、关联**

### **2.1 belongs to**

一个用户属于一家公司


```go
type User struct {
	Model
	Name      string `json:"name"`
	QQ        string `json:"qq"`
	// 一个用户属于一个公司
	CompanyId string `json:"company_id"`
	Company   Company
}

type Company struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}

func (c *Company) TableName() string {
    return "company"
}

func BelongsToTest()  {
    companyId := utils.GenerateId("company", 5)
    user := models.User{
        Model: models.Model{ID: utils.GenerateId("user", 5)},
        Name: "洪惠强",
        QQ: "904566722",
        CompanyId: companyId,
        Company: models.Company{Id: companyId, Name: "中国电子系统技术有限公司"},
    }

    db, err := base.CreateConn()
    if err != nil {
        log.Println("open db failed.")
    }

    db.Debug().Create(&user)
    // [rows:1] INSERT INTO `company` (`id`,`name`) VALUES ('company-3gs3u','中国电子系统技术有限公司') ON DUPLICATE KEY UPDATE `id`=`id`
    // [rows:1] INSERT INTO `users` (`id`,`created_at`,`updated_at`,`deleted_at`,`name`,`qq`,`company_id`) VALUES ('user-3gs3u','2021-10-15 10:26:00.312','2021-10-15 10:26:00.312',NULL,'洪惠强','904566722','company-3gs3u')

    user2 := models.User{
        Model: models.Model{ID: utils.GenerateId("user", 5)},
        Name: "陈之能",
        QQ: "unknown",
        CompanyId: "company-3gs3u",
        Company: models.Company{Id: "company-3gs3u", Name: "中国系统"},
    }
    db.Debug().Create(&user2)
    // [rows:0] INSERT INTO `company` (`id`,`name`) VALUES ('company-3gs3u','中国系统') ON DUPLICATE KEY UPDATE `id`=`id`
    // [rows:1] INSERT INTO `users` (`id`,`created_at`,`updated_at`,`deleted_at`,`name`,`qq`,`company_id`) VALUES ('user-ys4cf','2021-10-15 10:34:50.196','2021-10-15 10:34:50.196',NULL,'陈之能','unknown','company-3gs3u')
}
```

### **2.2 has one**

一个用户有一张卡

```go
type User struct {
	Model
	Name      string `json:"name"`
	QQ        string `json:"qq"`
	// has one
	CreditCard CreditCard
}

type CreditCard struct {
	ID     string
	Number string
	UserId string
}
```

### **2.3 has many**

一个用户拥有多张卡

```go
type User struct {
	Model
	Name      string `json:"name"`
	QQ        string `json:"qq"`
	// has one
	CreditCards []CreditCard
}

type CreditCard struct {
	ID     string
	Number string
	UserId string
}
```

### **2.4 many to many**

多对多关系需要中间表

```go
// 一个 user 可以说多种语言
// 一种 language 可以由多个 user 说
// 中间表 users_languages
type User struct {
    models.Model
    Name string `json:"name"`
    Languages []Language `gorm:"many2many:users_languages" json:"languages"`
}

type Language struct {
    models.Model
    Name string
    Users []User `gorm:"many2many:users_languages" json:"users"`
}

func ManyToManyTest() {
    db, err := base.CreateConn()
    if err != nil {
        log.Println("open db failed.")
    }

    // 会自动生成中间表
    db.Set("gorm:table_options", "ENGINE=InnoDB").AutoMigrate(&User{}, &Language{})

    user := User{
        Model: models.Model{
            ID: utils.GenerateId("user", 10),
        },
        Name: "小洪",
        Languages: []Language{
            {Model:models.Model{ID: utils.GenerateId("lg", 10)}, Name: "英语"},
            {Model:models.Model{ID: utils.GenerateId("lg", 11)}, Name: "中文"},
        },
    }

    db.Debug().Create(&user)
    // [rows:2] INSERT INTO `languages` (`id`,`created_at`,`updated_at`,`deleted_at`,`name`) VALUES ('lg-wgvnn84a70','2021-10-15 14:39:46.204','2021-10-15 14:39:46.204',NULL,'英语'),('lg-wgvnn84a70y','2021-10-15 14:39:46.204','2021-10-15 14:39:46.204',NULL,'中文') ON DUPLICATE KEY UPDATE `id`=`id`
    // [rows:2] INSERT INTO `users_languages` (`user_id`,`language_id`) VALUES ('user-wgvnn84a70','lg-wgvnn84a70'),('user-wgvnn84a70','lg-wgvnn84a70y') ON DUPLICATE KEY UPDATE `user_id`=`user_id`
    // [rows:1] INSERT INTO `users` (`id`,`created_at`,`updated_at`,`deleted_at`,`name`) VALUES ('user-wgvnn84a70','2021-10-15 14:39:46.195','2021-10-15 14:39:46.195',NULL,'小洪')
}

func ManyToManyFindTest()  {
    db, err := base.CreateConn()
    if err != nil {
        log.Println("open db failed.")
    }

    var findUsers []User
    var findLanguages []Language
    LanguageCondition := &Language{Model: models.Model{ID: "lg-5wb85aj644"}}
    userCondition := &User{Model: models.Model{ID: "user-5wb85aj644"}}
    // 查找使用某语言的所有用户
    db.Debug().Model(&LanguageCondition).Association("Users").Find(&findUsers)
    // [rows:1] SELECT `users`.`id`,`users`.`created_at`,`users`.`updated_at`,`users`.`deleted_at`,`users`.`name` FROM `users` JOIN `users_languages` ON `users_languages`.`user_id` = `users`.`id` AND `users_languages`.`language_id` = 'lg-5wb85aj644' WHERE `users`.`deleted_at` IS NULL

    // 查找某用户使用的语言
    db.Debug().Model(&userCondition).Association("Languages").Find(&findLanguages)
    // [rows:2] SELECT `languages`.`id`,`languages`.`created_at`,`languages`.`updated_at`,`languages`.`deleted_at`,`languages`.`name` FROM `languages` JOIN `users_languages` ON `users_languages`.`language_id` = `languages`.`id` AND `users_languages`.`user_id` = 'user-5wb85aj644' WHERE `languages`.`deleted_at` IS NULL

    marshalFindUsers, err := json.Marshal(findUsers)
    marshalFindLgs, err := json.Marshal(findLanguages)
    fmt.Println(string(marshalFindUsers))
    fmt.Println(string(marshalFindLgs))
}
```

## 三、声明模型 - 标签

- colume

- type

  bool、int、uint、float、string、time、bytes

- serializer

- size

- primaryKey

- unique

- default

- precision

- scale

- not null

- autoIncrement

- autoIncrementIncrement

- embedded

- embeddedPrefix

- autoCreateTime

- autoUpdateTime

- index

- uniqueIndex

- check

- < -

- - > 

- - 

- comment
