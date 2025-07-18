# 哈希表（Hash Table）

**哈希表（Hash Table）** 是一种基于**键值对（Key-Value）** 存储的数据结构，通过**哈希函数（Hash Function）** 将键映射到内存地址（或数组索引），实现**平均 O(1)时间复杂度**的插入、删除和查找操作。它是解决“快速查找”问题的核心数据结构，广泛应用于缓存、数据库索引、去重等场景。

## 一、核心原理

哈希表的工作流程可概括为 3 步：

1. **哈希函数**：对输入的键（Key）计算哈希值（Hash Value），映射到数组的索引（如 `index = hash(key) % 数组长度`）。
2. **存储**：将键值对存入该索引对应的“桶（Bucket）”中。
3. **查询**：通过相同的哈希函数计算键的索引，直接访问对应桶获取值。

## 二、关键概念

1. **哈希函数（Hash Function）**  
   作用：将任意长度的键转换为固定范围的整数（哈希值）。  
   设计原则：

   - **均匀性**：哈希值分布均匀，避免大量键映射到同一索引（减少冲突）。
   - **高效性**：计算快速（如模运算、位运算）。
   - **确定性**：同一键必须对应同一哈希值。

   示例：对字符串键 `key`，哈希函数可设计为：

   ```python
   def hash_function(key, size):
       # 简单示例：将字符串ASCII码求和后取模
       hash_value = sum(ord(c) for c in key)
       return hash_value % size  # 映射到数组索引（0~size-1）
   ```

2. **哈希冲突（Hash Collision）**  
   定义：不同的键通过哈希函数得到**相同的索引**（如 `hash(key1) = hash(key2)`）。  
   冲突是不可避免的（因键的范围远大于数组长度），必须通过特定策略解决。

3. **负载因子（Load Factor）**  
   定义：`负载因子 = 元素数量 / 哈希表容量`，衡量哈希表的“拥挤程度”。  
   影响：负载因子越大，冲突概率越高，性能下降（如从 O(1)退化到 O(n)）。

## 三、哈希冲突的解决方法

### 1. **链地址法（Chaining，拉链法）**

原理：每个数组索引（桶）对应一个**链表（或红黑树）**，冲突的键值对按顺序存储在链表中。

- 插入：计算索引后，将键值对插入对应链表头部（或尾部）。
- 查询：计算索引后，遍历链表查找键对应的 value。

**示例（Python 实现）**：

```python
class HashTable:
    def __init__(self, size=10):
        self.size = size
        self.table = [[] for _ in range(size)]  # 每个桶是一个链表

    def _hash(self, key):
        return hash(key) % self.size  # 内置hash函数 + 取模

    def put(self, key, value):
        index = self._hash(key)
        # 若键已存在，更新值
        for i, (k, v) in enumerate(self.table[index]):
            if k == key:
                self.table[index][i] = (key, value)
                return
        # 键不存在，新增到链表
        self.table[index].append((key, value))

    def get(self, key):
        index = self._hash(key)
        for k, v in self.table[index]:
            if k == key:
                return v
        return None  # 键不存在

    def delete(self, key):
        index = self._hash(key)
        for i, (k, v) in enumerate(self.table[index]):
            if k == key:
                del self.table[index][i]
                return True
        return False  # 键不存在
```

**优点**：

- 处理冲突简单，不易产生“聚集”（大量冲突集中在某一区域）。
- 删除操作方便（无需移动其他元素）。
- 适合存储大量数据（链表可动态扩展）。

**缺点**：

- 链表节点需额外存储指针，内存开销略大。
- 若链表过长（如哈希函数差），查询效率退化到 O(n)（可优化为红黑树，如 Java 的`HashMap`）。

### 2. **开放寻址法（Open Addressing）**

原理：当冲突发生时，通过**探测（Probing）** 寻找下一个空闲的桶，而非使用链表。  
 常见探测方式：

- **线性探测**：冲突时，依次检查下一个索引（`index+1, index+2, ...`），直到找到空闲桶。  
  缺点：易产生“聚集”（连续冲突区域），后续插入更难。
- **二次探测**：冲突时，检查 `index+i²` 或 `index-i²`（如 `index+1, index-1, index+4, index-4...`），减少聚集。
- **双重哈希**：使用第二个哈希函数计算探测步长（`step = hash2(key)`），避免固定步长的聚集。

**示例（线性探测插入）**：

```python
def linear_probe_insert(table, key, value):
    size = len(table)
    index = hash(key) % size
    # 若索引冲突，线性探测下一个位置
    while table[index] is not None:
        index = (index + 1) % size  # 循环探测
    table[index] = (key, value)
```

**优点**：

- 无需额外指针，内存利用率高。
- 局部性好（数据集中存储），缓存友好。

**缺点**：

- 删除操作复杂（不能直接清空桶，需标记为“已删除”，否则影响后续探测）。
- 负载因子过高时性能急剧下降（通常负载因子阈值设为 0.7~0.8）。

## 四、哈希表的扩容（Rehashing）

当负载因子超过阈值（如 0.7）时，哈希表会触发**扩容**：

1. 创建一个**更大的新数组**（通常是原容量的 2 倍）。
2. 重新计算所有旧元素的哈希值（基于新容量），插入新数组。
3. 释放旧数组内存。

扩容的目的是降低负载因子，减少冲突，保证操作效率。扩容会带来 O(n)的时间开销，但因平均分布在各次操作中，整体仍保持 O(1)的平均复杂度。

## 五、性能分析

| 操作           | 平均时间复杂度 | 最坏时间复杂度（冲突严重时）              |
| -------------- | -------------- | ----------------------------------------- |
| 插入（Put）    | O(1)           | O(n)（链地址法链表过长/开放寻址法全冲突） |
| 查找（Get）    | O(1)           | O(n)                                      |
| 删除（Delete） | O(1)           | O(n)                                      |

## 六、应用场景

1. **键值对存储**：如 Python 的`dict`、Java 的`HashMap`、Redis 的核心存储结构。
2. **缓存系统**：如浏览器缓存（URL→ 网页内容）、数据库缓存（主键 → 数据行），利用 O(1)查找快速命中。
3. **去重操作**：如哈希集合（HashSet），通过键的唯一性快速判断元素是否存在（如爬虫去重已爬 URL）。
4. **数据库索引**：哈希索引（如 MySQL 的 Memory 引擎），加速等值查询（不适合范围查询）。
5. **密码验证**：存储密码的哈希值（而非明文），通过比对哈希值验证密码（如 MD5、SHA256）。

## 七、与其他数据结构的对比

| 数据结构 | 查找效率（平均） | 有序性 | 适用场景                         |
| -------- | ---------------- | ------ | -------------------------------- |
| 哈希表   | O(1)             | 无序   | 快速键值查询、去重、缓存         |
| 数组     | O(n)（未排序）   | 有序   | 索引访问、固定大小存储           |
| 链表     | O(n)             | 无序   | 频繁插入删除（首尾操作）         |
| 红黑树   | O(log n)         | 有序   | 范围查询、有序遍历（如 TreeMap） |

## 八、关键设计要点

1. **哈希函数**：优先选择均匀分布的函数（如 MD5、SHA 的简化版，或针对整数的模运算）。
2. **冲突处理**：链地址法实现简单、容错性高，是多数语言（Python、Java）的默认选择。
3. **负载因子**：阈值设为 0.7~0.8（空间与时间的平衡），超过则扩容。

哈希表凭借“键 → 地址”的直接映射，成为高效查找的代名词。其核心是通过巧妙的哈希函数和冲突处理策略，在时间与空间之间取得平衡，是编程中不可或缺的基础数据结构。
