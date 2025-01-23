# SVG 进阶

## viewbox 属性

### viewBox 作用特点

- 坐标系：每个 svg 都有一个坐标系，坐标系是无穷大的。
- viewBox 属性：指定一个视口的大小和位置，用来展示坐标系中的指定部分。
  - viewBox="origin.x, origin.y, view.wid, view.hig"
  - 确定要展示图形的部份
- width/height 属性：确定最终图形展示的大小。
  - width/height 的尺寸比 viewBox 大时会等比缩放。

### preserveAspectRatio 属性

- 保持（宽高）比例
- viewBox 宽高不一致时，默认会进行等比缩放
- preserveAspectRatio="xMidYMid meet"
- 第一部分（9 种可取值）：xMinYMin、xMidYMin、xMaxYMin、...
- 第二部分：meet（默认，居中）、slice（按照数值大进行缩放）
- 特殊情况（拉伸平铺）：preserveAspectRatio="none"

## 颜色渐变

图形的填充和描边使用颜色渐变。

### 线性渐变

```html
<!-- 定义渐变 -->
<defs>
  <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stop-color="#f00" stop-opacity="1"></stop>
    <stop offset="100%" stop-color="#ff0" stop-opacity="1"></stop>
  </linearGradient>
</defs>
<!-- 应用 -->
<rect x="10" y="10" width="80" height="40" fill="url(#lg1)"></rect>
```

- 如果只设置中间数值，则只有中间部份渐变，两边是起始和终止颜色。

### 径向渐变

```html
<!-- 定义渐变 -->
<defs>
  <radiaGradient id="rg1">
    <stop offset="0%" stop-color="#f00" stop-opacity="1"></stop>
    <stop offset="100%" stop-color="#ff0" stop-opacity="1"></stop>
  </radiaGradient>
</defs>
<!-- 应用 -->
<circle cx="10" cy="10" r="40" fill="url(#rg1)"></circle>
```

- 属性 cx、cy：定义原点位置
- 属性 r：设置渐变圆终止圆半径
- 属性 fr：设置渐变起始圆半径，未设置时，从原点开始
- 属性 fx、fy：设置渐变的焦点位置

### spreadMethod 属性

- 在缩小渐变范围后，设置渐变效果
- 可选值：
  - pad（默认），按起始/终止颜色填充；
  - repeat，重复当前渐变颜色填充，A-B-A-B-A-B；
  - reflect，反向重复渐变颜色填充，B-A-A-B-B-A；

### gradientUnits 属性

- 设置渐变单元
- 可选值
  - ObjectBoundingBox（默认），使用百分比
  - userSpaceOnUse，使用绝对值

### href 属性

- 渐变引用

```html
<!-- 定义渐变 -->
<defs>
  <radiaGradient id="rg1">
    <stop offset="0%" stop-color="#f00" stop-opacity="1"></stop>
    <stop offset="100%" stop-color="#ff0" stop-opacity="1"></stop>
  </radiaGradient>
  <radiaGradient id="rg2" href="#rg1"></radiaGradient>
</defs>
<!-- 应用 -->
<circle cx="10" cy="10" r="40" fill="url(#rg2)"></circle>
```

## 变形

平移、旋转、缩放、斜切。使用 transform 实现。

### 平移

- `transform="translate(x,y)"`

### 旋转

- `transform="rotate(deg[, x, y])"`
- 默认以坐标原点进行旋转，若需要指定旋转原点，则设置 x、y 值；或者使用 transform-origin="x y" 设置旋转原点；

### 缩放

- `transform="scale(x[, y])"`
- 默认以坐标原点进行缩放，使用 transform-origin="x y" 设置缩放原点；

### 斜切

- `transform="skewX(deg)"`
- `transform="skewY(deg)"`
- 默认以坐标原点作为中间点，使用 transform-origin="x y" 设置中间点；

## 嵌入图片

```html
<svg width="400" height="400" viewBox="0 0 200 200">
  <image href="1.jpg" x="10" y="10" width="80" height="80"></image>
</svg>
```

- image 标签
- 属性 x、y：放置图片的起始位置，默认原点；
- 属性 width、height：对图片宽高缩放，默认原始图片尺寸；
- 支持 preserveAspectRatio 属性；

## 裁剪与遮罩

擦除已创建图形的部份内容。

### 裁剪路径

- 由 path、text、基本图形组成。区域内可见。
- clipPath 标签
- 属性 clipPathUnits

  - userSpaceOnUse，默认值，绝对路径
  - objectBoundingBox，相对路径

```html
<svg>
  <!-- 定义 -->
  <defs>
    <clipPath id="cp1">
      <circle cx="20" cy="20" r="20" fill="#ff0"></circle>
    </clipPath>
  </defs>
  <!-- 使用 -->
  <rect
    x="20"
    y="20"
    width="60"
    height="50"
    fill="#f00"
    clip-path="url(#cp1)"
  ></rect>
</svg>
```

### 遮罩

裁剪只能控制图形区域展示或不展示，遮罩不仅可控制是否展示，还可以控制透明度，层叠关系。

- mask 标签
- 遮罩区域会透明化，在遮罩路径，指定颜色控制透明度（支持 16 进制颜色）

  - white，显示
  - black，不显示
  - gray，半透明

- 属性 maskContentUnits

  - userSpaceOnUse，默认，绝对值
  - objectBoundingBox，相对值

- 属性 maskUnits

  - 搭配 x、y、width、height 设置遮罩范围（0-0%，0.5-50%，1-100%）
  - userSpaceOnUse，绝对值
  - objectBoundingBox，默认，相对值

```html
<svg>
  <!-- 定义 -->
  <defs>
    <mask id="mk1">
      <circle cx="20" cy="20" r="20" fill="#fff"></circle>
    </mask>
  </defs>
  <!-- 使用 -->
  <rect
    x="20"
    y="20"
    width="60"
    height="50"
    fill="#f00"
    clip-path="url(#mk1)"
  ></rect>
</svg>
```

## 图案填充

使用`<pattern>` 标签定义一个图案。

### 快速应用

- x、y、width、height 计算图案的区域，在图案区域内设计具体的图案内容；

```html
<svg>
  <!-- 定义 -->
  <defs>
    <pattern id="pt1" x="0" y="0" width=".25" height=".25">
      <circle cx="10" cy="10" r="10" fill="#fff"></circle>
    </pattern>
  </defs>
  <!-- 使用 -->
  <rect x="10" y="10" width="80" height="80" fill="url(#pt1)"></rect>
</svg>
```

### 单元系统

- 属性 patternUnits：用来设置图案区域的单元系统

  - userSpaceOnUse，绝对值，相对于 svg 坐标系
  - objectBoundingBox，默认，相对值

- 属性 patternContentUnits：用来设置图案区域内部具体图形的单元系统

  - userSpaceOnUse，默认，使用具体值
  - objectBoundingBox，使用百分比，相对于图案区域
    viewBox 缩放

- 属性 viewBox：在图案区域有一个坐标系，基于这个坐标系，利用 viewBox 截取需要的部份

### 图案嵌套

在一个图案中，可以嵌套引用另一个图案。
