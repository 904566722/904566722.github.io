# sql 基本语法回顾

<!--more-->
#

## 一、查询
### 1.1 用法

```sql
SELECT [DISTINCT] column_name,column_name
	FROM table_name
	[WHERE Clause]
	[LIMIT N][ OFFSET M]
	ORDER BY field1 [ASC [DESC][默认 ASC]], [field2...] [ASC [DESC][默认 ASC]]
	GROUP BY column_name
	HAVING condition
```

- `WHERE`

 op:
|操作符|描述|
|-|-|
|=||
|!=,<>||
|>,>=||
|<,<=||
|IS NULL||
|IS NOT NULL||
|<=>|比较的两个值**相等** 或者 **都为NULL** 时返回true|
|LIKE|e.g field LIKE '%aaa%'|

where 判断中，可能会用到一些方法
|方法|描述|
|-|-|
|LENGTH()|字节数|
|CHAR_LENGTH()|字符数|

- `ORDER BY`：排序
	- ASC
	- DESC
- `DISTINCT`：去重
- `GROUP BY`：分组
	- `HAVING`：通常跟 GROUP BY 一起使用，用于筛选分组

### 1.2 练习
1.  [1757. 可回收且低脂的产品](https://leetcode.cn/problems/recyclable-and-low-fat-products/)
2.  [584. 寻找用户推荐人](https://leetcode.cn/problems/find-customer-referee/)
	```sql
	SELECT name FROM customer
	    WHERE referee_id <> 2 
	    OR referee_id IS NULL
	```
3.  [595. 大的国家](https://leetcode.cn/problems/big-countries/)
4.  [1148. 文章浏览 I](https://leetcode.cn/problems/article-views-i/)
	```sql
	SELECT DISTINCT author_id AS id
	    FROM Views
	    WHERE author_id = viewer_id
	    ORDER BY id ASC
	```

### 1.3 一些错误例子
1. 在 select 中，select 是最后执行的，给字段取了别名是不能在 where 中使用的
```
SELECT author_id AS id
    FROM Views
    WHERE id = viewer_id
    ORDER BY id ASC
```

## 二、更新
### 2.1 用法
```sql
UPDATE table_name SET field1=new-value1, field2=new-value2
[WHERE Clause]
```

## 三、插入
### 3.1 用法
```sql
INSERT INTO table_name ( field1, field2,...fieldN )
                       VALUES
                       ( value1, value2,...valueN );
```

## 四、删除
### 4.1 用法
```sql
DELETE FROM table_name 
	[WHERE Clause]
```

## 五、连接
### 5.1 用法

|连接方式|图示|
|-|-|
|INNER JOIN|![](images/posts/Pasted%20image%2020230522120659.png)|
|LEFT JOIN|![](images/posts/Pasted%20image%2020230522120731.png)|
|RIGHT JOIN|![](images/posts/Pasted%20image%2020230522120744.png)|

```sql
SELECT a.runoob_id, a.runoob_author, b.runoob_count 
	FROM runoob_tbl a 
	INNER JOIN tcount_tbl b 
	ON a.runoob_author = b.runoob_author
```

### 5.2 练习
1. [1378. 使用唯一标识码替换员工ID](https://leetcode.cn/problems/replace-employee-id-with-the-unique-identifier/)
2. [1068. 产品销售分析 I](https://leetcode.cn/problems/product-sales-analysis-i/)
3. [570. 至少有5名直接下属的经理](https://leetcode.cn/problems/managers-with-at-least-5-direct-reports/)

	```sql
	SELECT t1.name
	    FROM Employee as t1
	    JOIN (
	        SELECT managerId
	            FROM Employee a
	            GROUP BY a.managerId
	            HAVING count(id) >= 5
	    ) as t2
	    ON t1.id = t2.managerId
	```

4.  [2356. 每位教师所教授的科目种类的数量](https://leetcode.cn/problems/number-of-unique-subjects-taught-by-each-teacher/)

## 六、聚合函数
### 6.1 用法
| 聚合函数 | 举例 | 说明 |
| --- | --- | --- |
| `COUNT()` | `SELECT COUNT(*) FROM users;` | 计算指定列中的行数 |
| `SUM()` | `SELECT SUM(amount) FROM orders;` | 计算指定列中所有值的总和 |
| `AVG()` | `SELECT AVG(amount) FROM orders;` | 计算指定列中所有值的平均值 |
| `MAX()` | `SELECT MAX(amount) FROM orders;` | 计算指定列中所有值的最大值 |
| `MIN()` | `SELECT MIN(amount) FROM orders;` | 计算指定列中所有值的最小值 |

还有一些数值计算相关的聚合函数：
| 聚合函数 | 举例 | 说明 |
| --- | --- | --- |
| `ABS()` |` SELECT ABS(-10) FROM data;` | 返回指定数值的绝对值 |
| `CEIL()` | `SELECT CEIL(3.14) FROM data;` | 返回不小于指定数值的最小整数 |
| `FLOOR()` | `SELECT FLOOR(3.14) FROM data;` | 返回不大于指定数值的最大整数 |
| `MOD()` | `SELECT MOD(10, 3) FROM data;` | 返回指定两个数值相除的余数 |
| `POWER()` | `SELECT POWER(2, 3) FROM data;` | 返回指定数值的指定次幂 |
| `ROUND()` | `SELECT ROUND(3.14159, 2) FROM data;` | 返回指定数值的四舍五入值 |
| `SIGN()` | `SELECT SIGN(-10) FROM data;` | 返回指定数值的符号（1 表示正数，-1 表示负数，0 表示零） |
| `SQRT()` | `SELECT SQRT(16) FROM data;` | 返回指定数值的平方根 |

### 6.2 练习
1.  [620. 有趣的电影](https://leetcode.cn/problems/not-boring-movies/)
	```sql
	SELECT *
	    FROM cinema
	    WHERE description <> 'boring'
	        AND MOD(id, 2) = 1
	    ORDER BY rating DESC
	```
