# Vue JSX

Vue 支持使用 JSX 语法来编写组件，这为熟悉 React 的开发者提供了一种更熟悉的方式。JSX 是一种 JavaScript 语法扩展，它允许你在 JavaScript 中写看起来像 HTML 的代码。在 Vue 中使用 JSX 可以让你更好地利用函数式编程风格，并且可以与渲染函数（`render`）结合使用，从而创建更复杂的组件逻辑。

## 1.安装和配置

要在 Vue 项目中使用 JSX，首先需要安装 `@vue/babel-plugin-jsx` 插件：

```bash
npm install @vue/babel-plugin-jsx --save-dev
```

然后在你的 `.babelrc` 或 `babel.config.js` 文件中添加插件配置：

```json
{
  "plugins": ["@vue/babel-plugin-jsx"]
}
```

如果你使用的是 Vue CLI 创建的项目，可以通过命令行工具添加对 JSX 的支持：

```bash
vue add jsx
```

## 2.使用 JSX 编写组件

[如何在 Vue 中书写 JSX](https://blog.csdn.net/weixin_34290631/article/details/91463798)

### 基本用法

你可以直接在 `.vue` 文件的 `<script>` 标签内或纯 JS/TS 文件中使用 JSX 语法定义组件。以下是一个简单的例子：

```javascript
import { defineComponent } from "vue";

export default defineComponent({
  name: "MyComponent",
  props: {
    msg: String,
  },
  setup(props) {
    return () => (
      <div class="my-component">
        <h1>{props.msg}</h1>
      </div>
    );
  },
});
```

### 函数式组件

JSX 也特别适合用来编写无状态的函数式组件：

```javascript
const MyFunctionalComponent = (props) => (
  <div class="functional-component">
    <p>This is a functional component with message: {props.message}</p>
  </div>
);
```

### 绑定事件处理器

你可以在 JSX 中使用标准的 DOM 事件监听器，如 `onClick`、`onInput` 等等：

```javascript
setup() {
  const handleClick = () => {
    alert('Button clicked!');
  };

  return () => (
    <button onClick={handleClick}>Click me</button>
  );
}
```

### 条件渲染

使用三元运算符或逻辑表达式来进行条件渲染：

```javascript
setup(props) {
  return () => (
    <div>
      {props.show ? <p>Visible content</p> : null}
    </div>
  );
}
```

### 列表渲染

通过映射数组来生成列表项：

```javascript
setup() {
  const items = ['Item 1', 'Item 2', 'Item 3'];

  return () => (
    <ul>
      {items.map(item => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
```

## 3.JSX 中的样式绑定

在 JSX 中，你可以使用对象字面量的方式来绑定样式：

```javascript
setup() {
  const activeStyle = { color: 'green', fontWeight: 'bold' };

  return () => (
    <p style={activeStyle}>Styled paragraph</p>
  );
}
```

## 4.类名绑定

对于类名绑定，推荐使用 `classNames` 库或者直接构建一个包含类名的对象：

```javascript
import classNames from 'classnames';

setup(props) {
  const isActive = true;
  const hasError = false;

  return () => (
    <div class={classNames('default-class', { active: isActive, error: hasError })}>
      Class binding example
    </div>
  );
}
```

## 5.JSX 中使用插槽

### 默认插槽/具名插槽

```vue
<script>
  let childComp = {
    render() {
      return (
        <div>
          <h1>默认插槽</h1>
          <div>{this.$slots.default}</div>
          <h1>具名插槽</h1>
          <div>{this.$slots.demo}</div>
        </div>
      );
    },
  };
  export default {
    components: {
      childComp,
    },
    render() {
      return (
        <child-comp>
          // 默认插槽
          <div>这是默认插槽</div>
          // 具名插槽
          <div slot="demo">这是具名插槽</div>
        </child-comp>
      );
    },
  };
</script>
```

### 作用域插槽

```vue
<script>
  let childComp = {
    render() {
      return (
        <div>
          <h1>作用域插槽</h1>
          {this.$scopedSlots.demo({ name: "zhangsan", age: 21 })}
        </div>
      );
    },
  };
  export default {
    render() {
      const scopedSlots = {
        demo: (scope) => {
          return (
            <div>
              {scope.name}-{scope.age}
            </div>
          );
        },
      };
      return <child-comp scopedSlots={scopedSlots}></child-comp>;
    },
  };
</script>
```

### 多种类型插槽混合使用

示例：element-ui TableColumn 操作列插槽应用

```vue
<script>
    // element-ui Table 示意
  let elTable = {
    render(){
      return (
        <table class="el-table">
          // 默认插槽
          <slot></slot>
        </table>
      )
    }
  }
  // element-ui TableColumn 示意
  let elTableColumn = {
    render() {
      return (
        <div class="el-table-column">
          // 默认插槽
          <slot></slot>
        </div>
      );
    },
  };
  // 封装element-ui Table
  let csTable = {
    render(){
      const scopedSlots = {
        // 获取TableColumn 默认插槽作用域
        default: scope => {
          return (
          // 具名插槽传值
          <div>{this.$scopedSlots.operate(scope)}</div>
          )
        }
      }
      return(
        <el-table class="cs-table">
          <el-table-column
            fixed="right"
            label="操作"
            // 作用域插槽
            scopedSlots={scopedSlots}
          ></el-table-column>
        </el-table>
      )
    }
  }
  export default {
    render() {
      return (
        <cs-table>
          // 具名插槽
          <template slot="operate" slot-scope="{row, column, $index}">
            <button @click="handleClick(row)">详情-{$index}</button>
          </template>
        </-table>
      );
    },
  };
</script>
```

## 6.注意事项

- **属性命名**：在 JSX 中，HTML 属性应该使用驼峰命名法（例如 `class` -> `className`），并且一些特殊的属性名称可能需要转换（如 `for` -> `htmlFor`）。
- **静态属性**：对于不会改变的静态属性，可以直接写在标签上；而对于动态属性，则应使用花括号包裹起来。
- **类型检查**：如果项目中启用了 TypeScript，确保正确地为 JSX 元素指定类型，以便获得更好的开发体验和错误提示。

## 总结

Vue 的 JSX 语法提供了一种强大而灵活的方式来编写组件，特别是当你想要采用函数式的编程方式时。通过上述示例，你应该能够开始在自己的项目中尝试使用 JSX。如果有更多问题或需要进一步的帮助，请随时告诉我！
