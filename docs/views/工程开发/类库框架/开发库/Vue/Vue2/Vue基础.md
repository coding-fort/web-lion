# Vue 基础

## 1.Vue 基础

- vue 中生命周期函数
- vue 的模板语法
- 计算属性，方法与侦听器
- 计算属性的 setter 和 getter
- 样式绑定，条件与列表渲染
- vue 中的 set 方法
- 事件与表单绑定

## 2.Vue 的组件

- 组件使用的细节点
- 父子组件传值与组件参数校验
- 原生事件绑定与非 props 特性
- 使用 bus 进行非父子组件间传值
- 插槽的使用
- 动态组件

## 3.Vue 中的动画

- Vue 中的 CSS 动画原理
- Vue 中使用 animate.css 库
- Vue 中同时使用过渡和动画效果
- Vue 中使用 Velocity.js 库
- Vue 中多组件和列表过渡
- Vue 中动画的封装

## 4.基础使用

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Simple Vue App</title>
    <!-- 引入 Vue.js -->
    <script src="https://cdn.jsdelivr.net/npm/vue@2"></script>
  </head>
  <body>
    <div id="app">
      <h1>{{ message }}</h1>
      <input
        v-model="newTodo"
        @keyup.enter="addTodo"
        placeholder="Add a new todo"
      />
      <ul>
        <li v-for="(todo, index) in todos" :key="index">
          {{ todo }}
          <button @click="removeTodo(index)">Remove</button>
        </li>
      </ul>
    </div>

    <!-- Vue 实例化脚本 -->
    <script>
      new Vue({
        el: "#app",
        data: {
          message: "Welcome to your To-Do List!",
          newTodo: "",
          todos: [],
        },
        methods: {
          addTodo() {
            if (this.newTodo.trim()) {
              this.todos.push(this.newTodo);
              this.newTodo = ""; // 清空输入框
            }
          },
          removeTodo(index) {
            this.todos.splice(index, 1);
          },
        },
      });
    </script>
  </body>
</html>
```
