# Canvas 基础

## 概述

Canvas 是 html5 的一个新标签，相当于一个画布，用来绘制丰富的图形，最终渲染在浏览器上。
Canvas 本身不具备图形的能力，需配合 Javascript 提供的 CanvasAPI，才能绘制图形，以及交互。
Canvas 绘制的图形是一个位图，绘制的内容不属于 dom 元素，比 dom 元素绘制有更高的渲染能力。

- 缩放会导致图像失真
- 可以操作每个点位的像素，进而实现高度自定义的图形绘制和动画效果
- 相当于 img 引入的图片，可以右键另存

应用领域：

- 可视化图表
- h5 游戏制作
- banner 广告

## 创建画布和画笔

- `<canvas>` 标签，行内元素

```html
<!-- canvas 元素 -->
<canvas id="c1"></canvas>
<script>
  // 方式一
  // 获取画布
  const canvas = document.querySelector("#c1");
  // 创建画笔
  const context = canvas.getContext("2d"); // CanvasRenderingContext2D 对象

  // 方式二
  const canvas2 = document.createElement("canvas");
  document.body.append(canvas2);
  // 创建画笔
  const context2 = canvas2.getContext("2d");

  // 版本检查
  if (!canvas2.getContext) {
    console.log("当前浏览器版本过低，更换或升级浏览器后继续");
  }
</script>
```

## 画布区域特点

canvas，行内元素，支持设置 width 和 height（默认 300\*150），也可以使用 style 设置宽高。

- 坐标系
  - 每个画布都有一个坐标系统，画布左上角为默认原点(0, 0)
- 画布区域
  - 使用 width 和 height 属性控制的区域，该区域为坐标系的大小
- 放置区域
  - 使用 style 样式控制区域大小，默认放置区域与画布区域相同
  - 放置区域比画布区域不一致时，画布中图形会等比缩放，导致失真
    绘制图形

## 绘制矩形（填充矩形、描边矩形）

- 填充矩形：fillRect(orig_x, orig_y, width, height)
- 描边矩形：strokeRect(orig_x, orig_y, width, height)
- 矩形路径：rect(orig_x, orig_y, width, height)
  - 必须搭配 stroke() 或 fill() 使用
- 设置样式：必须在图形绘制前设置
  - fillStyle：填充颜色
  - strokeStyle：描边颜色
  - lineWidth：描边线宽

```js
// 创建画布
const canvas = document.createElement("canvas");
document.body.append(canvas);
canvas.width = 400;
canvas.height = 400;
// 创建画笔
const context = canvas.getContext("2d");
// 1.填充矩形，ctx.fillRect(orig_x, orig_y, width, height)
context.fillRect(0, 0, 100, 100);

// 2.描边矩形
context.strokeRect(0, 0, 100, 100);

// 3.矩形路径，必须搭配 stroke 或 fill 使用，才能显示
context.rect(0, 0, 100, 100);
context.stroke(); // 描边矩形
context.fill(); // 填充矩形
```

- beginPath 方法
  - stroke 和 fill 会对之前绘制的所有路径进行绘制
  - 使用 beginPath 方法，为不同路径设置开关
  - 不会影响 fillRect 和 strokeRect 绘制
  - 只与路径有关，与属性无关

```js
// 第一次
context.fillStyle = "#f00";
context.beginPath();
context.rect(0, 0, 100, 100);
context.stroke(); // 描边矩形

// 第二次
context.fillStyle = "#0f0";
context.beginPath();
context.rect(100, 0, 100, 100);
context.fill(); // 填充矩形
```

- 绘制圆角矩形

- roundRect(orig_x, orig_y, width, height, radius)
- 圆角半径 radius 写法

  - 一个值，10 或[10]，四个角半径均为 10
  - 两个值，[10, 20]，左上和右下，右上和左下
  - 三个值，[10, 20, 30]，左上，右上和左下，右下
  - 四个值，[10, 20, 30, 40]，左上，右上，右下，左下

```js
// 圆角矩形，orig_x，orig_y，width，height，radius
context.roundRect(0, 0, 100, 100, 3);
```

## 绘制直线和曲线

- moveTo(x, y)，将画笔移动到指定坐标点
- lineTo(x, y)，从上一个点绘制直线到指定的点

```js
context.moveTo(20, 20); // 移动
context.lineTo(40, 20); // 绘制直线路径[20, 20] -> [40, 20]
context.lineTo(40, 40); // 绘制直线路径[40, 20] -> [40, 40]
context.stroke(); // 绘制图形
```

- 线条 API
  - 属性 lineWidth：线宽
  - 属性 lineCap：端点样式
    - butt：默认，平的
    - round：圆头
    - square：方头
  - 属性 lineJoin：折线连接处样式
    - miter：默认，尖的
    - round：圆头
    - bevel：平的
  - 属性 miterLimit：设置折线形成的尖限制
    - lineJoin=miter 时有效
    - 线粗夹角小时，尖过长，可裁剪
  - 方法 setLineDash(array)：设置虚线
    - 参数 array，表示线段长度和留白长度；
    - array=[10]，线段长 10，留白长 10
    - array=[20, 10]，线段长 20，留白长 10
    - array=[10, 20, 30]，按数组，无限延续，线段 10-留白 20-线段 30-留白 10-...
  - 属性 lineDashOffset：设置虚线起始位置偏移
    - 虚线时有效
    - 动态控制 lineDashOffset 可以实现动画效果
  - 方法 closePath()：闭合路径
    - 使用 closePath 方法，使得曲线首尾自动闭合

### 虚线动画

```js
context.beginPath();
context.moveTo(0, 10);
context.lineWidth = 10;
context.strokeStyle = "#f00";
context.setLineDash([200]);
context.lineDashOffset = 200; // 偏移

function move() {
  context.beginPath();
  context.lineDashOffset -= 1;
  context.stroke();
  if (context.lineDashOffset == 200) {
    context.lineDashOffset = 200;
  }
  requestAnimationFrame(move);
}
requestAnimationFrame(move);
```

- 线条区域填充
  - 多个连续线条合围区域，可以使用 fill 填充
    绘制圆弧
- arc(orig_x, orig_y, r, startAngle, endAngle[, dir])
  - x、y，圆心坐标
  - r，半径
  - startAngle，起始绘制角度（弧度，1 角度=Math.PI / 180），默认圆心 x 轴右侧半径位置为绘制起点
  - endAngle，结束点角度（弧度）
  - dir，绘制方向
    - false，默认，顺时针
    - true，逆时针
- arcTo(x1, y1, x2, y2, r)
  - 通过 3 个控制点绘制圆弧
  - x1，y1，第二个点
  - x2，y2，第三个点
  - 按 1、2、3 顺序连线，形成一个夹角，通过半径确定圆弧

```js
//
context.beginPath();
context.arc(100, 100, 50, 0, Math.PI); // 绘制半圆路径
context.stroke();
//
context.beginPath();
context.MoveTo(0, 100);
context.arcTo(100, 100, 100, 0, 30); // 绘制半圆路径
context.stroke();
```

## 绘制椭圆

- ellipse(x, y, rx, ry, rotate, startAngle, endAngle[, dir])
  - x、y，圆心坐标
  - rx、ry，x 轴/y 轴半径
  - rotate，x 轴旋转角度（弧度，1 角度=Math.PI / 180，顺时针）
  - startAngle，起始绘制角度（弧度），默认圆心 x 轴右侧半径位置为绘制起点
  - endAngle，结束点角度（弧度）
  - dir，绘制方向
    - false，默认，顺时针
    - true，逆时针
      //
      context.beginPath();
      context.ellipse(100, 100, 50, 50, 0, 0, Math.PI \* 2); // 绘制椭圆路径
      context.stroke();
      绘制曲线
      canvas 提供绘制曲线的方法：贝赛尔曲线（二次、三次）
- 二次贝赛尔曲线：一个起点、终点，一个控制点
  - quadraticCurveTo(cx1, cy1, ex, ey)
  - cx1、cy1，控制点坐标
  - ex、ey，终点坐标
- 三次贝赛尔曲线：一个起点、终点，两个控制点
  - bezierCurveTo(cx1, cy1, cx2, cy2, ex, ey)
  - cx1、cy1、cx2、cy2，控制点坐标
  - ex、ey，终点坐标
    //
    context.beginPath();
    context.MoveTo(50, 200);
    context.quadraticCurveTo(150, 100, 250, 200);
    context.stroke();
    绘制文本
- fillText(textStr, x, y[, maxWidth])，填充文本
  - textStr
  - x、y，文本位置
  - maxWidth，可选，设置文本最大宽度
- strokeText()，描边文本
- 属性 font：设置文本样式（粗体，斜体，字号，字体）
  - 必须设置字体，否则样式无效
- 属性 textAlign：设置基于锚点水平位置（left、center、right）
- 属性 textBaseline：设置基于锚点垂直位置（top、center、bottom）

```js
//
context.beginPath();
context.font = "bold italic 80px sans-serif";
context.fillText("hello world", 100, 100);
```
