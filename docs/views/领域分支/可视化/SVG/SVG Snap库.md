# SVG Snap 库

2025-01-06 SVG 进阶-Snap 库
一个 svg 的 api 库，提供了更简便的方式来创建、操作、动画 svg 图形。
官网：snapsvg.io
创建画布 Pager
let pager = Snap(width, height); // 在 body 中创建一个 svg 标签
const pager = Snap(selector); // 绑定 body 中已存在 svg 标签
// 设置 svg 属性
pager.attr({
width: 200,
height: 200,
});
绘制图形
在画布中绘制图形。
// 绘制矩形
const elem = pager.rect(orig_x, orig_y, width, height);
// 绘制圆形
const circle = pager.circle(cx, cy, r);
// 绘制 g 标签
const g = pager.g(elem, circle);
设置图形元素
const elem = pager.rect(orig_x, orig_y, width, height);
// 设置图形属性
elem.attr({
fill: "#fac",
stroke: "#ccc",
strokeWidth: 5,
transform: "rotate(45, 75, 100)"
});
设置图形动画
const elem = pager.rect(0, 0, 100, 80);
// 设置动画
elem.animate({
x: 100,
y: 20
}, dur [, callback]);
Snap 静态方法
● Snap.sin(deg)
● Snap.deg(rad)
● Snap.rad(deg)
