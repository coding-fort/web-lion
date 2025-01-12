# html svg

## SVG 形状

### SVG 路径

**\<path>** 标签用来定义路径。

下面的命令可用于路径数据：

* M = moveto 移动到的点的x轴和y轴的坐标
* L = lineto 需要两个参数，分别是一个点的x轴和y轴坐标，L命令将会在当前位置和新位置（L前面画笔所在的点）之间画一条线段。
* H = horizontal lineto 绘制平行线
* V = vertical lineto 绘制垂直线
* C = curveto
* S = smooth curveto
* Q = quadratic Belzier curve
* T = smooth quadratic Belzier curveto
* A = elliptical Arc
* Z = closepath 从当前点画一条直线到路径的起点

注释：以上所有命令均允许小写字母。大写表示绝对定位，小写表示相对定位。

```html
<path d="M250 150 L150 350 L350 350 Z" />
<!-- 定义了一条路径，它开始于位置 250 150，到达位置 150 350，然后从那里开始到 350 350，最后在 250 150 关闭路径。 -->
```
