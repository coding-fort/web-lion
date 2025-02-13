# position

在 CSS 中，`position` 属性用于指定一个元素在其文档流中的定位方法。它决定了元素如何根据其自然位置、相对于最近的定位父级（即设置了 `position` 值不为 `static` 的祖先元素），或者相对于浏览器窗口进行定位。以下是几种常见的 `position` 值及其说明：

## **static**

这是所有元素默认的定位方式。在这种模式下，元素按照正常的文档流顺序排列，`top`, `right`, `bottom`, `left` 和 `z-index` 等属性将不起作用。

## **relative**

相对定位。元素先按照正常文档流布局，然后可以通过 `top`, `right`, `bottom`, `left` 属性来调整它的最终位置，而不会影响到页面上其他元素的位置。相对定位是相对于元素本身在正常文档流中的位置进行偏移的。

## **absolute**

绝对定位。元素从文档流中被取出，不再占据空间，并相对于最近的非 `static` 定位的祖先元素进行定位。如果没有这样的祖先元素，则相对于初始包含块（通常是浏览器窗口）。通过设置 `top`, `right`, `bottom`, `left` 可以精确控制元素的位置。

## **fixed**

固定定位。类似于绝对定位，但它是相对于浏览器窗口进行定位的，即使页面滚动，元素也会保持在同一位置。这对于创建固定的导航栏或返回顶部按钮非常有用。

## **sticky**

粘性定位。这是一个相对新奇的值，它使得元素表现为 `relative` 直到它跨越特定阈值（如通过 `top` 指定），之后表现为 `fixed`。这允许元素在页面滚动时“粘”在某个位置。例如，在实现随页面滚动而固定的头部或侧边栏时很有用。

使用这些不同的定位类型，可以灵活地布置网页上的元素，创建复杂的布局和动态效果。值得注意的是，正确地使用 `position` 属性对于确保网页设计的响应性和可访问性至关重要。同时，理解每个定位值的工作原理有助于解决布局过程中可能遇到的问题。

## 父元素确定

在 CSS 中，当涉及到`position`属性时，父级元素（或称为定位上下文）的确定对于理解元素如何定位非常重要。具体来说，这取决于子元素的`position`属性值：

- **对于`position: absolute;`**：如果一个元素被设置为绝对定位（`position: absolute;`），它会相对于最近的非`static`（即设置了`position`值为`relative`、`absolute`、`fixed`或`sticky`）的祖先元素进行定位。如果没有这样的祖先元素，则该元素将相对于初始包含块（通常是视口或浏览器窗口）进行定位。

- **对于`position: fixed;`**：固定定位的元素总是相对于浏览器窗口（视口）进行定位，这意味着即使页面滚动，它们也会保持在同一位置。在这种情况下，不涉及寻找特定的父级元素作为定位参考。

- **对于`position: sticky;`**：粘性定位的元素是基于用户的滚动位置来切换定位方式的。它首先表现为相对定位（`relative`），直到它达到某个阈值（如通过`top`, `bottom`等定义），之后表现为固定定位（`fixed`）。粘性定位是相对于最近的含有滚动机制的祖先元素，如果没有这样的祖先元素，则相对于整个文档。

为了更清楚地说明这一点，这里有一个简单的例子来解释绝对定位时父级元素的选择：

假设你有如下 HTML 结构：

```html
<div class="parent">
  <div class="child"></div>
</div>
```

以及以下 CSS：

```css
.parent {
  position: relative; /* 设置为非static定位 */
}

.child {
  position: absolute;
  top: 20px;
  left: 20px;
}
```

在这个例子中，`.child` 元素将会相对于 `.parent` 元素进行定位，因为 `.parent` 是离 `.child` 最近的设置了非`static`定位的祖先元素。如果你没有为 `.parent` 设置 `position: relative;`，那么 `.child` 将会尝试寻找下一个最近的非`static`定位的祖先元素；如果找不到，则最终相对于视口进行定位。

因此，当你希望一个绝对定位的元素相对于某一个特定的父级元素进行定位时，你需要确保这个父级元素的`position`属性设置为非`static`的值，最常见的是使用`relative`，这样可以避免影响到布局中的其他部分。
