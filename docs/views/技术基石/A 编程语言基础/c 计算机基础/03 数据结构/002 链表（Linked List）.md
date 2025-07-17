# 链表（Linked List）

**链表（Linked List）** 是一种动态数据结构，用**节点（Node）**存储数据，并通过**指针（引用）**连接节点。与数组不同，链表的元素在内存中**不连续存储**，适合频繁插入/删除操作的场景。以下是关于链表的核心知识点：

## 一、基本概念

1. **节点结构**

   - 每个节点包含：
     - **数据域**：存储实际数据；
     - **指针域**：指向下一个节点（单链表）或同时指向前驱和后继节点（双链表）。

2. **链表类型**

   - **单链表**：每个节点仅指向下一个节点，尾节点指针为`null`。
   - **双链表**：每个节点包含前驱和后继指针，头节点的前驱和尾节点的后继为`null`。
   - **循环链表**：尾节点的指针指向头节点（单循环）或头节点的前驱指向尾节点（双循环）。

3. **存储结构**
   - 节点在内存中**随机分布**，通过指针关联逻辑顺序。
   - 示例（单链表 `1 → 2 → 3`）：
     ```
     内存地址   节点数据   下一节点地址
     0x1000    1        0x1008
     0x1008    2        0x1010
     0x1010    3        null
     ```

## 二、链表的操作与复杂度

### 1. **插入节点**

- **时间复杂度：O(1)**（已知插入位置的前驱节点时）。
- 步骤：
  1.  创建新节点；
  2.  新节点的指针指向插入位置的后继节点；
  3.  前驱节点的指针指向新节点。
- 示例（在节点 2 后插入 4）：
  ```
  原链表：1 → 2 → 3
  插入后：1 → 2 → 4 → 3
  ```

### 2. **删除节点**

- **时间复杂度：O(1)**（已知待删除节点的前驱节点时）。
- 步骤：
  1.  前驱节点的指针指向待删除节点的后继节点；
  2.  释放待删除节点的内存。
- 示例（删除节点 2）：
  ```
  原链表：1 → 2 → 3
  删除后：1 → 3
  ```

### 3. **查找节点**

- **时间复杂度：O(n)**（需从头遍历）。
- 示例（查找值为 3 的节点）：
  ```python
  current = head
  while current is not None:
      if current.data == 3:
          return current
      current = current.next
  return None  # 未找到
  ```

### 4. **遍历链表**

- **时间复杂度：O(n)**。
- 示例（打印所有节点值）：
  ```python
  current = head
  while current is not None:
      print(current.data)
      current = current.next
  ```

## 三、单链表 vs 双链表

| **特性**      | **单链表**               | **双链表**                    |
| ------------- | ------------------------ | ----------------------------- |
| **指针方向**  | 仅指向下一个节点         | 包含前驱和后继指针            |
| **插入/删除** | 需先找到前驱节点（O(n)） | 可直接通过前驱/后继指针操作   |
| **空间开销**  | 每个节点 1 个指针        | 每个节点 2 个指针（空间更多） |
| **遍历方向**  | 只能从头至尾             | 支持双向遍历                  |

## 四、链表的实现代码

### 1. **单链表实现（Python）**

```python
class Node:
    def __init__(self, data=None):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    # 在尾部添加节点
    def append(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        current = self.head
        while current.next:
            current = current.next
        current.next = new_node

    # 删除节点
    def delete(self, key):
        current = self.head
        prev = None
        while current and current.data != key:
            prev = current
            current = current.next
        if prev is None:  # 删除头节点
            self.head = current.next
        elif current:
            prev.next = current.next

    # 遍历打印
    def display(self):
        elements = []
        current = self.head
        while current:
            elements.append(str(current.data))
            current = current.next
        print(" → ".join(elements))

# 使用示例
llist = LinkedList()
llist.append(1)
llist.append(2)
llist.append(3)
llist.display()  # 输出: 1 → 2 → 3
llist.delete(2)
llist.display()  # 输出: 1 → 3
```

### 2. **双链表实现（Python）**

```python
class Node:
    def __init__(self, data=None):
        self.data = data
        self.prev = None
        self.next = None

class DoublyLinkedList:
    def __init__(self):
        self.head = None

    # 在头部插入
    def insert_at_head(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        new_node.next = self.head
        self.head.prev = new_node
        self.head = new_node

    # 删除节点
    def delete(self, key):
        current = self.head
        while current and current.data != key:
            current = current.next
        if not current:
            return
        if current.prev:
            current.prev.next = current.next
        else:  # 删除头节点
            self.head = current.next
        if current.next:
            current.next.prev = current.prev
```

## 五、链表的应用场景

1. **动态数据存储**

   - 适合大小不确定的数据（如用户输入的数据流）。

2. **频繁插入/删除操作**

   - 如文本编辑器的撤销/重做功能、浏览器历史记录。

3. **实现其他数据结构**

   - 栈、队列、哈希表（冲突解决的链地址法）。

4. **内存管理**
   - 操作系统的内存分配（如空闲块链表）。

## 六、链表的优缺点

| **优点**                   | **缺点**               |
| -------------------------- | ---------------------- |
| 动态大小，无需预先分配空间 | 随机访问效率低（O(n)） |
| 插入/删除效率高（O(1)）    | 额外指针占用空间       |
| 适合频繁增删的场景         | 不支持高效的二分查找   |

## 七、面试高频问题

1. **反转链表**

   - 问题：将链表反转（如 `1→2→3` 变为 `3→2→1`）。
   - 解法：迭代或递归。

   ```python
   def reverse_list(head):
       prev = None
       current = head
       while current:
           next_node = current.next  # 保存后继节点
           current.next = prev       # 反转指针
           prev = current            # 移动prev
           current = next_node       # 移动current
       return prev
   ```

2. **链表中环的检测**

   - 问题：判断链表是否存在环。
   - 解法：快慢指针（快指针每次移动两步，慢指针移动一步，若相遇则有环）。

3. **合并两个有序链表**

   - 问题：将两个升序链表合并为一个新的升序链表。
   - 解法：递归或迭代（比较节点值，选择较小的节点）。

4. **删除链表倒数第 n 个节点**
   - 问题：删除链表倒数第 n 个节点。
   - 解法：双指针（快指针先走 n 步，然后快慢指针同步移动，快指针到尾时慢指针指向待删除节点的前驱）。

链表是理解指针和动态数据结构的基础，其核心思想在于通过指针关联离散的内存块，适合需要频繁增删操作的场景。掌握链表的基本操作和经典问题解法是面试的关键。
