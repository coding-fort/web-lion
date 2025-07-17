# 队列（Queue）

**队列（Queue）** 是一种遵循**先进先出（First In First Out, FIFO）**原则的线性数据结构，仅允许在**队尾（Rear）**插入元素，在**队头（Front）**删除元素。以下是关于队列的核心知识点：

## 一、基本概念

1. **队列的操作**

   - **入队（Enqueue）**：将元素添加到队尾。
   - **出队（Dequeue）**：移除并返回队头元素。
   - **查看队头（Peek/Front）**：返回队头元素但不删除。
   - **判空（Empty）**：检查队列是否为空。
   - **获取大小（Size）**：返回队列中元素的数量。

2. **存储结构**

   - 队列可通过**数组**或**链表**实现：
     - **顺序队列**：用数组实现，需处理“假溢出”问题（通过循环队列优化）。
     - **链式队列**：用链表实现，动态分配空间，无溢出问题。

3. **FIFO 特性**
   - 最先进入队列的元素最先被取出，类似“排队”。

## 二、队列的操作与复杂度

| **操作**        | **时间复杂度** | **说明**           |
| --------------- | -------------- | ------------------ |
| 入队（Enqueue） | O(1)           | 直接在队尾添加元素 |
| 出队（Dequeue） | O(1)           | 直接移除队头元素   |
| 查看队头        | O(1)           | 直接返回队头元素   |
| 判空            | O(1)           | 检查队头指针或大小 |

## 三、队列的实现代码

### 1. **基于数组的循环队列（Python）**

```python
class CircularQueue:
    def __init__(self, capacity):
        self.capacity = capacity
        self.queue = [None] * capacity
        self.front = 0
        self.rear = 0
        self.size = 0

    def is_empty(self):
        return self.size == 0

    def is_full(self):
        return self.size == self.capacity

    def enqueue(self, item):
        if self.is_full():
            raise Exception("Queue is full")
        self.queue[self.rear] = item
        self.rear = (self.rear + 1) % self.capacity  # 循环指针
        self.size += 1

    def dequeue(self):
        if self.is_empty():
            raise Exception("Queue is empty")
        item = self.queue[self.front]
        self.front = (self.front + 1) % self.capacity  # 循环指针
        self.size -= 1
        return item

    def peek(self):
        if self.is_empty():
            raise Exception("Queue is empty")
        return self.queue[self.front]
```

### 2. **基于链表的队列（Python）**

```python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class Queue:
    def __init__(self):
        self.front = None  # 队头指针
        self.rear = None   # 队尾指针
        self.size = 0

    def is_empty(self):
        return self.size == 0

    def enqueue(self, data):
        new_node = Node(data)
        if self.is_empty():
            self.front = self.rear = new_node
        else:
            self.rear.next = new_node
            self.rear = new_node
        self.size += 1

    def dequeue(self):
        if self.is_empty():
            raise Exception("Queue is empty")
        data = self.front.data
        self.front = self.front.next
        if not self.front:  # 队列为空
            self.rear = None
        self.size -= 1
        return data

    def peek(self):
        if self.is_empty():
            raise Exception("Queue is empty")
        return self.front.data
```

## 四、队列的变种

1. **双端队列（Deque）**

   - 支持在队头和队尾两端进行插入和删除操作（如 Python 的`collections.deque`）。

2. **优先级队列（Priority Queue）**

   - 元素按优先级排序，优先级高的元素先出队（通常用堆实现，如 Java 的`PriorityQueue`）。

3. **循环队列（Circular Queue）**
   - 通过取模运算将数组首尾相连，解决顺序队列的“假溢出”问题。

## 五、队列的应用场景

1. **任务调度**

   - 操作系统中的进程调度（如先来先服务 FCFS 算法）。

2. **广度优先搜索（BFS）**

   - 遍历图或树时，用队列逐层访问节点。

3. **缓冲区管理**

   - 网络数据包缓存、打印机任务队列。

4. **消息队列系统**

   - 分布式系统中解耦生产者和消费者（如 RabbitMQ、Kafka）。

5. **模拟现实场景**
   - 如银行排队系统、餐厅叫号系统。

## 六、经典问题与解法

### 1. **用队列实现栈**

- **问题**：使用两个队列实现栈的 push、pop、top 操作。
- **解法**：
  - **入栈**：元素入队 Q1。
  - **出栈**：将 Q1 的前 n-1 个元素转移到 Q2，弹出 Q1 的最后一个元素，再将 Q2 的元素转回 Q1。

### 2. **广度优先搜索（BFS）**

- **问题**：遍历图或树，逐层访问节点。
- **解法**：

  ```python
  from collections import deque

  def bfs(graph, start):
      visited = set()
      queue = deque([start])
      visited.add(start)

      while queue:
          node = queue.popleft()
          print(node)  # 访问节点
          for neighbor in graph[node]:
              if neighbor not in visited:
                  visited.add(neighbor)
                  queue.append(neighbor)
  ```

## 七、队列的优缺点

| **优点**              | **缺点**               |
| --------------------- | ---------------------- |
| FIFO 特性适合特定场景 | 仅支持队头和队尾操作   |
| 操作时间复杂度 O(1)   | 顺序队列需处理溢出问题 |
| 实现简单              | 链式队列需额外指针空间 |

## 八、面试高频问题

1. **滑动窗口最大值**

   - 问题：给定数组和滑动窗口大小，求每个窗口中的最大值。
   - 解法：使用双端队列维护窗口内的递减元素（如 LeetCode 239 题）。

2. **最近请求次数**

   - 问题：计算过去 3000 毫秒内的请求次数（每次请求时间递增）。
   - 解法：使用队列存储请求时间，删除早于当前时间 3000ms 的请求（如 LeetCode 933 题）。

3. **设计循环队列**
   - 问题：实现循环队列的入队、出队等操作（如 LeetCode 622 题）。

队列是理解系统调度、图算法和消息传递的基础数据结构，其核心思想是通过 FIFO 特性控制数据的处理顺序。掌握队列的基本操作和变种实现是解决算法问题的关键。
