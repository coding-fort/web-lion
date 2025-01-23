# Canvas 图像

## 基本使用

- drawImage(imgSource, x, y)
  - x、y，放置坐标
  - imgSource，图片源
  - 按图片原尺寸展示
- drawImage(imgSource, x, y, width, height)
  - width、height，展示图像大小（等比缩放）
- drawImage(imgSource, x1, y1, w1, h1, x2, y2, w2, h2)
  - x1、y1、w1、h1，图像截图区域，基于图像坐标系
  - x2、y2、w2、h2，画布展示区域

```js
const canvas = document.createElement("canvas");
document.body.append(canvas);
canvas.width = 400;
canvas.height = 400;
// 创建画笔
const context = canvas.getContext("2d");

const img = new Image();
img.src = "../img/1.png";
// 图像加载后才能绘制
img.onload = function () {
  context.drawImage(img, 100, 100);
};
```

## 图像与动画

```js
const img = new Image();
img.src = "../img/2.png";
// 图像加载后才能绘制
img.onload = function () {
  let i = 0,
    j = 0;
  function show() {
    context.clearRect(0, 0, 400, 400);
    // 动态截取动画帧
    context.drawImage(
      img,
      i * 94,
      0,
      100,
      img.height,
      j * 10,
      0,
      100,
      img.height
    );
    i++;
    j++;
    if (i == 5) i = 0;
  }
  setInterval(show, 1000);
};
```

## 视频图像

在视频播放中，抓取当前帧作为图像，引入 canvas。

```js
<video src="1.mp4"></video>
<script>
  const canvas = document.createElement('canvas');
  document.body.append(canvas);
  canvas.width = 400;
  canvas.height = 400;
  // 创建画笔
  const context = canvas.getContext('2d');

  const video = document.querySelector('video');
  video.addEventListener('play', function() {
    show();
  });
  function show() {
    context.clearRect(0, 0, 400, 400);
    context.drawImage(video, 0, 0, 400, 400);
    requestAnimationFrame(show);
  }
</script>
```

## 引入 Canvas 图像

canvas 本身可以作为图像源，引入到其他 canvas 中。

- 下载 Canvas 图像
  - toDataURL 默认生成 png 格式图片，通过传参"image/jpeg"指定格式
  - 下载其他路径图像源，可能存在同源问题，解决方案
    - 设置同源策略，img.crossOrigin = 'anonymous'；
    - 在服务器模式下触发下载；

```js
const btn = document.querySelector("button");
btn.onclick = function () {
  const url = canvas1.toDataURL();
  const a = document.createElement("a");
  a.href = url;
  a.download = "canvas 图像";
  a.click();
};
```

## 图像像素处理

ImageData 对象，包含某个区域内的像素值

- 属性 width
- 属性 height
- 属性 data，array 包含区域内所有像素值（rgba），array 是一个一维数组，每 4 个位置（R、G、B、A）表示一个像素值。
  获取/设置 ImageData 对象
- getImageData(x, y, width, height)，获取画布指定区域 ImageData 对象。
- putImageData(imageData, x, y)，将调整后 ImageData 对象设置到图像中。

```js
const img = new Image();
img.src = "../img/2.png";
// 图像加载后才能绘制
img.onload = function () {
  context.drawImage(img, 0, 0);
  const imageData = context.getImageData(0, 0, img.width, img.height);
  //
  for (let i = 0; i < imageData.length; i += 4) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];
    const a = imageData.data[i + 3];

    // 灰度
    const avg = (r + g + b) / 3;
    imageData.data[i] = avg;
    imageData.data[i + 1] = avg;
    imageData.data[i + 2] = avg;
  }
  // 重绘
  context.putImageData(imageData, 0, 0);
};
```

## 图像填充

使用 context.createPattern(imgSource, repetition) 方法，创建一个图案对象（CanvasPattern）。

- imgSource，图像源
- repetition，重复机制，基于画布坐标系原点开始，非图案坐标系原点。
  - repeat，横向、纵向平铺
  - repeat-x
  - repeat-y
  - no-repeat

```js
const img = new Image();
img.src = "../img/2.png";
img.onload = function () {
  //
  const pattern = context.createPattern(img, "repeat");
  // 设置填充样式
  context.fillStyle = pattern;
  context.rect(0, 0, 400, 400);
  context.fill();
};
```

## 图像裁剪

使用 context.clip(rule) 方法设置裁剪路径，接下来绘制图像只会在裁剪路径中绘制，对之前绘制图像没有影响。
clip 方法本身只会执行裁剪操作，裁剪路径需要额外绘制。

- 参数 rule：路径存在多次重叠时配置
  - nonzero，默认，非零环绕路径
    - 非零环绕：路径绘制时，顺时针+1，逆时针-1，区域最终为 0 时，不执行裁剪
  - evenodd：奇偶环绕路径
    - 奇偶环绕：路径绘制时，始终+1，奇数裁剪，偶数不裁剪

## 图像合成

### 路径（形状）合成

使用`context.globalCompositeOperation` 属性，将前后两个图形合成一个图形。

- 属性 globalCompositeOperation：合成机制
  - 需要在前后两个图形中间设置
  - source-over，默认，后面图形覆盖在前面图形上
  - source-in，只展示后面图形，展示重叠部份
  - source-out，只展示后面图形，展示不重叠部份
  - source-atop，只展示前面图形和后面图形与前面图形重叠部份
  - destination-\*（over、in、out、atop），类似 source，仅前后图形交换；
  - copy，后面图形覆盖前面图形（前面图形没了）
  - xor，展示除重叠部份外的图形

### 颜色合成

关注颜色混合，和图形没关系。同样使用使用 context.globalCompositeOperation 属性。

- 属性 globalCompositeOperation：合成机制 - 需要在前后两个图形中间设置 - lighter，重叠部份颜色叠加 - darken，同一个像素的颜色，取暗色，整体偏暗 - lighten，同一个像素的颜色，取亮色，整体偏亮 - multiply，整体偏暗，暗色偏原色，浅色偏暗 - screen，整体偏亮，暗色偏白，浅色偏亮
  刮刮乐效果

```html
<div>一等奖</div>
<script>
  const canvas = document.createElement("canvas");
  document.body.append(canvas);
  canvas.width = 300;
  canvas.height = 200;
  const context = canvas.getContext("2d");
  // 遮罩层
  context.beginPath();
  context.fillStyle = "#ccc";
  context.fillRect(0, 0, 300, 200);
  // 滑动层
  context.globalCompositeOperation = "destination-out";
  context.beginPath();
  context.strokeStyle = "#fff";
  context.lineWidth = 20;
  context.lineCap = "round";
  context.lineJoin = "round";

  // 鼠标点击操作
  canvas.onmousedown = function (e) {
    context.moveTo(e.offsetX, e.offsetY);
    // 移入
    canvas.onmouseover = function (e) {
      context.lineTo(e.offsetX, e.offsetY);
      context.stroke();
    };
    // 移出
    canvas.onmouseout = function () {
      canvas.onmouseover = null;
      canvas.onmouseout = null;
    };
  };
</script>
```

## 颜色渐变

### 线性渐变

使用 context.createLineGradient(x0, y0, x1, y1) 方法创建一个线性渐变的对象（CanvasGradient）。

- x0、y0、x1、y1，为线性渐变方向，基于坐标系
- 使用 gradient.addColorStop(%, color)添加渐变颜色
  - %，百分比
  - color，颜色
  - context.fillStyle = gradient，填充
  - context.strokeStyle = gradient，描边

### 径向渐变

使用 context.createRadialGradient(x0, y0, r0, x1, y1, r1) 方法创建一个径向渐变的对象（CanvasGradient）。

- x0、y0、r0，渐变开始的圆
- x1、y1、r1，渐变结束的圆
- 一般大圆搭配小圆才有效果，且小圆必须在大圆内
- 使用 gradient.addColorStop(%, color)添加渐变颜色
  - %，百分比
  - color，颜色

### 锥形渐变

用 context.createConicGradient(angle, x0, y0) 方法创建一个径向渐变的对象（CanvasGradient）。

- x0、y0，圆心点
- angle，起始角度（弧度，1 弧度=Math.PI / 180），默认 0 度是三点钟方向，angle=90 度，从六点钟方向开始
- 使用 gradient.addColorStop(%, color)添加渐变颜色
  - %，百分比
  - color，颜色

### 图形阴影

- 属性 shadowBlur，设置模糊程度
- 属性 shadowColor，设置阴影颜色
- 属性 shadowOffsetX，设置横向偏移
- 属性 shadowOffsetY，设置纵向偏移
