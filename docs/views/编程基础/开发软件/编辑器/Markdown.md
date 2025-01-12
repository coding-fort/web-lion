# Markdown

# 目录

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<!-- END doctoc -->

- [基本用法](#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95)
  - [标题](#%E6%A0%87%E9%A2%98)
  - [段落](#%E6%AE%B5%E8%90%BD)
  - [换行](#%E6%8D%A2%E8%A1%8C)
  - [着重](#%E7%9D%80%E9%87%8D)
    - [- 粗体](#--%E7%B2%97%E4%BD%93)
    - [- 斜体](#--%E6%96%9C%E4%BD%93)
    - [- 粗斜体](#--%E7%B2%97%E6%96%9C%E4%BD%93)
  - [块引用](#%E5%9D%97%E5%BC%95%E7%94%A8)
    - [- 多段落块引用](#--%E5%A4%9A%E6%AE%B5%E8%90%BD%E5%9D%97%E5%BC%95%E7%94%A8)
    - [- 嵌套块引用](#--%E5%B5%8C%E5%A5%97%E5%9D%97%E5%BC%95%E7%94%A8)
  - [清单](#%E6%B8%85%E5%8D%95)
  - [代码](#%E4%BB%A3%E7%A0%81)
  - [水平线](#%E6%B0%B4%E5%B9%B3%E7%BA%BF)
  - [链接](#%E9%93%BE%E6%8E%A5)
  - [图片](#%E5%9B%BE%E7%89%87)
  - [转义字符](#%E8%BD%AC%E4%B9%89%E5%AD%97%E7%AC%A6)
- [扩展用法](#%E6%89%A9%E5%B1%95%E7%94%A8%E6%B3%95)
  - [表格](#%E8%A1%A8%E6%A0%BC)
  - [脚注](#%E8%84%9A%E6%B3%A8)
  - [生成目录](#%E7%94%9F%E6%88%90%E7%9B%AE%E5%BD%95)
    - [1. 手动生成目录](#1-%E6%89%8B%E5%8A%A8%E7%94%9F%E6%88%90%E7%9B%AE%E5%BD%95)
    - [2. 自动生成目录](#2-%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90%E7%9B%AE%E5%BD%95)
    - [3. npm 语法生成](#3-npm-%E8%AF%AD%E6%B3%95%E7%94%9F%E6%88%90)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

**Markdown**是一种轻量级的标记语言，可用于将格式设置元素添加到纯文本文档中。

[Markdown 中文网](http://markdown.p2hp.com/index.html)

## 基本用法

### 标题

### 段落

### 换行

### 着重

#### - 粗体

要加粗文本，请在单词或短语的前后添加两个星号或下划线。要加粗一个单词的中部以强调，请在字母周围添加两个星号，且各空格之间不加空格。

> 示例：<br> > `I just love **bold text**. 或 I just love __bold text__.`<br><br>
> 呈现的输出如下所示：<br>
> I just love **bold text**. <br>
> I just love **bold text**. <br>

#### - 斜体

要加粗文本，请在单词或短语的前后添加一个星号或下划线。要加粗一个单词的中部以强调，请在字母周围添加两个星号，且各空格之间不加空格。

> 示例：<br> > `I just love *bold text*. 或 I just love _bold text_.`<br><br>
> 呈现的输出如下所示：<br>
> I just love _bold text_. <br>
> I just love _bold text_. <br>

#### - 粗斜体

要加粗文本，请在单词或短语的前后添加三个星号或下划线。要加粗一个单词的中部以强调，请在字母周围添加两个星号，且各空格之间不加空格。

> 示例：<br> > `I just love ***bold text***. 或 I just love ___bold text___.`<br><br>
> 呈现的输出如下所示：<br>
> I just love **_bold text_**. <br>
> I just love **_bold text_**. <br>

### 块引用

要创建 blockquote，请>在段落前面添加一个。

> 示例：<br> > `> Dorothy followed her through many of the beautiful rooms in her castle.`<br><br>
> 呈现的输出如下所示：<br>
>
> > Dorothy followed her through many of the beautiful rooms in her castle. <br>

#### - 多段落块引用

块引用可以包含多个段落。>在段落之间的空白行上添加一个。

> 示例：<br>
>
> <p> > Dorothy followed her through many of the beautiful rooms in her castle. </p>
> <p> > </p>
> <p> > The Witch bade her clean the pots and kettles and sweep the floor and keep the fire fed with wood.</p>
>
> <p>呈现的输出如下所示：</p>
>
> > Dorothy followed her through many of the beautiful rooms in her castle.
> >
> > The Witch bade her clean the pots and kettles and sweep the floor and keep the fire fed with wood. <br>

#### - 嵌套块引用

块引用可以嵌套。>>在要嵌套的段落前面添加一个。

> 示例：<br>
>
> <p>>> Dorothy followed her through many of the beautiful rooms in her castle.</p>
> 呈现的输出如下所示：<br>
>
> > > Dorothy followed her through many of the beautiful rooms in her castle. <br>

### 清单

### 代码

### 水平线

要创建水平线\*\*\*，请单独在一行上使用三个或更多的星号（），破折号（---）或下划线（\_\_\_）。

> 示例:<br/>
>
> ---
>
> ---

### 链接

要创建链接，请将链接文本括在方括号（例如[Duck Duck Go]）中，然后立即在 URL 后面加上括号（例如(https://duckduckgo.com)）中的URL 。

> 示例：<br>
>
> <p>我最喜欢的搜索引擎是[Duck Duck Go](https://duckduckgo.com).</p>
>
> 呈现的输出如下所示：<br>
>
> 我最喜欢的搜索引擎是[Duck Duck Go](https://duckduckgo.com)。

<bqe>
在Markdown中，标题转换为HTML锚点时，确实会将标题文字转换为小写并用连字符连接，但这个过程中也会去除或替换掉非字母和连字符字符，包括数字。然而，实际上，数字并不会被移除，它们通常会被保留下来成为锚点的一部分。<br/>
例如，在标题中使用数字，例如“1. 标题”，则生成的HTML锚点为“1-标题”。具体可以查看页面元素的<prib>id 标识</prib>；
</bqe>

### 图片

要添加图像，请添加感叹号（!），然后在括号中添加替代文本，并在括号中添加图像资源的路径或 URL。您可以选择在括号中的 URL 之后添加标题。

> 示例：<br>
>
> <p>![Philadelphia's Magic Gardens. This place was so cool!](/assets/images/index.png "Philadelphia's Magic Gardens")</p>
>
> - 中括号中的文本为`<img>` <prib>alt</prib> 属性。
> - 小括号引号中的文本为`<img>` <prib>title</prib> 属性。
>
> 呈现的输出如下所示：<br>
>
> ![Philadelphia's Magic Gardens. This place was so cool!](/assets/images/index.png "Philadelphia's Magic Gardens")

### 转义字符

## 扩展用法

### 表格

要添加表，请使用三个或多个连字符（---）创建每列的标题，并使用管道（|）分隔每列。您可以选择在表的任一端添加管道。

> 请尝试使用 [Markdown Tables Generator](https://www.tablesgenerator.com/markdown_tables)。使用图形界面构建表，然后将生成的 Markdown 格式的文本复制到文件中。

> 示例：<br>
>
> <p>| Syntax      | Description |</p>
> <p>| ----------- | ----------- |</p>
> <p>| Header      | Title       |</p>
> <p>| Paragraph   | Text        |</p>
>
> 呈现的输出如下所示：<br>
> | Syntax | Description |
> | ----------- | ----------- |
> | Header | Title |
> | Paragraph | Text |

### 脚注

### CSS 应用方式

#### 1. 内联样式

直接在 Markdown 元素中使用 HTML 的 style 属性来应用 CSS 样式。

```html
<span style="color: red;">红色文字</span>
```

#### 2. 嵌入式样式

在 Markdown 文件的顶部或底部插入\<style>标签，并在其中定义 CSS 规则。

```html
<style>
  h1 {
    color: blue;
  }
</style>
```

#### 3. 外部引用样式

链接到外部 CSS 文件，这在多个 Markdown 文件共享相同样式时尤其有用。

```html
<link rel="stylesheet" href="path/to/style.css" />
```

### 生成目录

#### 1. 手动生成目录

生成章节目录，我们只需要使用链接语法，将标题集中组合在一个列表中即可。

以下是一个简单的 Markdown 示例，展示了如何手动生成目录：

```md
# 目录

- [第一章](#第一章)
  - [第一节](#第一节)
  - [第二节](#第二节)
- [第二章](#第二章)

# 第一章

## 第一节

这里是内容...

## 第二节

这里是更多内容...

# 第二章

这里是第二章的内容...
```

#### 2. 自动生成目录

但通过上边的方式生成目录，我们很容易发现问题所在，目录少的时候没问题，当目录多的时候就有些繁琐了，我们需要整理维护所有的章节组成这颗导航树。

再比如我们要调整目录的位置，我们就需要动两个地方，一个是内容区域，一个是目录区域。

因此生成目录我们一般会借助一些工具，比如使用特定的 Markdown 处理器、第三方工具或插件来自动生成目录。

```md
[TOC]语法生成
```

大多数 Markdown 处理器都支持通过特定语法自动生成目录。这个特定语法就是[TOC]，在大多数 Markdown 处理器中，输入[TOC]就可以自动生成文档的目录。

要生成目录，请在段落中包含一个“[TOC]”占位符。在渲染过程中，它将被自动替换为整个文档的目录。

```md
# Markdown 目录示例

## 目录

[TOC]

## 引言

这里是引言部分的内容。

## 第一部分

### 1.1 节

这里是第一部分，第一节的内容。

### 1.2 节

这里是第一部分，第二节的内容。

## 第二部分

这里是第二部分的内容。
```

请注意，不是所有的 Markdown 处理器都支持自动生成目录，因此需要具体查看 Markdown 处理器的文档以了解它们是否支持这个功能。

#### 3. npm 语法生成

- <h3>doctoc</h3>

```shell
npm install -g doctoc
```

```md
# Markdown 目录示例

## 目录

<!-- START doctoc -->

<!-- END doctoc -->

## 引言

这里是引言部分的内容。

## 第一部分

### 1.1 节

这里是第一部分，第一节的内容。

### 1.2 节

这里是第一部分，第二节的内容。

## 第二部分

这里是第二部分的内容。
```

doctoc 工具会将目录插入到文件中包含<span style="color: #ff502c;">\<!--- START doctoc --></span>和<span style="color: #ff502c;">\<!--- END doctoc --></span>标记之间的位置。我们可以将这些标记插入到 Markdown 文件中，然后运行 doctoc 命令以生成和更新目录。

```shell
# 执行doctoc demo.md，即可为demo.md文件在文档中自动生成目录：
doctoc demo.md
```

- <h3>markdown-toc</h3>

全局安装 doctoc：

```sh
npm install -g markdown-toc
```

与 doctoc 不同的是，markdown-toc 工具会将目录插入到文件中包含<span style="color: #ff502c;">\<!-- toc --></span> 标记的位置。并且 markdown-toc 默认不自动将目录注入到文件中，需要加入参数-i。

```sh
markdown-toc -i demo.md
```
