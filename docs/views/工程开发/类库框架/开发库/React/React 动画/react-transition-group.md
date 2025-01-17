# react-transition-group

`react-transition-group` 是一个用于在 React 应用中添加过渡效果的库，它使得实现元素进入、离开以及状态变化时的动画变得非常简单。这个库提供了一套直观的 API 来定义和控制动画，同时支持 CSS 和 JavaScript 动画两种方式。下面将详细介绍 `react-transition-group` 的各个核心组件及其使用方法。

## 安装

首先，你需要安装 `react-transition-group`：

```bash
npm install react-transition-group
# 或者
yarn add react-transition-group
```

## 核心组件

### 1. `<Transition>`

这是最基本的组件，用于定义单个元素的进入和离开动画。你需要指定一个 `in` 属性来控制元素是否应该出现在页面上，并且可以通过监听事件（如 `onEnter`, `onEntering`, `onEntered`, `onExit`, `onExiting`, `onExited`）来自定义动画行为。

#### 生命周期回调

- `onEnter`: 当组件准备进入时调用。
- `onEntering`: 在 `onEnter` 后立即调用，通常用于开始动画。
- `onEntered`: 当组件完成进入动画后调用。
- `onExit`: 当组件准备退出时调用。
- `onExiting`: 在 `onExit` 后立即调用，通常用于开始退出动画。
- `onExited`: 当组件完成退出动画后调用。

#### 示例代码

```jsx
import { Transition } from "react-transition-group";

const Fade = ({ in: isIn, children }) => (
  <Transition in={isIn} timeout={300}>
    {(state) => (
      <div
        style={{
          transition: "opacity 300ms ease-in-out",
          opacity: state === "entered" ? 1 : 0,
        }}
      >
        {children}
      </div>
    )}
  </Transition>
);
```

### 2. `<CSSTransition>`

如果你更喜欢使用 CSS 类来进行动画，那么 `CSSTransition` 是更好的选择。它会在不同的生命周期阶段自动添加特定的 CSS 类名，让你可以通过样式表来定义动画效果。

#### 必要的 CSS 类名

- `${name}-enter`: 初始状态，当元素即将进入时应用。
- `${name}-enter-active`: 进入动画激活时应用。
- `${name}-exit`: 初始状态，当元素即将退出时应用。
- `${name}-exit-active`: 退出动画激活时应用。

#### 示例代码

```jsx
import { CSSTransition } from 'react-transition-group';

const Fade = ({ in: isIn, children }) => (
  <CSSTransition in={isIn} timeout={300} classNames="fade">
    <div>{children}</div>
  </CSSTransition>
);

// 在你的 CSS 文件中：
.fade-enter {
  opacity: 0;
}
.fade-enter-active {
  opacity: 1;
  transition: opacity 300ms;
}
.fade-exit {
  opacity: 1;
}
.fade-exit-active {
  opacity: 0;
  transition: opacity 300ms;
}
```

### 3. `<SwitchTransition>`

当需要在同一位置切换多个元素时，`SwitchTransition` 可以确保只有一个子元素处于活动状态，并且可以在旧元素消失之前开始新元素的出现动画。它有三种模式：`out-in`（默认），`in-out` 和 `once`。

- `out-in`: 先让当前元素完全退出，再让新元素进入。
- `in-out`: 新元素开始进入的同时，旧元素也开始退出。
- `once`: 只对第一次转换应用动画。

#### 示例代码

```jsx
import { SwitchTransition, CSSTransition } from "react-transition-group";

const Toggle = ({ toggle, children }) => (
  <SwitchTransition mode="out-in">
    <CSSTransition key={toggle ? "yes" : "no"} timeout={300} classNames="fade">
      <div>{toggle ? children[0] : children[1]}</div>
    </CSSTransition>
  </SwitchTransition>
);
```

### 4. `<TransitionGroup>`

对于动态列表或集合，`TransitionGroup` 是非常有用的。它可以跟踪其子组件的增减，并为每个子组件应用适当的过渡效果。这非常适合处理列表项的添加和移除动画。

#### 示例代码

```jsx
import { TransitionGroup, CSSTransition } from "react-transition-group";

const List = ({ items }) => (
  <TransitionGroup>
    {items.map((item) => (
      <CSSTransition key={item.id} timeout={300} classNames="item">
        <div>{item.name}</div>
      </CSSTransition>
    ))}
  </TransitionGroup>
);
```

## 高级功能

### 自定义时间轴

你可以通过 `timeout` 属性自定义每个阶段的时间长度。例如，你可以设置进入时间为 500 毫秒，而退出时间为 300 毫秒。

```jsx
<CSSTransition in={isIn} timeout={{ enter: 500, exit: 300 }} classNames="fade">
  <div>{children}</div>
</CSSTransition>
```

### 使用 JavaScript 动画

除了 CSS 动画外，你还可以使用 JavaScript 动画库（如 GSAP 或 Anime.js）。只需在生命周期回调中执行相应的动画逻辑即可。

```jsx
import { Transition } from "react-transition-group";
import anime from "animejs";

const Fade = ({ in: isIn, children }) => (
  <Transition in={isIn} timeout={0}>
    {(state) => {
      const nodeRef = useRef(null);

      useEffect(() => {
        if (nodeRef.current) {
          switch (state) {
            case "entering":
              anime({
                targets: nodeRef.current,
                opacity: [0, 1],
                duration: 300,
              });
              break;
            case "exiting":
              anime({
                targets: nodeRef.current,
                opacity: [1, 0],
                duration: 300,
              });
              break;
            default:
              break;
          }
        }
      }, [state]);

      return <div ref={nodeRef}>{children}</div>;
    }}
  </Transition>
);
```

## 最佳实践

- **避免过度使用**：虽然动画可以提升用户体验，但过多或不恰当的动画可能会导致性能问题或用户不适。确保只在必要的地方使用动画。
- **保持一致性**：为了提供连贯的用户体验，尽量在整个应用程序中保持一致的动画风格和时长。
- **考虑无障碍性**：某些用户可能关闭了浏览器中的动画效果，或者他们使用的设备性能有限。因此，不要依赖于动画来传达重要信息。

## 总结

`react-transition-group` 提供了一个强大而灵活的方式来为 React 应用添加过渡效果。通过合理利用它的各个组件，你可以简化动画逻辑，提升用户体验。无论你是想要实现简单的淡入淡出效果还是更复杂的动画序列，这个库都能满足你的需求。
