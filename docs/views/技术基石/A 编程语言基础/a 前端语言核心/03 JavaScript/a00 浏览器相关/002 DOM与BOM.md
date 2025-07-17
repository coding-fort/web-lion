# 从零开始学 JavaScript 浏览器 Web API：从 DOM 到 BOM 全攻略

## 一、Web API 概述

### 1.1 Web API 的概念与组成

Web API（应用程序编程接口）是浏览器提供的工具集，让 JavaScript 能与浏览器和网页交互。简单说，它是浏览器给 JavaScript 的“遥控器”，可操作网页元素、控制浏览器行为，实现动态效果和交互功能。

Web API 主要由两部分组成：

- **DOM（Document Object Model，文档对象模型）**：用于操作网页内容和结构的 API。
- **BOM（Browser Object Model，浏览器对象模型）**：用于操作浏览器本身功能的 API。

### 1.2 为什么要学习 Web API

对前端开发者（尤其是希望成长为架构师的人）来说，学习 Web API 至关重要：

- 实现网页动态效果（如点击交互、轮播图、表单验证）。
- 控制浏览器行为（如页面跳转、定时器、存储数据）。
- 构建现代化 Web 应用（复杂交互依赖 DOM/BOM 操作）。
- 理解框架底层原理（React、Vue 等框架本质是对 Web API 的封装）。

### 1.3 学习路径与方法

针对从专业开发到前端架构的目标，建议按以下路径学习：

- **基础阶段（1-2 个月）**：

  - 掌握 DOM 基本操作（获取元素、修改内容/样式）。
  - 学习事件处理基础（点击、鼠标事件等）。
  - 了解 BOM 基础（窗口操作、定时器、location 对象）。

- **进阶阶段（2-3 个月）**：

  - 深入 DOM 高级操作（节点操作、事件委托、虚拟滚动）。
  - 掌握 BOM 高级应用（浏览器存储、历史管理、跨窗口通信）。
  - 学习高级 Web API（Fetch、Canvas、Web Workers 等）。

- **专家阶段（3-6 个月）**：
  - 理解浏览器渲染机制与性能优化（减少回流/重绘）。
  - 掌握跨浏览器兼容性处理策略。
  - 学习 Service Workers 和 PWA（渐进式 Web 应用）。
  - 构建自己的 UI 组件库或工具库。

## 二、DOM 操作基础

### 2.1 DOM 树与元素获取

#### 2.1.1 DOM 树结构

DOM 将 HTML 文档转换为树形结构，体现标签间的关系：

- **文档（Document）**：整个 HTML 页面的根节点。
- **元素（Element）**：HTML 标签（如 `<div>`、`<p>`）。
- **节点（Node）**：网页中所有内容（标签、属性、文本、注释等）。

DOM 的核心思想是将网页内容视为“对象”，通过操作这些对象改变网页的内容、结构和样式。

#### 2.1.2 获取页面元素

操作 DOM 前需先获取元素，最常用的方法是 `querySelector` 和 `querySelectorAll`：

```javascript
// 获取单个元素（返回第一个匹配的元素）
const element = document.querySelector("css选择器");

// 获取多个元素（返回 NodeList 集合）
const elements = document.querySelectorAll("css选择器");
```

**示例**：

```html
<div class="box">这是一个div</div>
<button id="btn">点击我</button>

<script>
  // 通过类选择器获取 div
  const div = document.querySelector(".box");

  // 通过 ID 选择器获取按钮（也可用 document.getElementById('btn')）
  const button = document.querySelector("#btn");

  // 获取所有 p 元素
  const paragraphs = document.querySelectorAll("p");
</script>
```

其他获取元素的方法：

- `document.getElementsByTagName('标签名')`：按标签名获取集合（如 `document.getElementsByTagName('div')`）。
- `document.getElementsByClassName('类名')`：按类名获取集合。
- `document.body`：直接获取 `<body>` 元素。
- `document.documentElement`：直接获取 `<html>` 元素。

### 2.2 操作元素内容与属性

#### 2.2.1 修改元素内容

通过以下属性修改元素内容：

- `innerHTML`：获取/设置元素的 HTML 内容（会解析标签）。
- `innerText`：获取/设置元素的纯文本内容（不解析标签，保留空格和换行）。

**示例**：

```html
<div id="content">初始内容</div>

<script>
  const div = document.getElementById("content");

  // 使用 innerHTML 插入带标签的内容
  div.innerHTML = "<strong>新内容</strong> <em>加粗和斜体</em>";

  // 使用 innerText 插入纯文本
  div.innerText = "这是纯文本内容";
</script>
```

#### 2.2.2 操作元素属性

直接通过元素对象访问和修改属性：

**示例（普通元素）**：

```html
<img id="myImg" src="image1.jpg" alt="图片描述" title="图片标题" />

<script>
  const img = document.getElementById("myImg");

  // 获取属性值
  console.log(img.src); // 输出图片地址
  console.log(img.alt); // 输出替代文本

  // 修改属性值
  img.src = "image2.jpg"; // 切换图片
  img.alt = "新的替代文本";
</script>
```

**示例（表单元素）**：  
表单元素（input、select 等）有特殊属性：

```html
<input type="text" id="username" value="默认值" />
<button id="btn">修改值</button>

<script>
  const input = document.getElementById("username");
  const button = document.getElementById("btn");

  button.onclick = function () {
    console.log(input.value); // 获取输入值
    input.value = "新值"; // 设置输入值
    input.type = input.type === "text" ? "password" : "text"; // 切换输入类型（文本/密码）
  };
</script>
```

### 2.3 操作元素样式

#### 2.3.1 直接操作行内样式

通过 `style` 属性修改元素的行内样式（CSS 属性需用驼峰命名法）：

```javascript
// 修改宽度、高度和背景色
element.style.width = "200px";
element.style.height = "200px";
element.style.backgroundColor = "red"; // 对应 CSS 的 background-color
```

**示例**：点击 div 放大字体

```html
<div id="text" style="font-size: 20px;">点击我放大字体</div>

<script>
  const div = document.getElementById("text");

  div.onclick = function () {
    // 获取当前字体大小（去掉单位并转为数字）
    let fontSize = parseInt(div.style.fontSize);
    fontSize += 10; // 增加 10px
    div.style.fontSize = fontSize + "px"; // 设置新大小
  };
</script>
```

**注意**：

- 行内样式仅影响当前元素的行内 CSS（不影响样式表中的类）。
- 数值必须带单位（如 `px`、`%`）。

#### 2.3.2 通过类名操作样式

更推荐通过修改类名改变样式，实现结构与样式分离：

**示例**：切换夜间模式

```html
<style>
  .light-mode {
    background: white;
    color: black;
  }
  .dark-mode {
    background: black;
    color: white;
  }
</style>

<div id="container" class="light-mode">这是内容区域</div>
<button id="toggleBtn">切换模式</button>

<script>
  const container = document.getElementById("container");
  const button = document.getElementById("toggleBtn");

  button.onclick = function () {
    // 方法1：直接修改 className（可能覆盖原有类）
    // container.className = container.className === 'light-mode' ? 'dark-mode' : 'light-mode';

    // 方法2：使用 classList（推荐，更灵活）
    container.classList.toggle("dark-mode"); // 切换类（存在则删除，不存在则添加）
  };
</script>
```

`classList` 的常用方法：

- `add('className')`：添加类。
- `remove('className')`：删除类。
- `toggle('className')`：切换类。
- `contains('className')`：判断是否包含类。

### 2.4 事件处理基础

#### 2.4.1 事件三要素

事件处理是 Web 交互的核心，由三部分组成：

- **事件源**：触发事件的元素（如按钮、div）。
- **事件类型**：事件的类别（如点击、鼠标移动）。
- **事件处理程序**：事件触发时执行的函数。

#### 2.4.2 绑定事件处理程序

有三种绑定方式，推荐 `addEventListener`：

1. **HTML 属性方式（不推荐）**：

```html
<button onclick="handleClick()">点击我</button>
<script>
  function handleClick() {
    alert("按钮被点击了");
  }
</script>
```

2. **DOM 属性方式**：

```html
<button id="btn">点击我</button>
<script>
  const button = document.getElementById("btn");
  button.onclick = function () {
    alert("按钮被点击了");
  };
  // 解绑：button.onclick = null;
</script>
```

3. **`addEventListener` 方式（推荐）**：  
   支持绑定多个事件处理程序，功能更灵活：

```html
<button id="btn">点击我</button>
<script>
  const button = document.getElementById("btn");

  // 添加第一个事件处理程序
  button.addEventListener("click", function () {
    alert("按钮被点击了");
  });

  // 添加第二个事件处理程序
  button.addEventListener("click", function () {
    console.log("另一个点击事件");
  });

  // 移除事件处理程序（需用命名函数）
  function handleClick() {
    console.log("将被移除的事件");
  }
  button.addEventListener("click", handleClick);
  button.removeEventListener("click", handleClick); // 移除
</script>
```

#### 2.4.3 常见事件类型

- **鼠标事件**：  
  `click`（点击）、`dblclick`（双击）、`mouseover`（移入，冒泡）、`mouseout`（移出，冒泡）、`mouseenter`（进入，不冒泡）、`mouseleave`（离开，不冒泡）、`mousemove`（移动）。

- **键盘事件**：  
  `keydown`（按下）、`keyup`（释放）。

- **表单事件**：  
  `submit`（提交）、`change`（值改变，如 select）、`input`（输入框实时改变）。

- **窗口事件**：  
  `load`（页面加载完成）、`resize`（窗口大小改变）、`scroll`（页面滚动）。

### 2.5 事件对象与事件流

#### 2.5.1 事件对象

事件触发时会生成“事件对象”，包含事件相关信息（通过事件处理程序的参数获取）：

```javascript
element.addEventListener("click", function (event) {
  console.log(event.type); // 事件类型（如 'click'）
  console.log(event.target); // 触发事件的元素（事件源）
  console.log(event.clientX, event.clientY); // 鼠标相对于窗口的坐标
});
```

常用方法：

- `preventDefault()`：阻止事件的默认行为（如链接跳转、表单提交）。
- `stopPropagation()`：阻止事件冒泡。

**示例**：阻止链接跳转

```html
<a href="https://www.example.com" id="link">点击我</a>
<script>
  const link = document.getElementById("link");
  link.addEventListener("click", function (event) {
    event.preventDefault(); // 阻止默认跳转
    console.log("链接被点击，但未跳转");
  });
</script>
```

#### 2.5.2 事件流

事件流描述事件从触发到处理的过程，分三个阶段：

1. **捕获阶段**：事件从最外层祖先向内传播到目标元素。
2. **目标阶段**：事件到达目标元素。
3. **冒泡阶段**：事件从目标元素向外传播回祖先元素（默认触发事件处理程序的阶段）。

**示例**：事件冒泡

```html
<div id="outer" style="padding: 20px; background: lightgray;">
  外层 div
  <div id="inner" style="padding: 20px; background: lightblue;">
    内层 div（点击我）
  </div>
</div>

<script>
  const outer = document.getElementById("outer");
  const inner = document.getElementById("inner");

  outer.addEventListener("click", () => console.log("外层 div 被点击（冒泡）"));
  inner.addEventListener("click", () => console.log("内层 div 被点击（冒泡）"));
</script>
```

点击“内层 div”时，会先触发内层的事件，再触发外层的事件（冒泡）。若要阻止冒泡，可在事件处理程序中调用 `event.stopPropagation()`。

## 三、DOM 操作进阶

### 3.1 节点操作

#### 3.1.1 创建和插入节点

动态创建节点并插入 DOM 树：

```javascript
// 创建元素节点
const newDiv = document.createElement("div");
newDiv.textContent = "新创建的 div";
newDiv.className = "new-class";

// 插入节点（添加到父元素的末尾）
parent.appendChild(newDiv);

// 插入到指定元素之前
parent.insertBefore(newDiv, referenceElement);
```

**示例**：动态添加列表项

```html
<ul id="list">
  <li>项目1</li>
</ul>
<button id="addBtn">添加项目</button>

<script>
  const list = document.getElementById("list");
  const addBtn = document.getElementById("addBtn");

  addBtn.addEventListener("click", function () {
    const newLi = document.createElement("li");
    newLi.textContent = `新项目 ${Date.now()}`; // 用时间戳保证唯一
    list.appendChild(newLi); // 添加到列表末尾
  });
</script>
```

#### 3.1.2 删除和替换节点

```javascript
// 删除节点（通过父元素删除）
parent.removeChild(child);

// 直接删除自身
child.remove();

// 替换节点
parent.replaceChild(newElement, oldElement);
```

**示例**：删除最后一个列表项

```html
<ul id="list">
  <li>项目1</li>
  <li>项目2</li>
</ul>
<button id="removeBtn">删除最后一项</button>

<script>
  const list = document.getElementById("list");
  const removeBtn = document.getElementById("removeBtn");

  removeBtn.addEventListener("click", function () {
    const lastItem = list.lastElementChild; // 获取最后一个子元素
    if (lastItem) lastItem.remove(); // 存在则删除
  });
</script>
```

### 3.2 事件委托与高级事件处理

#### 3.2.1 事件委托

利用事件冒泡机制，将事件监听器绑定在**父元素**上，而非每个子元素，适用于动态生成的元素：

**优点**：

- 减少内存占用（只需一个监听器）。
- 动态添加的子元素自动拥有事件处理能力。

**示例**：处理列表项点击（动态添加的项也有效）

```html
<ul id="list">
  <li data-id="1">项目1</li>
  <li data-id="2">项目2</li>
</ul>
<button id="addBtn">添加项目</button>

<script>
  const list = document.getElementById("list");
  const addBtn = document.getElementById("addBtn");

  // 事件委托：父元素 list 监听点击
  list.addEventListener("click", function (event) {
    // 判断点击的是 li 元素
    if (event.target.tagName === "LI") {
      const id = event.target.dataset.id; // 获取 data-id 属性
      console.log(`点击了项目 ${id}`);
    }
  });

  // 动态添加项目（无需再绑定事件，事件委托已处理）
  addBtn.addEventListener("click", function () {
    const newLi = document.createElement("li");
    newLi.textContent = `新项目 ${Date.now()}`;
    newLi.dataset.id = Date.now();
    list.appendChild(newLi);
  });
</script>
```

#### 3.2.2 自定义事件

除内置事件外，可创建“自定义事件”实现组件间通信：

```javascript
// 创建自定义事件（可携带数据）
const event = new CustomEvent("customEvent", {
  detail: { message: "自定义事件的数据" },
});

// 触发事件
element.dispatchEvent(event);

// 监听自定义事件
element.addEventListener("customEvent", function (event) {
  console.log(event.detail.message); // 输出：自定义事件的数据
});
```

**示例**：子组件向父组件传值

```html
<div id="parent">
  <div id="child">点击我触发事件</div>
</div>

<script>
  const child = document.getElementById("child");
  const parent = document.getElementById("parent");

  // 子组件：点击时触发自定义事件
  child.addEventListener("click", function () {
    const event = new CustomEvent("childClicked", {
      detail: { info: "子组件被点击了" },
    });
    child.dispatchEvent(event);
  });

  // 父组件：监听自定义事件
  parent.addEventListener("childClicked", function (event) {
    console.log(event.detail.info); // 输出：子组件被点击了
  });
</script>
```

### 3.3 表单处理与验证

#### 3.3.1 获取表单数据

- **输入框/文本域**：通过 `value` 属性获取值。
- **单选框/复选框**：通过 `checked` 属性判断是否选中。
- **下拉框**：通过 `value` 获取选中值，或 `selectedIndex` 获取索引。

**示例**：获取表单数据

```html
<form id="myForm">
  <input type="text" name="username" id="username" />
  <input type="radio" name="gender" value="male" id="male" />男
  <input type="checkbox" name="hobby" value="reading" id="reading" />阅读
  <select id="city">
    <option value="beijing">北京</option>
    <option value="shanghai">上海</option>
  </select>
  <button type="submit">提交</button>
</form>

<script>
  const form = document.getElementById("myForm");
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // 阻止表单默认提交

    // 获取输入框值
    const username = document.getElementById("username").value;

    // 获取单选框状态
    const isMale = document.getElementById("male").checked;

    // 获取复选框状态
    const likeReading = document.getElementById("reading").checked;

    // 获取下拉框值
    const city = document.getElementById("city").value;

    console.log({ username, isMale, likeReading, city });
  });
</script>
```

#### 3.3.2 表单验证

确保用户输入合法，可结合 HTML5 内置属性和自定义逻辑：

**示例**：基本表单验证

```html
<form id="form">
  <input
    type="text"
    id="username"
    required
    minlength="3"
    placeholder="用户名（至少3位）"
  />
  <input type="email" id="email" required placeholder="邮箱" />
  <button type="submit">提交</button>
</form>

<script>
  const form = document.getElementById("form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username");
    const email = document.getElementById("email");
    let isValid = true;

    // 自定义验证：用户名不能包含数字
    if (/[0-9]/.test(username.value)) {
      alert("用户名不能包含数字");
      isValid = false;
    }

    // 验证通过则提交
    if (isValid) {
      alert("验证通过，准备提交");
      // form.submit(); // 实际提交
    }
  });
</script>
```

HTML5 验证属性：

- `required`：必填项。
- `minlength`/`maxlength`：最小/最大长度。
- `type="email"`：验证邮箱格式。
- `pattern`：正则表达式验证（如 `pattern="[0-9]{6}"` 验证 6 位数字）。

### 3.4 高级 DOM 操作技巧

#### 3.4.1 元素尺寸与位置

获取元素的尺寸和位置是实现拖拽、滚动等功能的基础：

- **尺寸属性**：

  - `clientWidth`/`clientHeight`：可见宽高（含内边距，不含边框/滚动条）。
  - `offsetWidth`/`offsetHeight`：总宽高（含内边距、边框、滚动条）。

- **位置属性**：
  - `offsetLeft`/`offsetTop`：相对于定位父元素的偏移量。
  - `getBoundingClientRect()`：返回元素相对于视口的位置（含 `top`、`left`、`width`、`height`）。

**示例**：实现元素拖拽

```html
<div
  id="box"
  style="width: 100px; height: 100px; background: red; position: absolute;"
></div>

<script>
  const box = document.getElementById("box");
  let isDragging = false;
  let startX, startY, initialX, initialY;

  // 鼠标按下：记录初始位置
  box.addEventListener("mousedown", function (event) {
    isDragging = true;
    startX = event.clientX;
    startY = event.clientY;
    initialX = box.offsetLeft; // 元素当前左偏移
    initialY = box.offsetTop; // 元素当前上偏移
  });

  // 鼠标移动：更新位置
  document.addEventListener("mousemove", function (event) {
    if (!isDragging) return;
    const deltaX = event.clientX - startX; // 水平移动距离
    const deltaY = event.clientY - startY; // 垂直移动距离
    box.style.left = initialX + deltaX + "px";
    box.style.top = initialY + deltaY + "px";
  });

  // 鼠标释放：结束拖拽
  document.addEventListener("mouseup", function () {
    isDragging = false;
  });
</script>
```

#### 3.4.2 性能优化：虚拟滚动

当列表数据量大（如 10000 条）时，直接渲染所有项会卡顿。**虚拟滚动**只渲染“可见区域”的项，大幅提升性能：

**原理**：

- 计算可见区域的起始和结束索引。
- 只渲染可见区域内的项，并动态调整容器高度模拟滚动条。

**示例**：简单虚拟滚动

```html
<div
  id="container"
  style="height: 400px; overflow-y: auto; border: 1px solid #ccc;"
>
  <div id="virtualList"></div>
</div>

<script>
  const container = document.getElementById("container");
  const virtualList = document.getElementById("virtualList");
  const itemHeight = 50; // 每项高度
  const totalItems = 1000; // 总项数

  // 渲染可见项
  function renderVisibleItems() {
    const scrollTop = container.scrollTop; // 滚动距离
    const startIndex = Math.floor(scrollTop / itemHeight); // 可见起始索引
    const endIndex = Math.ceil(
      (scrollTop + container.clientHeight) / itemHeight
    ); // 可见结束索引

    virtualList.innerHTML = ""; // 清空当前内容

    // 渲染可见项
    for (let i = startIndex; i < endIndex && i < totalItems; i++) {
      const item = document.createElement("div");
      item.textContent = `项目 ${i + 1}`;
      item.style.height = `${itemHeight}px`;
      item.style.borderBottom = "1px solid #eee";
      virtualList.appendChild(item);
    }

    // 设置虚拟列表总高度（模拟滚动条长度）
    virtualList.style.height = `${totalItems * itemHeight}px`;
  }

  // 滚动时重新渲染
  container.addEventListener("scroll", renderVisibleItems);

  // 初始化
  renderVisibleItems();
</script>
```

#### 3.4.3 使用 `requestAnimationFrame`

`requestAnimationFrame` 是浏览器提供的动画 API，确保动画在浏览器重绘前执行，提升流畅度（避免卡顿）：

```javascript
function animate() {
  // 动画逻辑（如修改元素位置）
  element.style.left = `${x}px`;
  x++;

  // 请求下一帧动画
  if (x < 500) requestAnimationFrame(animate);
}

// 开始动画
requestAnimationFrame(animate);
```

**示例**：平滑移动元素

```html
<div
  id="box"
  style="width: 50px; height: 50px; background: red; position: absolute;"
></div>

<script>
  const box = document.getElementById("box");
  let x = 0;

  function animate() {
    x += 2; // 每次移动 2px
    box.style.left = `${x}px`;

    // 移动到 500px 停止
    if (x < 500) {
      requestAnimationFrame(animate);
    }
  }

  // 开始动画
  requestAnimationFrame(animate);
</script>
```

## 四、BOM 操作详解

### 4.1 窗口与定时器

#### 4.1.1 窗口对象（`window`）

`window` 是 BOM 的顶层对象，代表浏览器窗口，可操作窗口尺寸、位置等：

- **窗口尺寸**：

  - `window.innerWidth`/`innerHeight`：视口宽高（含滚动条）。
  - `window.outerWidth`/`outerHeight`：浏览器窗口总宽高。

- **窗口操作**：
  - `window.open(url, target, features)`：打开新窗口（如 `window.open('https://example.com', '_blank', 'width=800,height=600')`）。
  - `window.close()`：关闭当前窗口。
  - `window.moveTo(x, y)`：移动窗口到指定坐标。

#### 4.1.2 定时器

用于延迟执行或重复执行代码：

1. **`setTimeout`**：延迟指定时间后执行一次

```javascript
// 2秒后执行
const timerId = setTimeout(function () {
  console.log("2秒后执行");
}, 2000);

// 取消定时器
clearTimeout(timerId);
```

2. **`setInterval`**：每隔指定时间重复执行

```javascript
// 每秒执行一次
const intervalId = setInterval(function () {
  console.log("每秒执行");
}, 1000);

// 取消定时器
clearInterval(intervalId);
```

**示例**：倒计时功能

```html
<div id="countdown">10</div>

<script>
  const countdownDiv = document.getElementById("countdown");
  let seconds = 10;

  const timerId = setInterval(function () {
    seconds--;
    countdownDiv.textContent = seconds;

    if (seconds <= 0) {
      clearInterval(timerId);
      countdownDiv.textContent = "时间到！";
    }
  }, 1000);
</script>
```

### 4.2 `location` 对象

`location` 提供当前页面的 URL 信息，可用于导航：

- **URL 属性**：

  - `location.href`：完整 URL（如 `https://example.com/path?name=test#hash`）。
  - `location.search`：查询字符串（如 `?name=test`）。
  - `location.hash`：哈希（如 `#hash`）。

- **导航方法**：
  - `location.href = 'url'`：跳转到新页面。
  - `location.reload()`：重新加载页面。
  - `location.replace('url')`：替换当前页面（不留下历史记录）。

**示例**：解析查询参数

```javascript
// 当前 URL：https://example.com?name=John&age=30
function getQueryParams() {
  const params = new URLSearchParams(location.search); // 解析查询字符串
  return Object.fromEntries(params.entries()); // 转为对象
}

const params = getQueryParams();
console.log(params.name); // 输出 'John'
console.log(params.age); // 输出 '30'
```

### 4.3 `history` 对象

`history` 操作浏览器历史记录：

- **基本导航**：

  - `history.back()`：后退一页（同浏览器后退按钮）。
  - `history.forward()`：前进一页（同浏览器前进按钮）。
  - `history.go(n)`：跳转到历史记录中的第 n 页（n 为正数向前，负数向后）。

- **HTML5 历史管理**（无刷新导航）：
  - `history.pushState(state, title, url)`：添加新历史记录（不刷新页面）。
  - `history.replaceState(state, title, url)`：替换当前历史记录。
  - `popstate` 事件：监听历史记录变化（点击前进/后退时触发）。

**示例**：无刷新导航

```html
<button id="page1">页面1</button>
<button id="page2">页面2</button>
<div id="content"></div>

<script>
  const content = document.getElementById("content");

  // 切换页面内容
  function showPage(page) {
    content.textContent = `这是${page}的内容`;
    // 添加历史记录（URL 变化但不刷新）
    history.pushState({ page }, `页面${page}`, `/${page}`);
  }

  // 按钮点击事件
  document
    .getElementById("page1")
    .addEventListener("click", () => showPage("页面1"));
  document
    .getElementById("page2")
    .addEventListener("click", () => showPage("页面2"));

  // 监听历史记录变化（前进/后退）
  window.addEventListener("popstate", function (event) {
    if (event.state) {
      content.textContent = `这是${event.state.page}的内容`;
    }
  });
</script>
```

### 4.4 `navigator` 和 `screen` 对象

#### 4.4.1 `navigator` 对象

提供浏览器相关信息：

- `navigator.userAgent`：用户代理字符串（判断浏览器类型）。
- `navigator.geolocation`：地理定位 API（获取用户位置）。

**示例**：检测设备类型

```javascript
function isMobile() {
  return /Mobile|Android|iOS/i.test(navigator.userAgent);
}

if (isMobile()) {
  console.log("移动设备");
} else {
  console.log("桌面设备");
}
```

#### 4.4.2 `screen` 对象

提供屏幕信息：

- `screen.width`/`screen.height`：屏幕宽高。
- `screen.availWidth`/`screen.availHeight`：可用屏幕宽高（减去任务栏等系统组件）。

**示例**：根据屏幕尺寸调整布局

```javascript
function adjustLayout() {
  if (screen.width < 768) {
    document.body.classList.add("mobile"); // 移动端布局
  } else {
    document.body.classList.remove("mobile"); // 桌面端布局
  }
}

// 窗口大小改变时调整
window.addEventListener("resize", adjustLayout);
adjustLayout(); // 初始化
```

### 4.5 浏览器存储

现代浏览器提供了多种客户端数据存储方式，满足不同场景的需求。

#### 4.5.1 Web Storage

Web Storage 提供两种存储机制，均为键值对存储，仅支持字符串类型：

- **`localStorage`（永久性存储）**  
  数据永久保留，即使关闭浏览器后重新打开也不会丢失，容量通常为 5-10MB。

  ```javascript
  // 存储数据
  localStorage.setItem("username", "John");

  // 获取数据
  const name = localStorage.getItem("username"); // 'John'

  // 删除指定数据
  localStorage.removeItem("username");

  // 清空所有数据
  localStorage.clear();
  ```

- **`sessionStorage`（会话存储）**  
  数据仅在当前会话（标签页/窗口）有效，关闭会话后自动删除，用法与 `localStorage` 一致。

  ```javascript
  // 存储会话数据
  sessionStorage.setItem("tempData", "临时信息");

  // 获取数据
  const temp = sessionStorage.getItem("tempData");
  ```

- **存储复杂数据**  
  Web Storage 仅支持字符串，存储对象、数组等复杂数据需通过 `JSON.stringify` 转换，获取时用 `JSON.parse` 解析：

  ```javascript
  // 存储对象
  const user = { name: "John", age: 30 };
  localStorage.setItem("user", JSON.stringify(user));

  // 获取对象
  const storedUser = JSON.parse(localStorage.getItem("user"));
  console.log(storedUser.name); // 'John'
  ```

- **示例：本地待办事项应用（`localStorage`）**

  ```html
  <input type="text" id="taskInput" placeholder="输入任务" />
  <button id="addBtn">添加任务</button>
  <ul id="taskList"></ul>

  <script>
    const input = document.getElementById("taskInput");
    const addBtn = document.getElementById("addBtn");
    const list = document.getElementById("taskList");

    // 加载已存储的任务
    function loadTasks() {
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      tasks.forEach((task) => {
        const li = document.createElement("li");
        li.textContent = task;
        list.appendChild(li);
      });
    }

    // 保存任务到 localStorage
    function saveTasks(tasks) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // 添加任务
    addBtn.addEventListener("click", () => {
      const task = input.value.trim();
      if (task) {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.push(task);
        saveTasks(tasks);

        const li = document.createElement("li");
        li.textContent = task;
        list.appendChild(li);
        input.value = ""; // 清空输入框
      }
    });

    // 初始化
    loadTasks();
  </script>
  ```

#### 4.5.2 Cookies

Cookies 是小型文本数据（通常 ≤4KB），会随每次 HTTP 请求发送到服务器，适合存储会话标识等轻量数据。

- **创建 Cookie**

  ```javascript
  // 设置 Cookie（有效期7天）
  const date = new Date();
  date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000); // 7天的毫秒数
  document.cookie = `username=John; expires=${date.toUTCString()}; path=/`;
  ```

- **读取 Cookie**

  ```javascript
  // 解析为对象
  const cookies = document.cookie.split("; ").reduce((obj, cookie) => {
    const [key, value] = cookie.split("=");
    obj[key] = value;
    return obj;
  }, {});
  console.log(cookies.username); // 'John'
  ```

- **删除 Cookie**

  ```javascript
  // 设置过期时间为过去即可删除
  document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
  ```

- **Cookie 与 Web Storage 的对比**  
  | 特性 | Cookie | Web Storage（localStorage/sessionStorage） |
  |--------------|-------------------------|--------------------------------------------|
  | 容量 | 约 4KB | 约 5-10MB |
  | 有效期 | 可设置过期时间 | localStorage 永久，sessionStorage 会话内 |
  | 发送到服务器 | 随每次请求自动发送 | 不发送 |
  | 用途 | 会话标识、用户认证 | 用户偏好、本地缓存、复杂数据存储 |

## 五、高级 Web API

### 5.1 网络请求与 Fetch API

#### 5.1.1 Fetch API 基础

Fetch API 是现代网络请求方案，替代传统的 `XMLHttpRequest`，基于 Promise，语法更简洁。

- **基本用法（GET 请求）**

  ```javascript
  fetch("https://api.example.com/data")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`请求失败：${response.status}`);
      }
      return response.json(); // 解析为 JSON
    })
    .then((data) => console.log("数据：", data))
    .catch((error) => console.error("错误：", error));
  ```

- **发送 POST 请求**
  ```javascript
  fetch("https://api.example.com/data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "John", age: 30 }), // 请求体（需序列化）
  })
    .then((response) => response.json())
    .then((data) => console.log("响应：", data));
  ```

#### 5.1.2 高级 Fetch 用法

- **设置请求超时**  
  使用 `AbortController` 终止超时请求：

  ```javascript
  const controller = new AbortController();
  const signal = controller.signal;

  // 5秒超时
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  fetch("https://api.example.com/data", { signal })
    .then((response) => response.json())
    .then((data) => {
      clearTimeout(timeoutId); // 清除超时器
      console.log("数据：", data);
    })
    .catch((error) => {
      if (error.name === "AbortError") {
        console.log("请求超时");
      } else {
        console.error("其他错误：", error);
      }
    });
  ```

- **上传文件**  
  使用 `FormData` 处理文件上传：

  ```javascript
  const formData = new FormData();
  const fileInput = document.querySelector('input[type="file"]');

  formData.append("file", fileInput.files[0]); // 添加文件
  formData.append("username", "exampleUser"); // 添加其他字段

  fetch("https://api.example.com/upload", {
    method: "POST",
    body: formData, // FormData 无需设置 Content-Type
  })
    .then((response) => response.json())
    .then((data) => console.log("上传成功：", data));
  ```

- **并发请求**  
  使用 `Promise.all` 同时处理多个请求：
  ```javascript
  Promise.all([
    fetch("https://api.example.com/users"),
    fetch("https://api.example.com/posts"),
  ])
    .then((responses) => Promise.all(responses.map((r) => r.json())))
    .then(([users, posts]) => {
      console.log("用户：", users);
      console.log("帖子：", posts);
    });
  ```

### 5.2 地理定位与多媒体 API

#### 5.2.1 地理定位 API

`Geolocation API` 允许网页获取用户地理位置（需用户授权）。

- **获取当前位置**

  ```javascript
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log(`纬度：${latitude}，经度：${longitude}`);
      },
      (error) => console.error("获取失败：", error.message)
    );
  } else {
    console.error("浏览器不支持地理定位");
  }
  ```

- **监视位置变化**

  ```javascript
  // 持续监听位置（如导航场景）
  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      console.log("位置更新：", position.coords);
    },
    (error) => console.error("更新失败：", error.message)
  );

  // 停止监视
  // navigator.geolocation.clearWatch(watchId);
  ```

#### 5.2.2 多媒体 API

- **Audio/Video 控制**  
  通过 JavaScript 控制音频/视频播放：

  ```html
  <audio id="myAudio" controls>
    <source src="audio.mp3" type="audio/mpeg" />
  </audio>

  <script>
    const audio = document.getElementById("myAudio");
    audio.addEventListener("play", () => console.log("开始播放"));
    audio.addEventListener("pause", () => console.log("暂停"));
  </script>
  ```

- **Canvas API（绘图）**  
  Canvas 提供 2D 绘图能力，可绘制图形、文本、图像等：

  ```html
  <canvas id="myCanvas" width="400" height="400"></canvas>

  <script>
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d"); // 获取 2D 上下文

    // 绘制矩形
    ctx.fillStyle = "red";
    ctx.fillRect(50, 50, 200, 100); // x, y, 宽, 高

    // 绘制圆形
    ctx.beginPath();
    ctx.arc(200, 200, 50, 0, Math.PI * 2); // 圆心(x,y), 半径, 起始角, 结束角
    ctx.fillStyle = "blue";
    ctx.fill();

    // 绘制文本
    ctx.font = "30px Arial";
    ctx.fillStyle = "green";
    ctx.fillText("Hello Canvas", 50, 350);
  </script>
  ```

- **简易绘图应用**

  ```html
  <canvas
    id="drawingCanvas"
    width="600"
    height="400"
    style="border: 1px solid #000;"
  ></canvas>

  <script>
    const canvas = document.getElementById("drawingCanvas");
    const ctx = canvas.getContext("2d");
    let isDrawing = false;
    let [lastX, lastY] = [0, 0]; // 上一个点的坐标

    // 鼠标按下：开始绘图
    canvas.addEventListener("mousedown", (e) => {
      isDrawing = true;
      [lastX, lastY] = [e.offsetX, e.offsetY]; // 相对于 canvas 的坐标
    });

    // 鼠标移动：绘制线条
    canvas.addEventListener("mousemove", (e) => {
      if (!isDrawing) return;
      ctx.beginPath();
      ctx.moveTo(lastX, lastY); // 起点
      ctx.lineTo(e.offsetX, e.offsetY); // 终点
      ctx.stroke(); // 绘制线条
      [lastX, lastY] = [e.offsetX, e.offsetY]; // 更新上一个点
    });

    // 鼠标释放：结束绘图
    canvas.addEventListener("mouseup", () => (isDrawing = false));
  </script>
  ```

### 5.3 Web Workers 与 Service Workers

#### 5.3.1 Web Workers

Web Workers 允许 JavaScript 在**后台线程**执行，避免阻塞主线程（如处理大量计算）。

- **基本用法**

  1. 主脚本（主线程）：

  ```javascript
  // 创建 Worker（指定 Worker 脚本）
  const worker = new Worker("worker.js");

  // 向 Worker 发送消息
  worker.postMessage("主线程发送的消息");

  // 接收 Worker 的消息
  worker.onmessage = (event) => {
    console.log("收到 Worker 消息：", event.data);
  };

  // 终止 Worker（不再使用时）
  // worker.terminate();
  ```

  2. Worker 脚本（`worker.js`，后台线程）：

  ```javascript
  // 接收主线程消息
  self.onmessage = (event) => {
    console.log("收到主线程消息：", event.data);

    // 执行耗时任务（如大数据计算）
    const result = heavyCalculation();

    // 向主线程发送结果
    self.postMessage(result);
  };

  function heavyCalculation() {
    let sum = 0;
    for (let i = 0; i < 1000000000; i++) {
      sum += i;
    }
    return sum;
  }
  ```

#### 5.3.2 Service Workers

Service Workers 是运行在后台的特殊 Worker，主要用于**拦截网络请求、实现离线缓存、推送通知**，是 PWA（渐进式 Web 应用）的核心。

- **注册 Service Worker**

  ```javascript
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => console.log("Service Worker 注册成功"))
      .catch((error) => console.error("注册失败：", error));
  }
  ```

- **Service Worker 脚本（`service-worker.js`）**

  ```javascript
  // 1. 安装阶段：缓存静态资源
  self.addEventListener("install", (event) => {
    event.waitUntil(
      caches
        .open("my-cache-v1") // 创建缓存库
        .then((cache) =>
          cache.addAll([
            // 缓存指定资源
            "/",
            "/index.html",
            "/styles.css",
            "/app.js",
          ])
        )
    );
  });

  // 2. 激活阶段：清理旧缓存
  self.addEventListener("activate", (event) => {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== "my-cache-v1")
            .map((name) => caches.delete(name)) // 删除旧缓存
        );
      })
    );
  });

  // 3. 拦截请求：优先返回缓存，无缓存则请求网络
  self.addEventListener("fetch", (event) => {
    event.respondWith(
      caches
        .match(event.request) // 匹配缓存
        .then((response) => response || fetch(event.request)) // 缓存命中则返回，否则请求网络
    );
  });
  ```

## 六、学习路径与资源推荐

### 6.1 系统化学习路径

- **第一阶段：基础掌握（1-2 个月）**

  - **DOM 基础**：元素获取、内容/样式修改、事件处理（点击、鼠标事件）。
  - **BOM 基础**：定时器（`setTimeout`/`setInterval`）、`location`/`history` 对象、`localStorage` 存储。
  - **实践**：实现表单验证、简易轮播图、本地待办事项应用。

- **第二阶段：深入理解（2-3 个月）**

  - **DOM 进阶**：节点操作、事件委托、自定义事件、虚拟滚动。
  - **BOM 进阶**：Service Worker 离线缓存、地理定位、Canvas 绘图、Web Workers 多线程。
  - **实践**：开发离线 Web 应用、虚拟滚动列表、简易绘图工具。

- **第三阶段：架构师视角（3-6 个月）**
  - **性能优化**：浏览器渲染机制、`requestAnimationFrame`、减少回流/重绘。
  - **跨端兼容**：特性检测、Polyfill、优雅降级策略。
  - **实践**：设计 UI 组件库、开发 PWA 应用、实现完整单页应用（SPA）。

### 6.2 优质学习资源

- **官方文档**：

  - MDN Web Docs（最权威，涵盖所有 Web API 细节）。
  - W3C 标准（Web 技术官方规范）。

- **书籍推荐**：

  - 《JavaScript 高级程序设计》（红宝书，深入讲解 Web API）。
  - 《DOM Enlightenment》（DOM 权威指南）。

- **在线课程**：

  - MDN 官方学习路径（系统化免费课程）。
  - freeCodeCamp（交互式练习，侧重实战）。

- **实战项目**：
  - 实现 PWA 天气应用（集成 Service Worker 离线功能）。
  - 开发支持虚拟滚动的大数据列表。
  - 参与 GitHub 开源项目（如 UI 组件库）。

### 6.3 实践建议与方法

1. **每日练习**：每天学习一个 Web API 特性，编写示例代码验证。
2. **项目驱动**：从简单功能（如表单验证）到复杂应用（如离线博客），逐步提升。
3. **代码复用**：封装常用功能为工具函数（如 DOM 操作、请求处理），培养模块化思维。
4. **关注标准**：跟踪 MDN 和 W3C 动态，了解 API 新特性（如 `AbortController`、`Navigation API`）。

## 七、总结与展望

### 7.1 核心知识回顾

Web API 是前端开发的基础，涵盖：

- **DOM**：操作网页内容（元素、事件、样式）。
- **BOM**：控制浏览器行为（存储、导航、定时器）。
- **高级 API**：网络请求（Fetch）、离线缓存（Service Worker）、多线程（Web Workers）、绘图（Canvas）等。

### 7.2 前端架构师的必备技能

- **系统设计**：构建可扩展的组件库、单页应用（SPA）架构。
- **性能优化**：理解浏览器渲染原理，优化回流/重绘、减少请求开销。
- **工程化**：掌握构建工具（Webpack/Vite）、模块化设计、兼容性处理。
- **跨端思维**：结合 PWA、WebAssembly 等技术，扩展 Web 应用能力。

### 7.3 未来发展趋势

- **原生能力增强**：浏览器将提供更多原生 API（如 WebUSB、WebGPU），减少对第三方库的依赖。
- **离线优先**：Service Worker 和 PWA 成为标准，提升弱网/离线体验。
- **AI 融合**：Web API 与机器学习（如 TensorFlow.js）结合，实现智能交互（如语音识别、图像处理）。

通过持续学习和实践，掌握 Web API 的核心原理与应用，才能构建高效、可靠、用户体验优秀的现代 Web 应用。
