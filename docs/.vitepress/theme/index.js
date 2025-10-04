// .vitepress/theme/index.js
import DefaultTheme from "vitepress/theme";
import { h } from 'vue';
import "../styles/index.css";
import "../styles/theme.css";

export default {
  ...DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      "nav-bar-content-after": () =>
        h("div", { class: "custom-social" }, [
          // 这里放你的额外社交链接或下拉菜单组件
        ]),
    });
  },
};
