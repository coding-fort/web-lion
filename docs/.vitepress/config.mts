import { defineConfig } from "vitepress";

import navConfig from "./public/nav.config.json";
// 编程基础
import codingBasicNavConfig from "../views/编程基础/nav.json";
// 工程开发
import engineeringDevelopmentNavConfig from "../views/工程开发/nav.json";
// 计算机基础
import computerBasicNavConfig from "../views/计算机基础/nav.json";
// 架构基础
import backendKnowledgeNavConfig from "../views/架构基础/nav.json";
// 领域分支
import domainBranchNavConfig from "../views/领域分支/nav.json";
// 软技能
import softSkillNavConfig from "../views/软技能/nav.json";
// 社区发展
import communityDevelopmentNavConfig from "../views/社区发展/nav.json";
// 实战示例
import codeDemoNavConfig from "../views/实战示例/nav.json";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  head: [["link", { rel: "icon", href: "/assets/images/favicon.ico" }]],
  title: "CODING FORT | 前端知识框架",
  description: "前端知识框架",
  base: "/coding-fort-vp/",
  themeConfig: {
    outlineTitle: "本页目录", // 设置页面大纲标题为中文
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      ...navConfig.nav,
      ...codingBasicNavConfig.nav,
      ...engineeringDevelopmentNavConfig.nav,
      ...computerBasicNavConfig.nav,
      ...backendKnowledgeNavConfig.nav,
      ...domainBranchNavConfig.nav,
      ...softSkillNavConfig.nav,
      ...communityDevelopmentNavConfig.nav,
      ...codeDemoNavConfig.nav,
    ],
    sidebar: {
      ...navConfig.sidebar,
      ...codingBasicNavConfig.sidebar,
      ...engineeringDevelopmentNavConfig.sidebar,
      ...computerBasicNavConfig.sidebar,
      ...backendKnowledgeNavConfig.sidebar,
      ...domainBranchNavConfig.sidebar,
      ...softSkillNavConfig.sidebar,
      ...communityDevelopmentNavConfig.sidebar,
      ...codeDemoNavConfig.sidebar,
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
    search: {
      provider: "local",
    },
  },
  locales: {
    "/": {
      label: "简体中文",
      lang: "zh-CN",
      title: "文档站点",
      description: "这是一个中文文档站点",
    },
  },
});
