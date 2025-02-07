# 图解双端 diff

> 面试题：说一下 Vue3 中的 diff 相较于 Vue2 有什么变化？

- Vue2: 双端 diff
- Vue3: 快速 diff

**1. diff 的概念**

diff 算法是用于比较两棵虚拟 DOM 树的算法，目的是找到它们之间的差异，并根据这些差异高效地更新真实 DOM，从而保证页面在数据变化时只进行**最小程度**的 DOM 操作。

思考 🤔：为什么需要进行 diff，不是已经有响应式了么？

答案：响应式虽然能够侦测到响应式数据的变化，但是只能定位到组件，代表着某一个组件要重新渲染。组件的重新渲染就是重新执行对应的渲染函数，此时就会生成新的虚拟 DOM 树。但是此时我们并不知道新树和旧树具体哪一个节点有区别，这个时候就需要 diff 算法来找到两棵树的区别。

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-09-06-013616.png" alt="20210301193804" style="zoom: 60%;" />

**2. diff 算法的特点**

1. 分层对比：它会逐层对比每个节点和它的子节点，避免全树对比，从而提高效率。
2. 相同层级节点对比：在进行 diff 对比的时候，Vue 会假设对比的节点是同层级的，也就是说，不会做跨层的比较。

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-09-06-013054.png" alt="20210301203350" style="zoom:65%;" />

**3. diff 算法详细流程**

1. 从根节点开始比较，看是否**相同**。所谓相同，是指两个虚拟节点的**标签类型**、**key 值**均相同，但 **input 元素还要看 type 属性**

   1. 相同
      - 相同就说明能够复用，此时就会将旧虚拟 DOM 节点对应的真实 DOM 赋值给新虚拟 DOM 节点
      - 对比新节点和旧节点的属性，如果属性有变化更新到真实 DOM. 这说明了即便是对 DOM 进行复用，也不是完全不处理，还是会有一些针对属性变化的处理
      - 进入【对比子节点】
   2. 不相同
      - 如果不同，该节点以及往下的子节点没有意义了，全部卸载
        - 直接根据新虚拟 DOM 节点递归创建真实 DOM，同时挂载到新虚拟 DOM 节点
        - 销毁旧虚拟 DOM 对应的真实 DOM，背后调用的是 vnode.elm.remove( ) 方法

2. 对比子节点：

   1. 仍然是同层做对比
   2. 深度优先
   3. 同层比较时采用的是双端对比

   <img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-09-06-021144.png" alt="image-20240906101143754" style="zoom:70%;" />

**4. 双端对比**

之所以被称之为双端，是因为有**两个**指针，一个指向头节点，另一个指向尾节点，如下所示：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-09-13-145148.png" alt="image-20240913225147579" style="zoom:50%;" />

无论是旧的虚拟 DOM 列表，还是新的虚拟 DOM 列表，都是一头一尾两个指针。

接下来进入比较环节，整体的流程为：

1. 步骤一：新头和旧头比较

   - 相同：

     - 复用 DOM 节点

       <img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-09-14-021542.png" alt="image-20240914101542039" style="zoom:50%;" />

     - 新旧头索引自增

       <img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-09-14-021629.png" alt="image-20240914101629244" style="zoom:50%;" />

     - 重新开始步骤一

   - 不相同：进入步骤二

2. 步骤二：新尾和旧尾比较

   - 相同：

     - 复用 DOM 节点

       <img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-09-14-021834.png" alt="image-20240914101834010" style="zoom:50%;" />

     - 新旧尾索引自减

       <img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-09-14-021914.png" alt="image-20240914101913347" style="zoom:50%;" />

     - 重新开始步骤一

   - 不相同，进入步骤三

3. 步骤三：旧头和新尾比较

   - 相同：

     - 说明可以复用，并且说明节点从头部移动到了尾部，涉及到移动操作，需要将旧头对应的 DOM 节点移动到旧尾对应的 DOM 节点之后

       <img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-09-14-021232.png" alt="image-20240914101231300" style="zoom:50%;" />

     - 旧头索引自增，新尾索引自减

       <img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-09-14-021401.png" alt="image-20240914101400686" style="zoom:50%;" />

     - 重新开始步骤一

   - 不相同，进入步骤四

4. 步骤四：新头和旧尾比较

   - 相同：

     - 说明可以复用，并且说明节点从尾部移动到了头部，仍然涉及到移动操作，需要将旧尾对应的 DOM 元素移动到旧头对应的 DOM 节点之前

       <img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-09-14-025559.png" alt="image-20240914105559210" style="zoom:50%;" />

     - 新头索引自增，旧尾索引自减

       <img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-09-14-025649.png" alt="image-20240914105649208" style="zoom:50%;" />

     - 重新开始步骤一

   - 不相同：进入步骤五

5. 暴力比较：上面 4 个步骤都没找到相同的，则采取暴力比较。在旧节点列表中寻找是否有和新节点相同的节点，

   - 找到

     - 说明是一个需要移动的节点，将其对应的 DOM 节点移动到旧头对应的 DOM 节点之前

       <img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-09-14-030013.png" alt="image-20240914110012627" style="zoom:50%;" />

     - 新头索引自增

       <img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-09-14-030048.png" alt="image-20240914110048026" style="zoom:50%;" />

     - 回到步骤一

   - 没找到

     - 说明是一个新的节点，创建新的 DOM 节点，插入到旧头对应的 DOM 节点之前

       <img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-09-14-030333.png" alt="image-20240914110332605" style="zoom:50%;" />

     - 新头索引自增

       <img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-09-14-030401.png" alt="image-20240914110401233" style="zoom:50%;" />

     - 回到步骤一

新旧节点列表任意一个遍历结束，也就是 oldStart > OldEnd 或者 newStart > newEnd 的时候，diff 比较结束。

- 旧节点列表有剩余（newStart > newEnd）：对应的旧 DOM 节点全部删除掉
- 新节点列表有剩余（oldStart > OldEnd）：将新节点列表中剩余的节点创建对应的 DOM，放置于新头节点对应的 DOM 节点后面

**综合示例**

当前旧 Vnode 和新 VNode 如下图所示：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-09-14-031038.png" alt="image-20240914111038061" style="zoom:50%;" />

1. 头头对比，能够复用，新旧头指针右移

   <img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-09-14-031750.png" alt="image-20240914111750328" style="zoom:50%;" />

2. 头头不同，尾尾相同，能够复用，尾尾指针左移

   <img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-09-14-031936.png" alt="image-20240914111936261" style="zoom:50%;" />

3. 头头不同，尾尾不同，旧头新尾相同，旧头对应的真实 DOM 移动到旧尾对应的真实 DOM 之后，旧头索引自增，新尾索引自减

   <img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-09-14-032233.png" alt="image-20240914112233100" style="zoom:50%;" />

4. 头头不同，尾尾不同，旧头新尾不同，新头旧尾相同，旧尾对应的真实 DOM 移动到旧头对应的真实 DOM 之前，新头索引自增，旧尾索引自减

   <img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-09-14-032710.png" alt="image-20240914112710405" style="zoom:50%;" />

5. 头头不同，尾尾不同，旧头新尾不同，新头旧尾不同，进入暴力对比，找到对应节点，将对应的真实 DOM 移动到旧头对应的真实 DOM 之间，新头索引自增

   <img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-09-14-033001.png" alt="image-20240914113000896" style="zoom:50%;" />

6. 头头不同，尾尾不同，旧头新尾不同，新头旧尾相同，将旧尾对应的真实 DOM 移动到旧头对应的真实 DOM 之前，新头索引自增，旧尾索引自减

   <img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-09-14-033248.png" alt="image-20240914113247844" style="zoom:50%;" />

7. 头头不同，尾尾不同，旧头新尾不同，新头旧尾不同，暴力对比发现也没找到，说明是一个全新的节点，创建新的 DOM 节点，插入到旧头对应的 DOM 节点之前，新头索引自增

   <img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-09-14-033445.png" alt="image-20240914113444878" style="zoom:50%;" />

8. newEnd > newStart，diff 比对结束，旧 VNode 列表还有剩余，直接删除即可。

   <img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-09-14-033722.png" alt="image-20240914113721337" style="zoom:50%;" />
