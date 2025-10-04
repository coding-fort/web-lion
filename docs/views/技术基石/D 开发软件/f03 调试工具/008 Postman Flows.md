# Postman Flows

Postman Flows 是 Postman 推出的 **可视化 API 工作流编排工具**，核心价值是通过「拖拽节点 + 图形化连接」替代传统脚本，实现复杂 API 交互逻辑（如多接口依赖、条件分支、批量数据处理），无需编写大量 JavaScript 代码，尤其适合低代码场景和复杂业务流程自动化。以下是从基础到高级的深度使用指南：

## **一、Flows 核心定位与适用场景**

在学习 Flows 前，需先明确其与 Postman 传统功能的差异：

- **传统脚本（Pre-request/Tests）**：适合单接口的简单逻辑（如提取 Token、断言），依赖代码编写；
- **Flows**：适合 **多接口联动场景**（如“注册 → 登录 → 获取用户信息 → 数据校验”），支持可视化编排、条件判断、循环处理，低代码门槛。

**典型适用场景**：

1. 接口联调：按业务流程串联多个 API（如电商下单：创建订单 → 支付 → 查询订单状态）；
2. 自动化测试：构建端到端（E2E）测试流程，替代部分 Newman 脚本；
3. 数据处理：批量调用 API 并处理返回结果（如批量导入用户、数据清洗）；
4. 定时任务：结合 Postman Monitors，实现周期性工作流（如每日同步数据）。

## **二、Flows 基础：界面与核心概念**

### 1. 如何打开 Flows？

- 方式 1：在 Postman 左侧导航栏，点击 **Collections** → 选中目标集合/请求 → 右侧面板切换到 **Flows** 标签；
- 方式 2：新建集合时，勾选「Add a Flow to this collection」，直接创建空工作流。

### 2. 核心界面布局

| 区域                    | 功能描述                                                                           |
| ----------------------- | ---------------------------------------------------------------------------------- |
| **画布（Canvas）**      | 可视化编辑区，用于拖拽节点、连接逻辑，支持缩放（鼠标滚轮）和平移（按住拖拽）；     |
| **节点库（Nodes）**     | 左侧面板，包含所有可使用的节点（如 API 请求、条件判断、数据处理、循环等）；        |
| **检查器（Inspector）** | 右侧面板，选中节点后配置参数（如请求 URL、条件表达式、变量绑定）；                 |
| **运行控制栏**          | 底部工具栏，包含「Run Flow」（运行工作流）、「Reset」（重置状态）、「导出/导入」； |
| **数据日志（Logs）**    | 运行后显示节点输出数据、错误信息，用于调试工作流；                                 |

### 3. 核心概念：节点与数据流转

- **节点（Node）**：Flows 的最小执行单元，分 4 大类：
  1. **触发器节点（Trigger）**：工作流的起点，如「Manual Trigger」（手动触发）、「Schedule Trigger」（定时触发，需结合 Monitors）；
  2. **请求节点（Request）**：调用 API 接口，可直接选择 Postman 中已有的请求，或新建请求；
  3. **逻辑节点（Logic）**：控制流程走向，如「If Else」（条件分支）、「For Each」（循环）、「Try Catch」（异常捕获）；
  4. **数据节点（Data）**：处理数据，如「Set Variable」（设置变量）、「Parse JSON」（解析 JSON）、「Transform Data」（数据转换）。
- **数据流转**：节点间通过「连接线」传递数据，数据格式为 JSON，可通过 `\{\{$node["节点名称"].outputs["输出键"]}}` 引用前序节点的结果。

## **三、Flows 入门：构建第一个工作流（案例实操）**

以「用户注册 → 登录 → 获取用户信息」的业务流程为例，演示 Flows 完整构建步骤：

### 步骤 1：添加触发器节点（起点）

1. 在左侧 **Nodes** 库中，拖拽「Manual Trigger」到画布；
2. 该节点无需配置，点击后即可手动触发工作流（运行时会生成一个初始 `$trigger` 变量，包含触发时间等信息）。

### 步骤 2：添加「注册用户」请求节点

1. 拖拽「Send Request」节点到画布，放在触发器右侧；
2. 选中该节点，在右侧 **Inspector** 中配置：
   - **Request**：选择已有的「用户注册」请求（或点击「Create New Request」新建，配置 POST 方法、URL、请求体）；
   - **Request Body**：使用动态数据（如随机邮箱），可引用触发器变量或生成临时数据：
     ```json
     {
       "username": "user_{{$random.int(1000,9999)}}",
       "email": "user_{{$random.int(1000,9999)}}@example.com",
       "password": "Test123!"
     }
     ```
3. 点击「Save」，用连接线连接「Manual Trigger」→「Send Request（注册）」。

### 步骤 3：添加「登录」请求节点（依赖注册结果）

1. 拖拽第二个「Send Request」节点，命名为「登录」；
2. 配置登录请求（POST 方法，URL 为 `/api/login`），请求体需引用「注册」节点返回的邮箱：
   - 在 **Request Body** 中，通过「数据绑定」选择前序节点：  
     点击输入框右侧的「{{}}」→ 选择「Send Request（注册）」→ 选择输出键（如 `response.body.email`）；
   - 最终请求体自动生成：
     ```json
     {
       "email": "\{\{$node["Send Request (注册)"].outputs["response.body.email"]}}",
       "password": "Test123!"
     }
     ```
3. 连接「注册」节点 →「登录」节点。

### 步骤 4：添加「获取用户信息」节点（依赖登录 Token）

1. 拖拽第三个「Send Request」节点，命名为「获取用户信息」；
2. 配置请求（GET 方法，URL 为 `/api/users/me`），需在 Headers 中添加登录返回的 Token：
   - 在 **Headers** 中添加 `Authorization: Bearer \{\{$node["Send Request (登录)"].outputs["response.body.token"]}}`；
3. 连接「登录」节点 →「获取用户信息」节点。

### 步骤 5：运行与调试工作流

1. 点击底部「Run Flow」，观察节点颜色变化：
   - 绿色：执行成功；
   - 红色：执行失败（点击节点查看右侧「Logs」面板的错误信息）；
2. 查看结果：点击每个节点，在「Inspector」→「Output」中查看返回数据（如登录节点的 Token、用户信息节点的用户详情）。

## **四、Flows 高级功能：逻辑控制与数据处理**

掌握基础流程后，需深入学习 **逻辑节点** 和 **数据节点**，应对复杂场景（如条件分支、循环、异常处理）。

### 1. 条件分支（If Else 节点）：按结果动态走流程

**场景**：登录成功后获取用户信息，失败则输出错误提示。

- 步骤 1：拖拽「If Else」节点到「登录」节点后；
- 步骤 2：配置「If 条件」：  
  选中「If Else」节点 →「Condition」→ 输入表达式：  
  `$node["Send Request (登录)"].outputs["response.status"] === 200`（判断登录响应码是否为 200）；
- 步骤 3：配置分支：  
  -「If 分支」：连接到「获取用户信息」节点； -「Else 分支」：拖拽「Console Log」节点（输出错误），配置日志内容：  
   `登录失败：\{\{$node["Send Request (登录)"].outputs["response.body.message"]}}`；
- 运行效果：登录成功走正常流程，失败则在「Logs」中显示错误信息。

### 2. 循环处理（For Each 节点）：批量调用 API

**场景**：批量导入 3 个用户，循环调用「注册」接口。

- 步骤 1：添加「Set Variable」节点，定义批量数据：  
  选中节点 →「Variable Name」输入 `userList`→「Value」输入 JSON 数组：
  ```json
  [
    { "username": "user1", "email": "user1@test.com" },
    { "username": "user2", "email": "user2@test.com" },
    { "username": "user3", "email": "user3@test.com" }
  ]
  ```
- 步骤 2：拖拽「For Each」节点，配置「Iterate Over」为 `\{\{$node["Set Variable"].outputs["userList"]}}`（循环遍历用户列表）；
- 步骤 3：在「For Each」的「Loop Body」中添加「Send Request（注册）」节点，请求体引用循环变量：  
  `\{\{$loop.item.username}}`（`$loop.item` 表示当前循环的用户对象）；
- 运行效果：自动循环 3 次，分别注册 3 个用户。

### 3. 异常处理（Try Catch 节点）：避免流程中断

**场景**：注册接口可能报错（如邮箱已存在），需捕获异常并继续执行后续流程。

- 步骤 1：用「Try Catch」节点包裹「Send Request（注册）」节点（拖拽「Try Catch」后，将注册节点拖入其「Try」区域）；
- 步骤 2：配置「Catch 分支」：添加「Console Log」节点，输出异常信息：  
  `注册失败：\{\{$node["Try Catch"].outputs["error.message"]}}`；
- 运行效果：即使某个用户注册失败，流程也不会中断，会继续处理下一个用户（结合 For Each 时尤其有用）。

### 4. 数据转换（Transform Data 节点）：处理返回结果

**场景**：获取用户列表后，提取所有用户的 `id` 和 `email`，生成新数组。

- 步骤 1：添加「Send Request（获取用户列表）」节点，返回数据格式为 `{"data": [{"id": 1, "email": "a@test.com"}, ...]}`；
- 步骤 2：拖拽「Transform Data」节点，配置「Input Data」为 `\{\{$node["Send Request (获取用户列表)"].outputs["response.body.data"]}}`；
- 步骤 3：配置「Transformation」（使用 JavaScript 表达式）：  
  `data.map(user => ({ userId: user.id, userEmail: user.email }))`（提取 id 和 email 并重命名键）；
- 步骤 4：添加「Console Log」节点，输出转换后的数据：`\{\{$node["Transform Data"].outputs["result"]}}`；
- 运行效果：日志中显示转换后的数组 `[{"userId": 1, "userEmail": "a@test.com"}, ...]`。

## **五、Flows 与 Postman 生态的联动**

Flows 并非独立功能，而是与 Postman 现有工具链深度集成，提升整体效率：

### 1. 与环境变量联动：复用全局配置

- 在 Flows 中设置环境变量：通过「Set Variable」节点，选择「Scope」为「Environment」或「Global」，即可修改 Postman 环境/全局变量；
- 示例：登录后将 Token 存入环境变量，供其他请求复用：  
  `pm.environment.set("token", "\{\{$node["Send Request (登录)"].outputs["response.body.token"]}}")`（在「Console Log」或「Transform Data」节点中执行）。

### 2. 与 Monitors 联动：定时执行工作流

- 步骤 1：保存 Flows 后，在左侧导航栏点击 **Monitors** →「Create Monitor」；
- 步骤 2：配置「Collection/Flow」为目标 Flows 所在的集合，选择「Flow」为需定时执行的工作流；
- 步骤 3：设置运行频率（如每小时一次）、环境、通知方式（邮件/Slack）；
- 应用场景：每日凌晨自动同步数据、定时检查 API 可用性。

### 3. 与 Newman 联动：命令行运行 Flows

- Postman 10.10+ 版本支持通过 Newman 运行 Flows（需先导出 Flows 为 JSON 文件）；
- 命令示例：
  ```bash
  newman run my-collection.json --flow "My Flow Name" -e dev-environment.json -r html
  ```
- 适用场景：集成到 CI/CD 流程（如 Jenkins），实现工作流自动化执行。

## **六、Flows 最佳实践与避坑指南**

### 1. 工作流设计原则

- **模块化拆分**：复杂流程拆分为多个子 Flows（如“用户管理”“订单管理”），通过「Call Flow」节点调用子 Flows，提升可维护性；
- **清晰命名**：节点命名需包含业务含义（如“登录-获取 Token”而非“Send Request 1”），便于团队协作和调试；
- **日志埋点**：关键节点后添加「Console Log」，输出核心数据（如 Token、请求参数），便于定位问题。

### 2. 常见问题与解决方案

- **问题 1：数据绑定失败**  
  原因：前序节点输出键错误或节点未连接；  
  解决：点击「{{}}」时确认节点名称和输出键正确，确保节点间连接线完整。

- **问题 2：循环中数据重复**  
  原因：循环变量未正确引用 `$loop.item`；  
  解决：在循环体内的请求中，必须使用 `$loop.item.xxx` 引用当前循环数据，而非直接引用变量。

- **问题 3：Flows 运行超时**  
  原因：单个节点执行时间过长（如 API 响应慢）或循环次数过多；  
  解决：优化 API 性能，或在「Monitor」中调整超时时间（默认 5 分钟）。

### 3. 与传统脚本的选择建议

| 场景                               | 推荐方案               | 原因                                                                   |
| ---------------------------------- | ---------------------- | ---------------------------------------------------------------------- |
| 单接口简单逻辑（断言/提取）        | Pre-request/Tests 脚本 | 代码更简洁，执行效率更高                                               |
| 多接口依赖（如注册 → 登录 → 查询） | Flows                  | 可视化编排，无需编写复杂脚本，调试更直观                               |
| 低代码团队/非技术人员              | Flows                  | 降低学习成本，无需掌握 JavaScript                                      |
| 复杂数据处理（如正则/加密）        | 脚本 + Flows 结合      | Flows 处理流程逻辑，脚本处理复杂数据运算（通过「Transform Data」节点） |

## **七、总结**

Postman Flows 是 Postman 针对“复杂 API 流程自动化”推出的核心功能，通过可视化低代码方式，解决了传统脚本编写门槛高、调试难的问题。无论是接口联调、自动化测试，还是定时任务，Flows 都能大幅提升效率，尤其适合团队协作场景。

掌握 Flows 的关键在于：**从基础流程入手，理解节点逻辑和数据流转，再结合 Postman 生态（环境变量、Monitors）实现全流程自动化**。随着 Postman 对 Flows 的持续迭代（如 AI 辅助生成流程、更多节点类型），其在 API 开发中的作用将愈发重要。
