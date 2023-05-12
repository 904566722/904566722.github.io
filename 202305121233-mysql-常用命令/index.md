# MySQL 常用命令

<!--more-->
#mysql

进入数据库
```mysql
mysql -uroot -p	# login
show databases;
use db_name;	# 选择数据库
show tables;	# 显示表
```

增删改查
```mysql
select * from table_name;
# where 条件查询
# =
# <>	!=
# <	<=	>	>=
# between a and b
# is NULL	is not NULL

delete from outcome where id=1;

update table_name set remark='motify' where id=1;

insert into table_name (field1, ...) where (value1, ...);
```

修改密码
```mysql
ALTER USER 'root'@'localhost' IDENTIFIED BY '1ASDinnocent';
```
