# Vue 通信

Vue 组件之间的通信是构建复杂应用程序时的关键部分。Vue 提供了多种机制来实现组件间的通信，确保数据能够在父子组件、兄弟组件以及跨层级的组件之间流动。以下是 Vue 中常用的几种通信方式：

## 1. Props (父 -> 子)

**Props** 是从父组件传递给子组件的数据属性。它们允许父组件向子组件发送信息。

### 示例

```html
<!-- 父组件 -->
<template>
  <child-component :message="parentMessage"></child-component>
</template>

<script>
  import ChildComponent from "./ChildComponent.vue";

  export default {
    components: { ChildComponent },
    data() {
      return {
        parentMessage: "Hello from parent!",
      };
    },
  };
</script>
```

```html
<!-- 子组件 -->
<template>
  <p>{{ message }}</p>
</template>

<script>
  export default {
    props: ["message"],
  };
</script>
```

## 2. Events (子 -> 父)

**自定义事件** 允许子组件向父组件发送消息或通知。子组件使用 `$emit` 触发事件，父组件通过 `v-on` 监听这些事件。

### 示例

```html
<!-- 子组件 -->
<template>
  <button @click="sendMessage">Send Message</button>
</template>

<script>
  export default {
    methods: {
      sendMessage() {
        this.$emit("custom-event", "Message from child");
      },
    },
  };
</script>
```

```html
<!-- 父组件 -->
<template>
  <child-component @custom-event="handleMessage"></child-component>
</template>

<script>
  export default {
    methods: {
      handleMessage(message) {
        console.log(message); // 输出: Message from child
      },
    },
  };
</script>
```

## 3. Provide / Inject (祖先 -> 后代)

**Provide 和 Inject** 提供了一种更灵活的方式，在多层嵌套的组件树中共享数据，而无需逐层传递 props。

### 示例

```javascript
// 祖先组件
export default {
  provide() {
    return {
      sharedData: this.someData
    };
  },
  data() {
    return {
      someData: 'Shared Data'
    };
  }
};

// 后代组件
export default {
  inject: ['sharedData'],
  mounted() {
    console.log(this.sharedData); // 输出: Shared Data
  }
};
```

## 4. Vuex (全局状态管理)

对于复杂的大型应用，**Vuex** 是官方推荐的状态管理模式。它提供了一个集中式存储（store），可以跨多个组件访问和修改状态。

### 示例

```javascript
// store.js
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
    increment({ commit }) {
      commit("increment");
    },
  },
});

// 在 main.js 或根实例中安装 Vuex store
import store from "./store";

new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app");

// 在任何组件中使用
this.$store.state.count;
this.$store.dispatch("increment");
```

## 5. Event Bus (全局事件总线)

对于非父子关系的组件通信，可以创建一个 **事件总线** 来发布和订阅事件。不过，这种方法在 Vue 3 中不推荐，建议使用 Vuex 或者 Composition API 的 `provide/inject`。

### 示例

```javascript
// 创建事件总线
const eventBus = new Vue();

// 发布事件
eventBus.$emit("some-event", data);

// 订阅事件
eventBus.$on("some-event", callback);
```

## 6. 插槽 (内容分发)

**插槽** 允许父组件向子组件传递 HTML 内容，适用于模板级别的定制化需求。

### 示例

```html
<!-- 子组件 -->
<template>
  <div class="slot-container">
    <slot></slot>
  </div>
</template>

<!-- 父组件 -->
<template>
  <child-component>
    <p>This content is passed to the child component's slot.</p>
  </child-component>
</template>
```

## 7. Composition API (Vue 3)

在 Vue 3 中引入的 **Composition API** 提供了一种更灵活的方式来组织和复用逻辑代码，特别是在处理复杂的业务逻辑时非常有用。

### 示例

```javascript
// setup 函数中使用 ref 和 reactive
import { ref, reactive } from "vue";

export default {
  setup() {
    const count = ref(0);
    const obj = reactive({ text: "Hello" });

    function increment() {
      count.value++;
    }

    return {
      count,
      obj,
      increment,
    };
  },
};
```

## 总结

选择哪种通信方式取决于您的具体需求和项目的规模：

- **简单父子组件**：使用 `props` 和 `events`。
- **跨层级组件**：使用 `provide/inject` 或 Vuex。
- **全局状态管理**：使用 Vuex。
- **非父子关系组件**：考虑使用 Vuex 或 Composition API。

通过合理运用这些通信方式，您可以构建更加模块化、可维护且高效的 Vue 应用程序。如果有任何具体问题或需要进一步的帮助，请随时告诉我！
