# BEM\_策略

BEM（Block Element Modifier），一种 css 命名规范，一般协作.block\_\_element--modifier

> 说明：
>
> - B（block）：独立的页面及逻辑单元。b-name
> - E（element）：块中的组成部分，不能脱离存在，一般为元素的功能单词或元素标签。\_\_element
> - M（modifier）：修饰符，一般为某个元素的样式或处于的一种状态。--modifier

```html
<!-- 示例 -->
<div class="b-popup-modal">
  <div class="b-popup-modal__content">
    <div class="b-popup-modal__header">
      <span class="b-popup-modal__title">标题</span>
      <button class="b-popup-modal__close b-popup-modal__close--default">
        X
      </button>
    </div>
    <div class="b-popup-modal__body"></div>
    <div class="b-popup-modal__footer"></div>
  </div>
</div>
```

# 通用类名

### 分类命名

使用单个字母加上"-"为前缀

- 布局（grid）（.g-）
- 模块（module）（.m-）
- 元件（unit）（.u-）
- 功能（function）（.f-）
- 皮肤（skin）（.s-）
- 状态（.z-）

#### 1.布局（.g-）

| 语义   | 命名     | 简写     | 语义       | 命名  | 简写 |
| :----- | :------- | :------- | :--------- | :---- | ---- |
| 文档   | doc      | doc      | 头部       | head  | hd   |
| 主体   | body     | bd       | 尾部       | foot  | ft   |
| 主栏   | main     | mn       | 主栏子容器 | mainc | mnc  |
| 侧栏   | side     | sd       | 侧栏子容器 | sidec | sdc  |
| 盒容器 | wrap/box | wrap/box |            |       |      |

#### 2.模块（.m-）、原件（.u-）

| 语义   | 命名         | 简写  | 语义   | 命名       | 简写  |
| :----- | :----------- | :---- | :----- | :--------- | ----- |
| 导航   | nav          | nav   | 子导航 | subnav     | snav  |
| 面包屑 | crumb        | crm   | 菜单   | menu       | menu  |
| 选项卡 | tab          | tab   | 标题区 | head/title | hd/tt |
| 内容区 | body/content | bd/ct | 列表   | list       | lst   |
| 表格   | table        | tb    | 表单   | form       | fm    |
| 热点   | hot          | hot   | 排行   | top        | top   |
| 登录   | login        | log   | 标志   | logo       | logo  |
| 广告   | advertise    | ad    | 搜索   | search     | sch   |
| 幻灯   | slide        | sld   | 提示   | tips       | tips  |
| 帮助   | help         | help  | 新闻   | news       | news  |
| 下载   | download     | dld   | 注册   | regist     | reg   |
| 投票   | vote         | vote  | 版权   | copyright  | cprt  |
| 结果   | result       | rst   | 标题   | title      | tt    |
| 按钮   | button       | btn   | 输入   | input      | ipt   |

#### 3.功能（.f-）

| 语义     | 命名            | 简写 | 语义     | 命名                | 简写 |
| :------- | :-------------- | :--- | :------- | :------------------ | ---- |
| 浮动清除 | clearboth       | cb   | 向左浮动 | floatleft           | fl   |
| 向右浮动 | floatright      | fr   | 内联块级 | inlineblock         | ib   |
| 文本居中 | textaligncenter | tac  | 文本居左 | textalignleft       | tal  |
| 文本居右 | textalignright  | tar  | 垂直居中 | verticalalignmiddle | vam  |
| 一出隐藏 | overflowhidden  | oh   | 完全消失 | displaynone         | dn   |
| 字体大小 | fontsize        | fs   | 字体粗细 | fontweight          | fw   |

#### 4.皮肤（.s-）

| 语义     | 命名        | 简写 | 语义     | 命名               | 简写 |
| :------- | :---------- | :--- | :------- | :----------------- | ---- |
| 字体颜色 | fontcolor   | fc   | 背景颜色 | backgroundcolor    | bgc  |
| 背景     | background  | bg   | 背景图片 | backgroundimage    | bgi  |
| 边框颜色 | bordercolor | bdc  | 背景定位 | backgroundposition | bgp  |

#### 5.状态（.z-）

| 语义 | 命名     | 简写 | 语义   | 命名     | 简写  |
| :--- | :------- | :--- | :----- | :------- | ----- |
| 选中 | selected | sel  | 当前   | current  | crt   |
| 显示 | show     | show | 隐藏   | hide     | hide  |
| 打开 | open     | open | 关闭   | close    | close |
| 出错 | error    | err  | 不可用 | disabled | dis   |
