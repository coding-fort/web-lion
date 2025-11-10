import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'

export default {
  ...DefaultTheme,
  // 自定义导航栏右侧内容
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => h('div', { class: 'custom-social' }, [
        // 这里放你的额外社交链接或下拉菜单组件
      ])
    })
  }
}