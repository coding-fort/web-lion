# 栈（Stack）

**栈（Stack）** 是一种遵循**后进先出（Last In First Out, LIFO）**原则的线性数据结构，仅允许在**栈顶（Top）**进行插入和删除操作。以下是关于栈的核心知识点：

## 一、基本概念

1. **栈的操作**

   - **入栈（Push）**：将元素添加到栈顶。
   - **出栈（Pop）**：移除并返回栈顶元素。
   - **查看栈顶（Peek/Top）**：返回栈顶元素但不删除。
   - **判空（Empty）**：检查栈是否为空。
   - **获取大小（Size）**：返回栈中元素的数量。

2. **存储结构**

   - 栈可通过**数组**或**链表**实现：
     - **顺序栈**：用数组实现，需预先分配空间，可能溢出。
     - **链式栈**：用链表实现，动态分配空间，无溢出问题。

3. **LIFO 特性**
   - 最后进入栈的元素最先被取出，类似“一摞盘子”。

## 二、栈的操作与复杂度

| **操作**     | **时间复杂度** | **说明**           |
| ------------ | -------------- | ------------------ |
| 入栈（Push） | O(1)           | 直接在栈顶添加元素 |
| 出栈（Pop）  | O(1)           | 直接移除栈顶元素   |
| 查看栈顶     | O(1)           | 直接返回栈顶元素   |
| 判空         | O(1)           | 检查栈顶指针或大小 |

## 三、栈的实现代码

### 1. **基于数组的实现（Python）**

```python
class Stack:
    def __init__(self):
        self.items = []  # 使用列表作为底层存储

    def is_empty(self):
        return len(self.items) == 0

    def push(self, item):
        self.items.append(item)  # 入栈：添加到列表尾部

    def pop(self):
        if self.is_empty():
            raise IndexError("pop from empty stack")
        return self.items.pop()  # 出栈：移除列表尾部元素

    def peek(self):
        if self.is_empty():
            raise IndexError("peek from empty stack")
        return self.items[-1]  # 查看栈顶

    def size(self):
        return len(self.items)

# 使用示例
stack = Stack()
stack.push(1)
stack.push(2)
stack.push(3)
print(stack.pop())  # 输出: 3
print(stack.peek())  # 输出: 2
```

### 2. **基于链表的实现（Python）**

```python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class Stack:
    def __init__(self):
        self.top = None  # 栈顶指针
        self.size = 0

    def is_empty(self):
        return self.size == 0

    def push(self, data):
        new_node = Node(data)
        new_node.next = self.top  # 新节点指向原栈顶
        self.top = new_node  # 更新栈顶
        self.size += 1

    def pop(self):
        if self.is_empty():
            raise IndexError("pop from empty stack")
        data = self.top.data
        self.top = self.top.next  # 更新栈顶
        self.size -= 1
        return data

    def peek(self):
        if self.is_empty():
            raise IndexError("peek from empty stack")
        return self.top.data
```

## 四、栈的应用场景

1. **表达式求值**

   - 计算后缀表达式（逆波兰表达式），如 `3 4 + 2 *` 求值为 `14`。
   - 中缀表达式转后缀表达式（需处理运算符优先级）。

2. **括号匹配**

   - 检查表达式中括号是否正确配对（如 `{[()]}` 合法，`{(})` 非法）。

3. **函数调用栈**

   - 操作系统和编程语言用栈管理函数调用和返回地址（如递归调用）。

4. **回溯算法**

   - 如迷宫路径搜索、八皇后问题，通过栈记录路径和状态。

5. **浏览器历史记录**
   - 后退功能通过栈实现（访问页面时入栈，后退时出栈）。

## 五、经典问题与解法

### 1. **后缀表达式求值**

- **问题**：计算后缀表达式的值（如 `3 4 + 2 *`）。
- **解法**：
  1. 遍历表达式，遇到数字入栈，遇到运算符弹出栈顶两个元素计算后再入栈。
  2. 示例：
     ```
     输入: 3 4 + 2 *
     步骤:
     1. 3入栈 → [3]
     2. 4入栈 → [3, 4]
     3. 遇到+，弹出4和3，计算3+4=7，7入栈 → [7]
     4. 2入栈 → [7, 2]
     5. 遇到*，弹出2和7，计算7*2=14，14入栈 → [14]
     输出: 14
     ```

### 2. **括号匹配检查**

- **问题**：判断字符串中括号是否匹配（如 `{[()]}` 合法）。
- **解法**：

  1. 遍历字符串，遇到左括号入栈，遇到右括号时弹出栈顶元素检查是否匹配。
  2. 示例：

     ```python
     def is_matching(open_char, close_char):
         pairs = {'(': ')', '[': ']', '{': '}'}
         return pairs.get(open_char) == close_char

     def is_valid(s):
         stack = []
         for char in s:
             if char in '([{':
                 stack.append(char)
             else:
                 if not stack or not is_matching(stack.pop(), char):
                     return False
         return len(stack) == 0  # 栈必须为空
     ```

## 六、栈的优缺点

| **优点**              | **缺点**                       |
| --------------------- | ------------------------------ |
| LIFO 特性适合特定场景 | 仅支持栈顶操作，不支持随机访问 |
| 操作时间复杂度 O(1)   | 顺序栈可能溢出                 |
| 实现简单              | 链式栈需额外指针空间           |

## 七、面试高频问题

1. **用两个栈实现队列**

   - 问题：使用两个栈实现队列的入队（enqueue）和出队（dequeue）操作。
   - 解法：
     - **入队栈（stack1）**：所有入队元素压入此栈。
     - **出队栈（stack2）**：出队时若 stack2 为空，则将 stack1 所有元素弹出并压入 stack2，再弹出 stack2 的栈顶元素。

2. **最小栈（Min Stack）**

   - 问题：设计支持常数时间获取最小值的栈。
   - 解法：
     - 使用两个栈，一个存储数据，另一个存储当前最小值（每次入栈时比较并压入较小值）。

3. **单调栈（Monotonic Stack）**
   - 问题：求数组中每个元素的下一个更大元素（Next Greater Element）。
   - 解法：
     - 维护一个单调递减栈，遍历数组时若当前元素大于栈顶元素，则栈顶元素的下一个更大元素即为当前元素。

栈是理解程序执行逻辑（如函数调用、表达式计算）的基础数据结构，其核心思想是通过 LIFO 特性控制数据的访问顺序。掌握栈的基本操作和经典应用场景是解决算法问题的关键。
