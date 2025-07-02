# vuex 应用

Nuxt.js 提供了对 Vuex 的内置支持，这意味着你可以轻松地开始使用 Vuex 而不需要额外配置。

## 创建 Store

默认情况下，Nuxt.js 会尝试在 `store` 目录下寻找你的 Vuex store 文件。为了启用 Vuex store，你需要创建一个 `store/index.js` 文件：

```javascript
export const state = () => ({
  counter: 0,
});

export const mutations = {
  increment(state) {
    state.counter++;
  },
};

export const actions = {
  increment(context) {
    context.commit("increment");
  },
};

export const getters = {
  getCounter(state) {
    return state.counter;
  },
};
```

这将创建一个简单的 store，其中包含了一个名为 `counter` 的状态、一个用于递增计数器的 mutation 和 action，以及一个 getter 来获取当前的计数值。

## 访问 Store

在任何 Vue 组件中，你可以通过 `this.$store` 来访问 Vuex store。例如，要调用 `increment` 方法并显示计数器的值，可以在你的组件中这样做：

```html
<template>
  <div>
    <p>{{ counter }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
  export default {
    computed: {
      counter() {
        return this.$store.getters.getCounter;
      },
    },
    methods: {
      increment() {
        this.$store.dispatch("increment");
      },
    },
  };
</script>
```

## Nuxt 特定功能

1. **nuxtServerInit**: 如果你需要在服务端初始化一些数据到 Vuex store 中，可以定义一个 `nuxtServerInit` action。这个 action 只会在服务端运行，并且允许你在每次请求开始时填充 Vuex store。

   ```javascript
   export const actions = {
     async nuxtServerInit({ dispatch }) {
       await dispatch("modules/someModule/fetchSomeData");
     },
   };
   ```

2. **模块化 Store**: 对于大型应用，保持 store 结构清晰非常重要。Nuxt.js 支持 Vuex 模块化，允许你将 store 分割成多个文件。只需在 `store` 目录下创建与模块名称相同的文件夹，并在其中添加 `index.js` 文件即可。

   ```
   store/
   --| index.js
   --| users/
   ----| index.js
   ```

   其中 `users/index.js` 可能看起来像这样：

   ```javascript
   export const state = () => ({
     list: [],
   });

   export const mutations = {
     setUsers(state, users) {
       state.list = users;
     },
   };

   export const actions = {
     async fetchUsers({ commit }) {
       const users = await this.$axios.$get("/api/users");
       commit("setUsers", users);
     },
   };
   ```

   然后，在其他地方可以通过 `this.$store.state.users.list` 访问用户列表。

通过上述方法，你可以在 Nuxt.js 应用中高效地管理和利用 Vuex 来处理应用的状态。无论是简单的计数器还是复杂的状态逻辑，Vuex 都提供了一种强大的方式来确保你的应用状态管理既有效又易于维护。
