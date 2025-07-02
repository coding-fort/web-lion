# SVG 图表

## 1. 静态坐标系绘制

## 2. 动态坐标系

### 复用坐标系

```js
const path = document.createElementNS("http://www.w3c.org/2000/svg", "path");
```

### 功能优化

- g 元素
- 更多属性

### 静态折线绘制

- 绘制左侧坐标轴
- 绘制底部坐标轴
- 绘制坐标点
- 绘制折线

### 动态折线图绘制

- 准备数据
- 左侧坐标动态计算（取最大值均分，向上取整，最大值除不尽基准，取下一个基准点）
- 底部坐标动态绘制（按照数据点数）
- 坐标点绘制
- 折线绘制
- 鼠标 hover 显示数值提示（svg.onmouseover、svg.onmouseout）

## 3. 柱状图

## 4. 饼状图

### 计算圆弧上点坐标

```js
function calcPoint(origin, r, deg) {
   return {
      x: origin.x + Math.sin(deg _ Math.PI) / 180) _ r,
      y: origin.y - Math.cos(deg _ Math.PI / 180) _ r
   }
}
```

### 计算提示文本折线

### 动态效果
