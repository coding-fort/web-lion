# SVG 基础

## 1.概述

1. SVG，可缩放矢量图形，使用 xml 绘制图形。

- 可使用文本编辑器创建和修改图形
- 浏览器会根据描述绘制图形，而不是使用像素填充空间，所以 svg 适用不同大小的屏幕
- 可使用 js 和 css 控制和交互
- 提供滤镜功能
- 2003 称为 w3c 标准，支持大多数浏览器
- 可单独使用，也可以配合 d3，echart 等应用

2. SVG 与 Canvas 差异
   SVG Canvas
   2003 成 w3c 标准 html 新标签
   绘制矢量图 绘制位图
   缩放不会失真 缩放会失真
   对标签操作，方便，灵活 对像素点操作，细腻，不易操作
   交互性强，易实现动画 动画逻辑复杂
   存在一定性能问题 性能略高
   适合绘制地图，图标 适合绘制图表，制作游戏
   不易绘制 3d 图形 提供绘制 3d 图形 API

## 2.SVG 准备

1. 坐标系

- 左上角为原点，往右为 x 正轴，往下为 y 正轴

2. SVG 根元素

### 坐标系

- SVG 中每个图形的绘制都会基于一个坐标系，隐式。

### viewBox 属性，装载区域

- 用于装载绘制图形局部或全部
- `<SVG viewBox="0 0 100 100"></SVG>`
- 通过 x, y, width, height 属性控制
- width 和 height，设置窗口宽度
- x 和 y，设置窗口起始的位置，为负值相当于绘制图形向右向下移动

### width 和 height 属性，可视区域

- 图形绘制区域
- 设置视口区域的大小
- 未设置 viewBox，装载区域与可视区域一致
- 设置 viewBox，对装载区域图形进行等比缩放展示

### SVG 插件

## 3.基础图形

### 矩形

- `<rect x="10" y="10" width="100" height="100" fill="none" stroke="blue"  rx="10" ry="10"/>`
- 基础属性，x, y, width, height
- 填充属性，fill
- 边框属性，stroke，stroke-width
- 圆角属性，rx，ry

### 圆形

- `<circle cx="40" cy="40" r="10" fill="#faa"/>`
- 基础属性，cx，cy，r
- 填充属性，fill
- 边框属性，stroke，stroke-width

### 椭圆形

- `<ellipse cx="40" cy="40" rx="20" rx="20" />`
- 基础属性，cx，cy
- 轴属性，rx，ry
- 填充属性，fill
- 边框属性，stroke，stroke-width

### 线条

- `<line x1="20" y1="20" x2="80" y2="80" stroke="#0ff" stroke-width="1" />`
- 无填充属性，fill
- 基础属性，x1，y1，x2，y2
- 边框属性，stroke，stroke-width

### 折线

- `<polyline points="10 10, 30 30, 40 40" />`
- 基础属性，points
- 填充属性，fill，默认存在，若不需要，设置为 none
- 边框属性，stroke，stroke-width

### 多边形

- `<polygon points="10 10, 20 20, 40,40" stroke="#00f" stroke-width="1"/>`
- 基础属性，points
- 填充属性，fill，默认存在，若不需要，设置为 none
- 边框属性，stroke，stroke-width
- 起始点与终端节点会自动闭合。

## 4.path 路径绘制

### path 属性

- `<path  d="M30 30 L60 30" />`
- d 属性，大写（绝对定位），小写（相对定位）
  - M：Move To，设置笔触所在起始位置
  - m（小写）：第二个笔触时，需要加上前一个坐标来确定位置
  - L：Line To，绘制直线到指定位置
  - l（小写）：需加上前一个坐标确定终点
  - H：横向直线，只需指定横坐标
  - V：纵向直线，只需指定纵坐标
  - A：绘制圆弧
  - Q：绘制曲线（二次贝塞尔曲线）
  - C：绘制曲线（三次贝塞尔曲线）
  - T/S：同斜率曲线（二次/三次）
  - Z：不需跟坐标，表示首尾坐标闭合
- 填充属性，fill
- 边框属性，stroke，stroke-width

### 绘制直线

- `<path  d="M30 30 L60 30" fill="none" stroke="#f00" stroke-width="2" />`

### 绘制弧线

- 两个点，x1，y1，x2，y2
- 圆半径，rx，ry，两点距离＜半径，两个圆产生 4 个圆弧
- 绘制方向，顺时针/逆时针
- 绘制弧线大小
- 绘制圆旋转角度（仅椭圆有效）
- " A rx ry rotate 旋转角度 arc-flag 弧大小状态（0/1） sweep-flag 绘制方向（0/1） x2 y2"
- `<path  d="M30 30 A15 15 0 0 60 50" fill="none" stroke="#f00" stroke-width="2" />`

### 绘制曲线

- SVG 支持二次贝塞尔曲线（一个控制点），三次贝塞尔曲线（两个控制点）
- 两个点，x1，y1，x2，y2
- 控制点，px1，py1，px2，py2
- 二次贝塞尔曲线，"Qpx1 py1, x2 y2"
- "Qpx1 py1, x2 y2Tx3 y3"等价于"Qpx1 py1, x2 y2Qpx2 py2, x3 y3"，两曲线同斜率圆滑过渡
- `<path  d="M30 30 Q50 20, 80 20" fill="none" stroke="#f00" stroke-width="2" />`
- 三次贝塞尔曲线，"Cpx1 py1, px2 py2, x2 y2"
- "Cpx1 py1, px2 py2, x2 y2Spx3 py3, x3 y3"，两曲线同斜率圆滑过渡
- `<path  d="M30 30 C50 20, 50 70, 80 20" fill="none" stroke="#f00" stroke-width="2" />`

## 5.填充和描边

### fill，填充属性，图形填充颜色

- fill-opacity，默认 1，填充透明度
- fill-rule，默认 nonzero，重叠部分所属规则
- - nonzero：内部计数器，顺时针+1，逆时针-1，计数器不等于 0 时，表示图形有效，等于 0 时，表示图形无效（移除）
- - evenodd：内部计数器顺逆时针绘制均+1，奇数时有效，偶数时无效

### stroke，描边属性，描边颜色

- stroke-width，描边宽度
- stroke-opacity，描边透明度
- stroke-linecap，描边线段两端样式

  - butt：默认，直线型
  - round：圆角型
  - square：方型（较 butt 长）

- stroke-linejoin，折线连接点形状

  - miter：默认，尖的
  - round：圆角
  - bevel：平的

- stroke-dasharray，使用虚线描边，并设置虚线及空白长度

  - stroke-dasharray="10"，每段长度 10，空白长度 10
  - stroke-dasharray="10 5"，每段长度 10，空白长度 5
  - stroke-dasharray="10 5 10"，[10(5)10][10(5)10]…

- stroke-dashoffset，dasharray 设置时有效，虚线起点偏移，正数向左偏移，负数向右偏移。应用：动态文字效果

## 6.用 CSS 控制 SVG

1. 使用 CSS 设置的 SVG 效果属性

   - fill 和 stroke 属性
   - 其他属性：r，cx，cy，x，y
   - 无效属性：d，points，x1，y1，x2，y2

2. 将 CSS 效果作用在 SVG 上
   - 绝大部分样式都支持
   - 无效属性：background，border
   - 不支持伪类:before 和:after

## 7.JS 操作 SVG

```js
// 1. 创建SVG 标签
let elem = document.createElementNS("http://www.w3.org/2000/svg", "circle");

// 2. 放置
document.querySelector("svg").appendChild(elem);

// 3. 操作
elem.setAttribute("cx", 50);
elem.setAttribute("cy", 50);
elem.setAttribute("r", 20);

// 4. 事件
elem.onclick = () => {};

// 5. 过渡函数
elem.ontransitionend = (e) => {};
```

## 8.Text 文本元素

1. 基本使用

   - `<text x="0" y="0" font-size="10">hello world</text>`
   - x：文本左侧到 y 轴距离
   - y：文本底边到 x 轴距离
   - dx：横向偏移量
   - dy：纵向偏移量

2. 文本属性

   - fill：字体颜色
   - font-size
   - font-family
   - font-style：斜体
   - font-weight：粗体
   - text-decoration
   - letter-spacing：字间距
   - word-spacing：词间距
   - font-variant：字母变体（转大写）
   - - small-caps
   - text-anchor：设置文本锚点，基于 x，y 坐标
   - - start
   - - middle
   - - end
   - textLength：设置文本书写空间长度（压缩/发散）

3. tspan 子标签

   - `<text x="0" y="0" font-size="10">hello <tspan>world</tsapn></text>`
   - 属性同 text 标签
   - x，y 基于坐标原点
   - dx，dy 相对于文字原位置偏移

4. textPath 子标签

   - 环绕路径字体
   - 属性同 text 标签（无 x，y，dx，dy）
   - 属性 xlink:href：需环绕元素 id

5. use 元素

   - 用于引用其他元素，在指定位置绘制一个新图形。
   - `<use xlink:href="#c1" x="50" y="50" />`
   - 属性 x、y：相对于引用图像的坐标增量

6. g 元素

   - 用来组合多个图形的容器，g 元素本身没有任何效果

7. defs 元素
   - 定义可重用的元素，可包含多个图形，本身不显示。可以配合 use 在多个地方复用，此外还可以配合滤镜、渐变等
