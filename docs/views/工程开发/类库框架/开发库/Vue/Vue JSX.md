# Vue JSX

[如何在 Vue 中书写 JSX](https://blog.csdn.net/weixin_34290631/article/details/91463798)

> Vue 中可以通过 render 函数代替 template 来获得完全的 JavaScript 编程能力。render 函数在某些场景下可以有效地简化代码。我们可以通过 createElement 函数来编写 render 函数，但是 createElement 的写法过于繁琐，逻辑稍微复杂一点就会产生一堆代码，而且不易阅读。官方文档中指出可以通过 Babel 插件，在 render 函数中使用 JSX 语法，让代码更接近模板语法。

## 引入插件

默认的@vue/babel-preset-app 已经包含了转化 JSX 语法的插件。

```bash
npm install @vue/babel-preset-app
```

## 书写 JSX

### template 方式

```vue
<template>
  <div>
    <p
      id="helloWorld"
      :class="{ 'hello-world': true }"
      :style="{ color: 'red' }"
      @click="onClick"
    >
      {{ this.msg }}
    </p>
    <el-button>submit</el-button>
  </div>
</template>
<script>
import { Button } from "element-ui";
export default {
  components: {
    "el-button": Button,
  },
  data() {
    return {
      msg: "Hello World",
    };
  },
  methods: {
    onClick() {
      alert("Hello World");
    },
  },
};
</script>
```

### JSX 方式

```vue
<script>
import { Button } from "element-ui";
export default {
  components: {
    "el-button": Button,
  },
  data() {
    return {
      msg: "Hello World",
    };
  },
  methods: {
    onClick() {
      alert("Hello World");
    },
  },
  render() {
    return (
      <div>
        <p
          id="helloWorld"
          class={{ "hello-world": true }}
          style={{ color: "red" }}
          onClick={this.onClick}
        >
          {this.msg}
        </p>
        <el-button type="primary" size="medium" round loading>
          按钮
        </el-button>
      </div>
    );
  },
};
</script>
```

## JSX VUE SLOTS

[JSX 的默认插槽、具名插槽、作用域插槽使用](https://www.freesion.com/article/18851349965/)

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

### JSX 引入 LESS

### JSX 修饰符
