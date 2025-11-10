# Jest 基础介绍

Jest 是由 Facebook 开发的一款开源 JavaScript 测试框架，专注于简化测试流程，提供了一套完整的测试解决方案，包括测试运行、断言、 mocking（模拟）、代码覆盖率分析等功能。它开箱即用，对 React、Vue 等主流前端框架有良好支持，同时支持 Node.js 环境的测试，是目前前端领域最流行的测试工具之一。

[Jest 中文官网](https://jestjs.io/zh-Hans/)

其核心作用主要有三点：

1. 测试运行与组织：提供 `describe` `test` 等 API 组织测试用例，自动执行并输出清晰的测试结果。
2. 断言与验证：通过 `expect` 及丰富的匹配器（如 `toBe` `toEqual`），验证代码运行结果是否符合预期。
3. 模拟与隔离：支持 mocking 函数、模块、定时器等，隔离外部依赖，确保测试聚焦于目标逻辑。

## 相关知识点清单（基础到进阶）

### 一、基础入门

- Jest 安装与环境配置
- 测试用例组织（describe / test / it）
- 基础断言与匹配器（expect / toBe / toEqual 等）
- 测试执行命令与参数
- 测试文件命名规范

### 二、核心功能

- 常用断言匹配器（真值/假值、数字/字符串、数组/对象）
- 函数测试（调用次数、参数验证）
- 异步代码测试（Promise / async/await / 回调）
- 定时器模拟（setTimeout / setInterval）
- 测试钩子（beforeEach / afterEach / beforeAll / afterAll）

### 三、进阶应用

- 模块 mocking（jest.mock / jest.spyOn）
- 手动 mock 与自动 mock
- 快照测试（toMatchSnapshot）
- 代码覆盖率统计与配置
- 测试过滤与分组（test.only / test.skip）

### 四、高级技巧

- 复杂依赖的 mock 策略
- 测试性能优化
- 自定义匹配器开发
- 与 CI/CD 集成
- Jest 配置深度定制（jest.config.js）
