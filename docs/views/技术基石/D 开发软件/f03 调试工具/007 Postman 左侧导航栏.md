# Postman 左侧导航栏

Postman 左侧导航栏是组织和管理 API 开发全流程的核心区域，覆盖从请求设计到团队协作的所有环节。以下是基于最新功能的深度使用指南，结合快捷键、高级配置和实际场景，助你大幅提升效率：

## **一、导航栏基础布局与自定义**

1. **核心模块概览**  
   左侧导航栏默认包含以下模块（可通过右键菜单或 **Workspace Settings** 隐藏/显示）：

   - **Collections**：按项目分组的请求集合，支持文件夹嵌套和版本控制。
   - **Environments**：管理不同环境（开发/测试/生产）的变量，支持一键切换。
   - **Workspaces**：多成员协作的核心容器，支持权限分级和 API 生命周期管理。
   - **API Network**：探索公共 API 或团队私有 API 网络。
   - **History**：保存最近发送的请求，支持批量删除和快速重发。
   - **Bookmarks**：标记常用请求，支持标签分类。
   - **Mock Servers**：模拟 API 响应，支持请求头/路径匹配算法。
   - **Monitors**：定期执行测试并生成性能报告。

2. **界面优化技巧**
   - **快捷键操作**：
     - `Ctrl/Cmd + K`：快速搜索导航栏内的所有元素（集合、环境、变量等）。
     - `Ctrl/Cmd + Shift + 点击元素`：在新浏览器标签页中打开，适合多任务处理。
   - **折叠与分组**：右键导航栏可折叠模块或隐藏标签，仅显示关键区域。
   - **自定义侧边栏**：点击顶部 **Workspace Settings** → **Sidebar**，勾选需要显示的模块（如仅保留 Collections 和 Environments）。

## **二、Collections 高级管理**

1. **版本控制与分支**

   - **Git 集成**：通过 **Export** 将集合保存为 JSON/YAML 文件，提交到 Git 仓库。更新后使用 **Import** 同步最新版本。
   - **Postman 原生分支**：在付费计划中，点击集合名称右侧的 **Branches**，创建分支进行独立开发，支持拉取请求（Pull Requests）和代码审查。

2. **动态变量与脚本**

   - **Pre-request Script**：
     ```javascript
     // 生成随机 UUID
     pm.globals.set("uuid", crypto.randomUUID());
     // 从环境变量拼接 URL
     const baseUrl = pm.environment.get("baseUrl");
     pm.request.url = `${baseUrl}/users/{{uuid}}`;
     ```
   - **Post-response Script**：
     ```javascript
     // 从响应中提取 Token 并保存到环境变量
     const response = pm.response.json();
     pm.environment.set("token", response.access_token);
     ```

3. **数据驱动测试**
   - **CSV/JSON 数据文件**：通过 **Collections Runner** 导入数据文件，批量执行测试。例如，使用 CSV 文件测试不同用户登录场景：
     ```csv
     username,password,expected_status
     user1,pass1,200
     user2,pass2,401
     ```
   - **迭代数据访问**：在测试脚本中使用 `pm.iterationData.get("字段名")` 获取当前行数据。

## **三、Workspaces 协作与权限控制**

1. **权限分级管理**

   - **角色分配**：
     - **管理员**：创建/删除工作空间、邀请成员、分配角色（管理员/编辑者/查看者）。
     - **编辑者**：修改工作空间内的元素，但无法更改权限。
     - **查看者**：仅能查看内容，无法编辑或分享。
   - **私有工作空间**：仅限受邀成员访问，适合敏感项目。非成员访问需提交请求，管理员在 **Notifications** 中审批。

2. **跨工作空间协作**
   - **元素移动**：在导航栏中直接拖拽集合、环境或 Mock 服务器到其他工作空间，但个人工作空间无法接收来自团队工作空间的元素。
   - **固定收藏**：在工作空间概览页点击 **Pin Collections**，将常用集合固定到顶部，快速访问。

## **四、Environments 精细化配置**

1. **变量优先级与嵌套引用**

   - **优先级顺序**：请求级变量 > 环境变量 > 全局变量。例如，若环境变量 `baseUrl` 为 `https://dev-api`，请求中可覆盖为 `https://staging-api`。
   - **嵌套引用**：在环境变量中使用 `{{global_var}}` 引用全局变量，或 `{{other_env_var}}` 引用其他环境变量（需通过 **Environment Quick View** 开启）。

2. **动态环境切换**
   - **Pre-request Script**：根据当前时间自动切换环境（如夜间切换到测试环境）：
     ```javascript
     const currentHour = new Date().getHours();
     if (currentHour >= 22 || currentHour < 6) {
       pm.environment.set("baseUrl", "https://test-api");
     } else {
       pm.environment.set("baseUrl", "https://dev-api");
     }
     ```

## **五、Mock Servers 深度应用**

1. **请求匹配算法**

   - **基础匹配**：默认根据请求方法和路径匹配示例响应。例如，`GET /users` 匹配所有同路径的 GET 请求。
   - **高级匹配**：
     - **请求头匹配**：在示例中添加 `x-mock-response-name: "user-detail"`，请求时携带该头即可精准返回响应。
     - **请求体匹配**：在 Mock 服务器设置中启用 **Body Matching**，示例响应的 JSON 结构需与请求体完全一致。

2. **延迟与 CORS 配置**
   - **模拟网络延迟**：在 Mock 服务器设置中添加 `Delay (ms)`，如设置 500ms 模拟弱网环境。
   - **跨域支持**：默认启用 CORS，前端可直接访问模拟端点。若需自定义响应头，在示例中添加 `Access-Control-Allow-Origin: *`。

## **六、History 与 Bookmarks 高效使用**

1. **历史记录管理**

   - **批量操作**：按住 `Ctrl/Cmd` 多选请求，点击顶部垃圾桶图标批量删除；或右键选择 **Save All to Collection** 保存常用请求。
   - **搜索过滤**：在搜索框输入关键词（如 `GET /users` 或状态码 `200`），快速定位历史请求。

2. **智能书签**
   - **标签分类**：为书签添加标签（如 `payment` 或 `bug`），通过导航栏顶部 **Search** 按标签筛选。
   - **批量操作**：在书签列表中按住 `Shift` 多选，点击 **Move to Collection** 统一归类。

## **七、Monitors 持续监控与警报**

1. **性能指标设置**

   - **频率与阈值**：创建 Monitor 时设置运行频率（如每小时一次），并配置警报条件（如响应时间超过 1s 或错误率 >5%）。
   - **多环境监控**：同一 Monitor 可关联多个环境（如同时监控开发和测试环境），对比性能差异。

2. **报告与通知**
   - **生成报告**：Monitor 运行后自动生成 HTML 报告，包含响应时间趋势、错误分布等。
   - **集成通知**：在 **Settings** → **Notifications** 中配置 Slack 或邮件通知，警报触发时实时提醒团队。

## **八、快捷键与隐藏功能**

1. **导航栏快捷键**

   - `Ctrl/Cmd + Shift + F`：全局查找替换（支持集合、环境、变量等）。
   - `Alt + 数字键`：快速切换标签页（如 `Alt + 1` 切换到第一个标签）。

2. **右键菜单技巧**
   - **快速复制**：右键集合/环境 → **Copy Link**，直接生成可分享的 URL。
   - **批量导出**：多选集合 → **Export**，一次性导出为 JSON 文件。

通过以上技巧，你可以将左侧导航栏打造成 API 开发的「指挥中心」，从请求设计到团队协作，再到自动化测试与监控，实现全流程高效管理。
