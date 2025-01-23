2024-12-04 WebAPI
JavaScript 包含 ECMAScript（语言规范、标准库）和 WebAPI（BOM、DOM）

## 1. BOM：浏览器模型，提供和浏览器相关操作

- window
- location
- history：当前窗口的历史记录

## 2. DOM：文档模型，提供和页面相关操作

- 获取 dom
- 创建 dom：document.createElement
- 修改 dom：remove、insertBefore、appendChild
- dom 属性：标准属性、自定义属性
- dom 内容：innerText、innerHTML
- dom 样式：内联样式，计算样式
  Js 可以获取内联样式和计算样式，但只能设置内联样式。
- dom 事件
  - 注册事件：&lt;btn onclick&gt;、btn.onclick、btn.addEventListener
  - 事件处理函数，this 始终指向注册元素
- dom 进阶

  - 事件默认行为
    阻止：e.preventDefault()
  - dom 尺寸和位置

- 事件传播机制
  （1）捕获阶段
  （2）目标阶段
  （3）冒泡阶段
  阻止：e.stopPropagation()
  事件委托：事件注册到父元素，通过 e.target 判断确定到具体子元素

```js
// 第三个参数表示是否在捕获阶段触发函数，默认（false）触发为冒泡阶段
document.body.addEventListener("click", () => {}, true);
```

## 3. 防抖

function dubounce(fn,duration){
var timerId;
var that=this;
return function(){
clearTimeout(timerId);
timerId=setTimerout(function(){
fn.call(that)
})
}
}

## 4. 正则表达式

## 5. 浏览器渲染原理

- 解析 html
  浏览器从网络或本地文件中获取 html 源代码，然后从上到下解析源代码。解析过程若遇到 CSS 或 js，停止解析，从而转到 CSS 或 js 解析和执行，执行完后再继续解析剩余 html 代码。
  为什么 CSS 写在页面开口，js 写到页面最后？
  CSS 写到开头，是为了让浏览器尽快读取并解析样式，避免丑陋的页面被用户看到，以及避免页面闪烁
  js 写到最后，是为了让浏览器尽快将页面呈现给用户，再执行 js 交互功能。

- 生成 dom 树
  浏览器会一边解析 html，一边生成 dom 树。
  dom 树生成完成后回执行 DOMContentLoaded。
  load 事件，页面中所有元素加载完成后再执行

- 生成渲染树
  一边生成 dom 树，一边计算 dom 树中每个节点的样式规则，最终生成渲染树。

- 布局 layout/重排 reflow
  一边生成渲染树，一边计算每个元素的最终尺寸和位置，完成后，页面中所有元素的尺寸和位置都确认后，渲染到页面。
  js 导致 reflow 情况

  - 获取元素的尺寸和位置
  - 直接或间接元素的尺寸和位置
    reflow 非常耗时

- 重绘 repaint
  一边 reflow，一边进行生成对应的图形绘制到页面。
  所有的 reflow 都会导致 repaint。
  不改变盒子排列，仅影响盒子外观的代码不会导致 reflow，仅导致 repaint
  - 改变背景颜色
  - 改变字体颜色
  - 改变圆角
  - …

## 6. 异常

- 异常分类
  - syntaxError，语法错误
  - referenceError，引用错误
  - typeError，类型错误
    每个异常都在控制台输出两个信息：异常的描述信息，异常位置的堆栈信息。
- 捕获异常
  try-catch-finally
  需要捕获异常：能够预知代码可能出现什么问题，出现异常后需要做什么
  永远不能为了不报错而捕获异常！
- 手动抛出异常
  编写函数时，如果出现以下情况之一，可以捕获异常
  - 预知执行过程可能会出现某种错误
  - 浏览器不会抛出这个错误
  - 该函数无法处理这个错误

## 7. 断点调试
