# 树（Tree）

**树（Tree）** 是一种**非线性数据结构**，由**节点（Node）** 和**边（Edge）** 组成，用于表示层级关系（如文件系统、组织结构）。与线性结构（数组、链表）不同，树中节点之间通过“父子关系”连接，且**不存在环**。

## 一、基本概念与术语

1. **树的定义**  
   树是由 n（n≥0）个节点组成的有限集合：

   - 当 n=0 时，称为**空树**。
   - 当 n>0 时，有且仅有一个**根节点（Root）**，其余节点可分为若干个互不相交的子树（Subtree），每个子树也是一棵树。

2. **核心术语**
   - **父节点（Parent）**：拥有子节点的节点（如 A 是 B、C 的父节点）。
   - **子节点（Child）**：被父节点直接连接的节点（如 B、C 是 A 的子节点）。
   - **叶子节点（Leaf）**：没有子节点的节点（如 D、E、F）。
   - **兄弟节点（Sibling）**：同一父节点的子节点（如 B 和 C 是兄弟）。
   - **深度（Depth）**：从根节点到当前节点的**边数**（根节点深度为 0）。
   - **高度（Height）**：从当前节点到最深叶子节点的**边数**（叶子节点高度为 0）。
   - **节点的度（Degree）**：节点拥有的子节点数量（叶子节点度为 0）。
   - **树的度**：所有节点中度的最大值。

## 二、树的性质

1. 树中**n 个节点有且仅有 n-1 条边**（无环且连通）。
2. 任意两个节点之间有且仅有**一条路径**。
3. 若根节点深度为 0，则深度为 k 的节点最多有\(2^k\)个（满二叉树情况）。

## 三、常见树类型

### 1. 二叉树（Binary Tree）

每个节点最多有**2 个子节点**（左子节点、右子节点），是最常用的树结构。

**特殊二叉树**：

- **满二叉树**：除叶子节点外，每个节点都有 2 个子节点，且所有叶子节点在同一层（如深度为 2 的树有 7 个节点）。
- **完全二叉树**：叶子节点仅存在于最后两层，且最后一层的节点从左到右连续排列（如堆的结构）。
- **二叉搜索树（BST）**：左子树所有节点值 < 根节点值 < 右子树所有节点值（支持高效查找、插入、删除）。
- **平衡二叉树（如 AVL 树）**：左右子树高度差不超过 1（避免 BST 退化为链表，保持 O(log n)效率）。
- **红黑树**：通过颜色规则（红/黑）维持平衡，插入/删除效率高于 AVL 树（如 C++ `map`、Java `TreeMap`的底层实现）。

### 2. 多叉树（N-ary Tree）

每个节点可以有**多个子节点**（n≥2），常见于层级结构场景：

- **Trie 树（字典树）**：用于字符串前缀匹配（如搜索引擎自动补全）。
- **B 树/B+树**：多路平衡查找树，用于数据库索引（减少磁盘 IO）。
- **堆（Heap）**：完全二叉树的变种，分为大根堆（父节点 ≥ 子节点）和小根堆（父节点 ≤ 子节点），用于优先队列。

## 四、树的遍历（以二叉树为例）

遍历是按一定规则访问树中所有节点的过程，核心有**深度优先遍历（DFS）** 和**广度优先遍历（BFS）**。

### 1. 深度优先遍历（DFS）

沿着树的深度优先访问节点，分为 3 种顺序（以根节点访问时机区分）：

| 遍历方式 | 顺序                 | 示例（树：根 A，左 B，右 C；B 的左 D，右 E；C 的右 F） |
| -------- | -------------------- | ------------------------------------------------------ |
| 前序遍历 | 根 → 左子树 → 右子树 | A → B → D → E → C → F                                  |
| 中序遍历 | 左子树 → 根 → 右子树 | D → B → E → A → C → F                                  |
| 后序遍历 | 左子树 → 右子树 → 根 | D → E → B → F → C → A                                  |

**代码实现（Python）**：

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# 前序遍历（递归）
def preorder_recursive(root, result):
    if root:
        result.append(root.val)
        preorder_recursive(root.left, result)
        preorder_recursive(root.right, result)

# 中序遍历（迭代，用栈模拟）
def inorder_iterative(root):
    result = []
    stack = []
    current = root
    while current or stack:
        # 左子树入栈
        while current:
            stack.append(current)
            current = current.left
        # 访问根节点
        current = stack.pop()
        result.append(current.val)
        # 转向右子树
        current = current.right
    return result

# 后序遍历（递归）
def postorder_recursive(root, result):
    if root:
        postorder_recursive(root.left, result)
        postorder_recursive(root.right, result)
        result.append(root.val)
```

### 2. 广度优先遍历（BFS，层序遍历）

按**层级顺序**访问节点（从根到叶子，同一层从左到右），通常用**队列**实现。

**示例**：上述树的层序遍历为 `A → B → C → D → E → F`。

**代码实现（Python）**：

```python
from collections import deque

def level_order(root):
    if not root:
        return []
    result = []
    queue = deque([root])
    while queue:
        level_size = len(queue)  # 当前层节点数
        level = []
        for _ in range(level_size):
            node = queue.popleft()
            level.append(node.val)
            # 子节点入队
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(level)  # 按层存储
    return result  # 输出：[[A], [B,C], [D,E,F]]
```

## 五、重要操作与应用

### 1. 二叉搜索树（BST）的核心操作

BST 的左子树值 < 根值 < 右子树值，支持高效操作（平均 O(log n)，最坏 O(n)，需平衡树优化）：

- **插入**：从根开始，小于根则向左，大于根则向右，直到空位置。
- **查找**：类似插入，比较值后向左/右子树递归查找。
- **删除**：分 3 种情况（叶子节点直接删；单子节点则替换；双子节点则用前驱/后继节点替换）。

### 2. 树的深度与高度计算

```python
# 计算树的高度（递归）
def tree_height(root):
    if not root:
        return -1  # 空树高度为-1（叶子节点高度为0）
    left_height = tree_height(root.left)
    right_height = tree_height(root.right)
    return max(left_height, right_height) + 1
```

### 3. 应用场景

- **文件系统**：文件夹与文件的层级结构（如 Windows 资源管理器）。
- **数据库索引**：B+树用于加速查询（如 MySQL 的 InnoDB 引擎）。
- **优先队列**：堆（完全二叉树）实现，用于任务调度（如操作系统的进程优先级）。
- **字符串处理**：Trie 树用于前缀匹配（如手机输入法联想、路由表最长前缀匹配）。
- **机器学习**：决策树用于分类/回归（如 ID3、C4.5 算法）。
- **语法解析**：编译原理中的抽象语法树（AST）表示代码结构。

## 六、经典问题与解法

1. **二叉树的最近公共祖先（LCA）**

   - 问题：找到两个节点的最深公共父节点（如 LeetCode 236 题）。
   - 解法：递归查找，若当前节点是 p 或 q 则返回；否则在左右子树中查找，若两边都找到则当前节点为 LCA。

2. **路径总和**

   - 问题：判断是否存在从根到叶子的路径，其节点和等于目标值（如 LeetCode 112 题）。
   - 解法：递归减目标值，叶子节点时判断是否为 0。

3. **二叉树的序列化与反序列化**
   - 问题：将树转为字符串（序列化），再恢复为树（反序列化）（如 LeetCode 297 题）。
   - 解法：用前序/层序遍历记录节点，空节点用特殊符号（如`null`）表示。

## 七、树的优缺点

| **优点**                       | **缺点**                          |
| ------------------------------ | --------------------------------- |
| 层级关系清晰，适合表示层次结构 | 非线性结构，遍历/操作较复杂       |
| BST/平衡树支持高效查找         | 普通树删除节点需维护父子关系      |
| 堆支持 O(1)获取最值            | 不平衡时性能退化（如 BST 成链表） |

## 八、面试高频考点

- 二叉树的 3 种 DFS 遍历（递归+迭代实现）。
- 层序遍历（按层输出、之字形打印等变种）。
- 平衡二叉树的判断（左右子树高度差 ≤1）。
- BST 的验证（中序遍历是否递增）。
- 树与链表的转换（如将二叉搜索树转为有序双向链表）。

树是连接线性结构与复杂结构的桥梁，其层级特性使其在表示关系型数据时不可或缺。掌握树的遍历、BST 操作及变种（堆、Trie、B 树）是解决高级算法问题的基础。
