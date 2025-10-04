import { defineConfig } from "vitepress";

import navConfig from "../public/nav.config.json";

// 技术基石
import techBasicNavConfig from "../views/技术基石/nav.json";
// 前端架构
import frontArchNavConfig from "../views/前端架构/nav.json";
// 后端架构
import backendArchNavConfig from "../views/后端架构/nav.json";
// 运维架构
import operationArchNavConfig from "../views/运维架构/nav.json";
// 经验案例
import caseStudiesNavConfig from "../views/经验案例/nav.json";
// 前沿技术
import techFrontierNavConfig from "../views/前沿技术/nav.json";
// 职业软实力
import softPowerNavConfig from "../views/职业软实力/nav.json";
// 社区资源
import communityResourceNavConfig from "../views/社区资源/nav.json";

import viteCustomConfig from "./vitepress.config";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  head: [
    ["link", { rel: "stylesheet", href: "/styles/index.css" }],
    // ["link", { rel: "stylesheet", href: "/theme/custom.css" }],
    ["link", { rel: "icon", href: "./favicon.ico" }],
  ],
  title: "Web Lion",
  description: "前端探路狮",
  base: "/",
  themeConfig: {
    siteTitle: "Web Lion",
    logo: "/logo2.svg",
    outlineTitle: "本页目录", // 设置页面大纲标题为中文
    outline: [2,3], // 大纲最大显示到二级标题（##）
    docFooter: {
      prev: "上一篇",
      next: "下一篇",
    },
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2025-present Void Wind",
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      ...navConfig.nav,
      ...techBasicNavConfig.nav,
      ...frontArchNavConfig.nav,
      ...backendArchNavConfig.nav,
      ...operationArchNavConfig.nav,
      ...caseStudiesNavConfig.nav,
      ...techFrontierNavConfig.nav,
      ...softPowerNavConfig.nav,
      ...communityResourceNavConfig.nav,
    ],
    sidebar: {
      ...navConfig.sidebar,
      ...techBasicNavConfig.sidebar,
      ...frontArchNavConfig.sidebar,
      ...backendArchNavConfig.sidebar,
      ...operationArchNavConfig.sidebar,
      ...caseStudiesNavConfig.sidebar,
      ...techFrontierNavConfig.sidebar,
      ...softPowerNavConfig.sidebar,
      ...communityResourceNavConfig.sidebar,
    },
    socialLinks: [
      { icon: "gitee", link: "https://gitee.com/basic-fort/web-lion" },
      // { icon: "github", link: "https://github.com/coding-fort/web-lion" },
      // { icon: "github", link: "https://github.com/coding-fort/web-lion" },
      // { icon: "github", link: "https://github.com/coding-fort/web-lion" },
      // { icon: "github", link: "https://github.com/coding-fort/web-lion" },
      { icon: "grapheneos", link: "/personal/index.html" }
    ],
    search: {
      provider: "local",
    },
    // siteTitle: false,
  },
  lang: "zh-CN",
  vite: { ...viteCustomConfig },
  // locales: {
  //   "/": {
  //     label: "简体中文",
  //     lang: "zh-CN",
  //     title: "文档站点",
  //     description: "这是一个中文文档站点",
  //   },
  // },
});
