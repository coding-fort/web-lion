# connect

在 `dva.js` 中，`connect` 是一个高阶组件（Higher Order Component, HOC），用于将 React 组件与 dva 的全局 store 连接起来。通过 `connect`，你可以让组件访问 store 中的状态，并且可以 dispatch actions 来改变状态。尽管 dva 推荐使用 Hooks API (`useSelector` 和 `useDispatch`) 来替代传统的 `connect`，但在某些情况下，特别是对于类组件或需要更复杂的映射逻辑时，`connect` 仍然是一个非常有用的功能。

## 使用 `connect`

### 基本用法

`connect` 接受两个主要参数：

1. **`mapStateToProps`**：函数，接收整个应用的 state 作为参数，返回一个对象，该对象的属性会被合并到组件的 props 中。
2. **`mapDispatchToProps`**：可以是函数也可以是对象。如果是函数，它接收 `dispatch` 函数作为参数并返回一个对象；如果是对象，则其键值对会直接被绑定到 `dispatch` 上。

#### 示例：基本用法

```javascript
import React from "react";
import { connect } from "dva";

function Counter({ count, increment, decrement }) {
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
}

const mapStateToProps = (state) => ({
  count: state.example.count,
});

const mapDispatchToProps = {
  increment: () => ({ type: "example/increment" }),
  decrement: () => ({ type: "example/decrement" }),
};

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
```

在这个例子中：

- `mapStateToProps` 将 `state.example.count` 映射到了 `Counter` 组件的 `props` 中。
- `mapDispatchToProps` 将 `increment` 和 `decrement` 动作映射为可以直接调用的方法。

### 类组件示例

如果你正在使用类组件，`connect` 的用法也是一样的。

#### 示例：类组件

```javascript
import React, { Component } from "react";
import { connect } from "dva";

class Counter extends Component {
  render() {
    const { count, increment, decrement } = this.props;
    return (
      <div>
        <p>Count: {count}</p>
        <button onClick={increment}>Increment</button>
        <button onClick={decrement}>Decrement</button>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  count: state.example.count,
});

const mapDispatchToProps = {
  increment: () => ({ type: "example/increment" }),
  decrement: () => ({ type: "example/decrement" }),
};

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
```

## 高级用法

### 省略 `mapStateToProps` 或 `mapDispatchToProps`

如果不需要映射 state 或 actions，可以省略对应的参数。

#### 示例：仅映射 actions

```javascript
import React from "react";
import { connect } from "dva";

function Counter({ increment, decrement }) {
  return (
    <div>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
}

const mapDispatchToProps = {
  increment: () => ({ type: "example/increment" }),
  decrement: () => ({ type: "example/decrement" }),
};

export default connect(null, mapDispatchToProps)(Counter);
```

### 使用对象形式的 `mapDispatchToProps`

你可以直接传递一个包含 action creators 的对象给 `connect`，这样就不需要手动绑定 `dispatch`。

#### 示例：对象形式的 `mapDispatchToProps`

```javascript
import React from "react";
import { connect } from "dva";
import * as exampleActions from "./models/example";

function Counter({ count, ...actions }) {
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={actions.increment}>Increment</button>
      <button onClick={actions.decrement}>Decrement</button>
    </div>
  );
}

const mapStateToProps = (state) => ({
  count: state.example.count,
});

export default connect(mapStateToProps, exampleActions)(Counter);
```

## 使用 Hooks 替代 `connect`

从 React v16.8 开始，React 引入了 Hooks，使得函数组件可以直接访问 Redux store，而无需使用 `connect`。dva 支持这些 Hooks，如 `useSelector` 和 `useDispatch`。

#### 示例：使用 Hooks

```javascript
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "dva";
import styles from "./Home.module.css";

function Home() {
  const dispatch = useDispatch();
  const count = useSelector((state) => state.example.count);

  useEffect(() => {
    dispatch({ type: "example/incrementAsync" });
  }, [dispatch]);

  return (
    <div className={styles.home}>
      <p>Count: {count}</p>
      <button onClick={() => dispatch({ type: "example/increment" })}>
        Increment
      </button>
      <button onClick={() => dispatch({ type: "example/decrement" })}>
        Decrement
      </button>
    </div>
  );
}

export default Home;
```

## 总结

- **`connect`** 是一个高阶组件，用于将 React 组件与 dva 的全局 store 连接起来。
- 它允许你通过 `mapStateToProps` 和 `mapDispatchToProps` 将 state 和 actions 映射到组件的 props。
- 对于函数组件，推荐使用 Hooks (`useSelector` 和 `useDispatch`) 来替代 `connect`，以简化代码并提高可读性。
- `connect` 在处理类组件或需要更复杂映射逻辑的情况下仍然非常有用。
