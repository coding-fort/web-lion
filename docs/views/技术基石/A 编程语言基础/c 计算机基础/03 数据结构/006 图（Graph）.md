# 图（Graph）

**图（Graph）** 是一种非线性数据结构，用于表示**多对多关系**，由**顶点（Vertex）** 和**边（Edge）** 组成。与树不同，图中顶点之间的连接没有层级限制，且可以存在环。图广泛应用于社交网络、路径规划、电路设计等领域。

## 一、基本概念与术语

1. **图的定义**  
   图 \( G = (V, E) \) 由顶点集 \( V \) 和边集 \( E \) 组成，其中边 \( E \) 表示顶点之间的关系。

2. **核心术语**
   - **无向图（Undirected Graph）**：边没有方向（如 A-B 等价于 B-A）。
   - **有向图（Directed Graph）**：边有方向（如 A→B 与 B→A 不同）。
   - **带权图（Weighted Graph）**：边附带数值（如距离、成本），也称为**网（Network）**。
   - **邻接（Adjacency）**：两顶点间存在边（如 A 和 B 邻接）。
   - **路径（Path）**：顶点序列，相邻顶点间有边（如 A→B→C 是一条路径）。
   - **环（Cycle）**：起点和终点相同的路径（如 A→B→A）。
   - **连通图（Connected Graph）**：任意两顶点间存在路径（无向图）。
   - **强连通图（Strongly Connected Graph）**：有向图中任意两顶点间存在双向路径。

## 二、图的存储结构

### 1. **邻接矩阵（Adjacency Matrix）**

用二维数组 `matrix[i][j]` 表示顶点 \( i \) 与 \( j \) 的关系：

- 无向图：`matrix[i][j] = matrix[j][i] = 1`（有边）或 `0`（无边）。
- 带权图：`matrix[i][j]` 存储边的权重，无边时用 `∞`（如 `float('inf')`）表示。

**优点**：查询效率高（O(1)），适合稠密图（边多）。  
**缺点**：空间复杂度 \( O(V^2) \)，稀疏图浪费空间。

### 2. **邻接表（Adjacency List）**

每个顶点对应一个链表，链表存储其邻接顶点：

- 无向图：顶点 A 的链表包含 B，则 B 的链表也包含 A。
- 有向图：顶点 A 的链表包含 B，表示 A→B。

**代码实现（Python）**：

```python
class Graph:
    def __init__(self, vertices):
        self.V = vertices  # 顶点数
        self.adj = [[] for _ in range(vertices)]  # 邻接表

    def add_edge(self, u, v):
        self.adj[u].append(v)  # 有向图：u→v
        # 无向图需添加双向边：self.adj[v].append(u)

    def print_adj_list(self):
        for i in range(self.V):
            print(f"Vertex {i}: {self.adj[i]}")
```

**优点**：空间复杂度 \( O(V + E) \)，适合稀疏图（边少）。  
**缺点**：查询两点间是否有边效率低（O(E)）。

## 三、图的遍历算法

### 1. **深度优先搜索（DFS）**

从起点出发，沿路径深入直到无法继续，再回溯。适合连通性检测、拓扑排序等。

**递归实现（Python）**：

```python
def dfs(graph, start, visited=None):
    if visited is None:
        visited = set()
    visited.add(start)
    print(start, end=' ')  # 访问节点
    for neighbor in graph[start]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)
```

### 2. **广度优先搜索（BFS）**

从起点出发，逐层访问邻接节点。适合最短路径、层次遍历等。

**队列实现（Python）**：

```python
from collections import deque

def bfs(graph, start):
    visited = set()
    queue = deque([start])
    visited.add(start)

    while queue:
        vertex = queue.popleft()
        print(vertex, end=' ')  # 访问节点
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
```

## 四、图的经典算法

### 1. **最短路径算法**

- **Dijkstra 算法**：单源最短路径（边权非负），时间复杂度 \( O((V+E) \log V) \)（用优先队列优化）。
- **Floyd-Warshall 算法**：多源最短路径，时间复杂度 \( O(V^3) \)，支持负权边（但不含负环）。

### 2. **最小生成树（MST）**

覆盖所有顶点且边权之和最小的树，用于网络设计（如电缆铺设）：

- **Prim 算法**：从任意顶点开始，每次选择连接已选集合的最小边，时间复杂度 \( O(E \log V) \)。
- **Kruskal 算法**：按边权排序，依次选择不形成环的最小边，时间复杂度 \( O(E \log E) \)。

### 3. **拓扑排序（Topological Sort）**

对有向无环图（DAG）的顶点排序，使得对每条有向边 \( (u, v) \)，\( u \) 在 \( v \) 之前：

- ** Kahn 算法**：基于入度的 BFS，时间复杂度 \( O(V + E) \)。

### 4. **强连通分量（SCC）**

有向图中任意两顶点可互相到达的最大子图，常用**Kosaraju 算法**或**Tarjan 算法**求解。

## 五、应用场景

1. **社交网络**：用户关系图（如 Facebook 的好友关系）。
2. **地图导航**：路径规划（如高德地图的最短路线）。
3. **网络爬虫**：网页链接关系（如 Google 的 PageRank 算法）。
4. **电路设计**：电路元件连接关系。
5. **任务调度**：有向无环图（DAG）表示任务依赖关系。

## 六、经典问题与解法

### 1. **判断二分图（Bipartite Graph）**

- **问题**：能否将图顶点分为两个独立集，使得每条边的两个顶点分别属于不同集合。
- **解法**：BFS 或 DFS 染色（如 LeetCode 785 题）。

### 2. **课程表（拓扑排序）**

- **问题**：给定课程依赖关系（如课程 A 必须在课程 B 前），判断是否可完成所有课程。
- **解法**：Kahn 算法检测有向图是否存在环（如 LeetCode 207 题）。

### 3. **岛屿数量（连通分量）**

- **问题**：二维网格中，计算由'1'（陆地）组成的连通区域数量。
- **解法**：DFS 或 BFS 遍历（如 LeetCode 200 题）。

## 七、图的优缺点

| **优点**         | **缺点**                               |
| ---------------- | -------------------------------------- |
| 灵活表示复杂关系 | 存储和算法复杂度高                     |
| 支持多种经典算法 | 某些问题（如哈密尔顿路径）是 NP 难问题 |
| 应用场景广泛     | 稠密图占用大量内存                     |

## 八、面试高频考点

- 图的 DFS/BFS 实现及变种（如路径打印、最短路径）。
- 拓扑排序的应用（如任务调度、课程表）。
- 最短路径算法（Dijkstra、Floyd）的原理与实现。
- 图的连通性问题（如岛屿数量、并查集应用）。

图是处理复杂关系的强大工具，其核心在于通过邻接矩阵或邻接表存储结构，结合 DFS/BFS 遍历算法，解决路径规划、连通性检测等问题。掌握图的经典算法对解决实际问题和面试至关重要。
