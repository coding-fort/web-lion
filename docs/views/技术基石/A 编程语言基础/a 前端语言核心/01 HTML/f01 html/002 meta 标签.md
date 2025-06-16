# 002 meta 标签

`<meta>`标签用于定义 HTML 文档的元数据，这些数据不会在页面上直接显示，但对网页的展示、功能及搜索引擎优化等方面起着关键作用。以下是其详细说明：

## 1. 定义字符编码

- **作用**：通过设置`charset`属性指定网页的字符编码，确保浏览器能正确显示页面中的各种字符。
- **示例**：`<meta charset="UTF - 8">`，UTF - 8 是一种通用的字符编码，能支持几乎所有的字符集。

## 2. 视口（viewport）设置

- **作用**：用于响应式网页设计，让网页在不同设备（如手机、平板、电脑）上正确缩放和布局。
- **示例**：
  `<meta name="viewport" content="width=device - width, initial - scale = 1.0">`
- **解释**：
  - `name="viewport"`表明这是对视口进行设置。
  - `width=device - width`使网页宽度等于设备屏幕宽度。
  - `initial - scale = 1.0`设置页面初始缩放比例为 1.0，即不缩放。

## 3. 设置页面描述（description）

- **作用**：为搜索引擎提供网页内容的简短概括，有助于搜索引擎理解页面主题，在搜索结果中展示相关摘要，提升页面的点击率。
- **示例**：`<meta name="description" content="这是一个介绍旅游景点的网页，包含世界各地热门景点的详细信息。">`

## 4. 设置关键字（keywords）

- **作用**：曾经用于向搜索引擎提供与页面内容相关的关键字，帮助搜索引擎索引页面。不过现在搜索引擎对关键字元标签的依赖程度降低，但设置合理的关键字仍有一定辅助作用。
- **示例**：`<meta name="keywords" content="旅游,景点,攻略">`

## 5. 设置页面作者（author）

- **作用**：声明网页的作者，便于版权声明和内容溯源。
- **示例**：`<meta name="author" content="张三">`

## 6. 页面重定向

- **作用**：可在一定时间后将用户自动重定向到另一个网页。
- **示例**：`<meta http - equiv="refresh" content="5;url = https://new - website.com">`
- **解释**：`http - equiv="refresh"`表示刷新操作，`content="5;url = https://new - website.com"`表示 5 秒后重定向到`https://new - website.com`这个网址。
