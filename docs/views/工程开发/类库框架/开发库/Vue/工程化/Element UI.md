# Element UI.md

## 日期时间控件

### DatePicker

> 【异常说明】[el-data-picker 报错](https://blog.csdn.net/qq_45225759/article/details/125860444)
>
> **Vue 中使用 el-data-picker 报错 Avoid mutating a prop directly since the value will be overwritten...**
>
> 锁定组件，发现是 el-date-picker 组件抛出的警告。通过在 github 上搜索，最终找到了答案
> 问题出在了这个 PR #21806 增加了 props placement 用来适应位置，但是之前的代码 created 时有给 placement 赋值。
> this.placement = PLACEMENT_MAP[this.align] || PLACEMENT_MAP.left;
> 说白了之前 placement 是 data 的对象，现在变成 props 了，然后修改就报错了。
>
> > 解决：
> > 修改版本到 2.15.8
> >
> > ```bash
> > // 注意：package.json中不要【^】,否则还会报错
> > npm install element-ui@2.15.8 -s
> > ```
