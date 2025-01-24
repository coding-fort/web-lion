# Vuex

Vuex 是 Vue.js 的官方状态管理库，它帮助我们更高效地管理复杂应用中的全局状态。通过集中存储和管理应用的所有组件的状态，Vuex 提供了一种可预测的状态管理模式，使得状态变化更加透明且易于调试。以下是关于 Vuex 的详细介绍，包括其核心概念、安装配置以及如何在项目中使用。

## 1.Vuex 核心概念

1. **State**：存放应用的全局状态数据。所有的状态都必须通过唯一的来源进行管理，即 Vuex store 中的 state。
2. **Getter**：类似于 Vue 组件中的计算属性，用于从 state 中派生出一些状态，比如过滤后的列表项或复杂的计算结果。
3. **Mutation**：唯一可以改变 state 的地方。每个 mutation 都有一个字符串类型的事件类型 (type) 和一个回调函数。这个回调函数就是我们实际进行状态变更的地方，它接收 state 作为第一个参数。
4. **Action**：用来提交 mutation，但与 mutation 不同的是，action 可以包含任意异步操作。actions 同样接受一个 context 对象作为参数，该对象包含了与 store 相关的方法和属性。
5. **Module**：为了更好地组织代码，Vuex 允许我们将 store 分割成模块。每个模块拥有自己的 state、mutation、action、getter 和嵌套子模块——从而使得大型项目的开发更为简单。

## 2.安装 Vuex

首先，确保你已经安装了 Vuex。可以通过 npm 或 yarn 来安装：

```bash
npm install vuex@3 --save
```

或者

```bash
yarn add vuex@3
```

注意我们指定了版本 `3`，因为这是兼容 Vue 2 的版本。对于 Vue 3，你应该使用 Vuex 4。

## 3.创建 Vuex Store

接下来，在你的项目中创建一个 Vuex store。通常会创建一个名为 `store.js` 或 `store/index.js` 的文件来定义 store。

### 示例：基本 Vuex Store 配置

```javascript
// store/index.js
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 0,
  },
  mutations: {
    increment(state) {
      state.count++;
    },
  },
  actions: {
    increment({ commit }, payload) {
      commit("increment", payload);
    },
  },
  getters: {
    getCount: (state) => state.count,
  },
});
```

## 4.在主应用文件中引入并使用 Store

然后，在你的主应用文件（通常是 `main.js`）中引入并使用这个 store 实例：

```javascript
// main.js
import Vue from "vue";
import App from "./App.vue";
import store from "./store";

new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app");
```

## 5.在组件中访问 State 和 Dispatch Actions

现在可以在任何组件中访问 state 和 dispatch actions 了。有几种方式可以做到这一点：

### 使用 `mapState`, `mapGetters`, `mapActions`, `mapMutations` 辅助函数

这些辅助函数可以帮助简化对 state、getters 和 actions 的映射过程。

```javascript
// MyComponent.vue
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  computed: {
    ...mapState(["count"]),
    ...mapGetters(["getCount"]),
  },
  methods: {
    ...mapActions(["increment"]),
  },
};
```

### 直接使用 `$store` 属性

也可以直接通过 `this.$store` 访问 store 的实例，适用于少量的状态或动作。

```javascript
// MyComponent.vue
export default {
  computed: {
    count() {
      return this.$store.state.count;
    },
  },
  methods: {
    increment() {
      this.$store.dispatch("increment");
    },
  },
};
```

## 6.处理异步逻辑

当涉及到异步操作时（例如 API 请求），应该在 actions 中处理。下面是一个例子，展示了如何使用 axios 发起 HTTP 请求，并更新 state。

```javascript
// store/index.js
import axios from "axios";

export default new Vuex.Store({
  // ...
  actions: {
    async fetchData({ commit }) {
      try {
        const response = await axios.get("/api/data");
        commit("setData", response.data);
      } catch (error) {
        console.error("There was an error fetching the data!", error);
      }
    },
  },
  mutations: {
    setData(state, data) {
      state.data = data;
    },
  },
});
```

## 7.模块化 Store

随着应用的增长，将 store 拆分为多个模块可以使代码更易于维护。每个模块都有自己的 state、mutations、actions 和 getters。

```javascript
// store/modules/user.js
const user = {
  state: () => ({
    name: ''
  }),
  mutations: {
    setName(state, name) {
      state.name = name;
    }
  },
  actions: {
    async fetchName({ commit }) {
      // 异步获取用户名字...
      commit('setName', 'John Doe');
    }
  },
  getters: {
    userName: state => state.name
  }
};

export default user;

// store/index.js
import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user
  }
});
```

## 总结

以上是关于如何在 Vue 2 项目中设置和使用 Vuex 的简要介绍。通过 Vuex，你可以有效地管理和共享应用的状态，确保状态的变化是可预测且易于追踪的。如果你有更多问题或需要进一步的帮助，请随时告诉我！
