# Mockoon 入门使用

Mockoon 是一款开源免费的 API 模拟工具，以 **图形化界面** 和 **低代码配置** 为核心优势，支持从 Swagger/OpenAPI 导入接口、生成动态模拟数据、配置条件响应等功能，非常适合前端开发、接口测试和第三方联调。以下是从入门到精通的完整指南：

## **一、入门：安装与基础界面**

### 1. 安装 Mockoon

- **下载地址**：[Mockoon 官网](https://mockoon.com/)（支持 Windows、macOS、Linux）；
- 安装步骤：双击安装包，按向导完成（macOS 可能需要在「系统设置 → 安全性与隐私」中允许打开）。

### 2. 界面布局（核心区域）

启动后默认显示空白项目，界面分为 4 个核心区域：

```
┌─────────────────┬────────────────────────┬────────────────────────┐
│  环境列表       │  接口列表              │  编辑区                │
│  （左侧）       │  （中间）              │  （右侧）              │
│ - 环境1         │ - GET /api/users      │  配置请求/响应细节     │
│ - 环境2         │ - POST /api/login     │  （参数、响应体等）    │
└─────────────────┴────────────────────────┴────────────────────────┘
┌─────────────────────────────────────────────────────────────────────┐
│  状态栏（底部）：服务器状态、端口、日志按钮                          │
└─────────────────────────────────────────────────────────────────────┘
```

- **环境（Environment）**：可创建多个环境（如「开发环境」「测试环境」），每个环境独立配置端口和接口；
- **接口（Route）**：模拟的 API 接口，包含请求方法（GET/POST 等）、路径、响应等配置；
- **编辑区**：配置当前选中接口的细节（如响应体、状态码、延迟等）。

## **二、基础操作：创建第一个模拟接口**

### 1. 新建环境

- 点击左侧「+」→「New environment」，命名为「我的第一个 Mock 环境」；
- 默认端口为 3000（可修改，如 8080），点击「Start server」启动服务器（状态栏显示 `Server running on port 3000` 表示成功）。

### 2. 手动创建接口（以用户列表为例）

- 在中间接口列表点击「+」→「Add route」；
- 配置基础信息（右侧编辑区）：
  - **Method**：选择 `GET`；
  - **Path**：输入 `/api/users`（接口路径）；
  - **Status code**：保持 `200`（成功状态码）；
  - **Response body**：填写模拟数据（JSON 格式）：
    ```json
    [
      { "id": 1, "name": "张三", "age": 25 },
      { "id": 2, "name": "李四", "age": 30 }
    ]
    ```
- 点击「Save」保存接口。

### 3. 测试接口

- 用 Postman 或浏览器访问 `http://localhost:3000/api/users`，即可收到上述模拟数据；
- 若前端调用，需在环境配置中开启 CORS（默认已开启，可在环境设置中确认）。

## **三、进阶：导入 Swagger/OpenAPI 文档**

Mockoon 支持直接导入 Swagger/OpenAPI 文档（JSON/YAML），自动生成接口结构，无需手动创建：

### 1. 导入步骤

- 点击顶部菜单「File」→「Import」→「From OpenAPI/Swagger」；
- 选择本地 Swagger 文件（如 `swagger.json`）或输入在线 URL（如 `http://localhost:8080/v3/api-docs`）；
- 导入后，Mockoon 会自动解析接口路径、方法和响应结构，生成对应的模拟接口（位于当前环境中）。

### 2. 导入后优化

- **补充响应数据**：导入的接口可能只有默认响应结构（如 `{}`），需手动编辑响应体（参考 Swagger 中的 `examples` 字段）；
- **调整路径前缀**：若 Swagger 接口有基础路径（如 `/api/v1`），可在环境设置中添加「Base path」统一管理。

## **四、核心功能：动态数据与条件响应**

Mockoon 支持生成动态模拟数据（如随机 ID、时间戳）和条件响应（按请求参数返回不同数据），大幅提升模拟真实性。

### 1. 动态数据（使用内置变量）

在响应体中插入 `{{ 变量名 }}` 即可生成动态数据，常用变量：

- `{{ faker.name.fullName() }}`：随机姓名；
- `{{ faker.internet.email() }}`：随机邮箱；
- `{{ faker.datatype.number(100) }}`：0-100 的随机整数；
- `{{ now }}`：当前时间戳；
- `{{ uuid }}`：随机 UUID。

**示例**：动态生成用户数据

```json
{
  "id": {{ faker.datatype.number(1000) }},
  "name": "{{ faker.name.fullName() }}",
  "email": "{{ faker.internet.email() }}",
  "registerTime": {{ now }}
}
```

调用接口时，会自动替换为真实随机数据。

### 2. 条件响应（按请求参数返回不同结果）

针对同一接口，可根据请求参数（Query/Body/Headers）返回不同响应：

**场景**：查询用户时，`id=1` 返回张三，`id=2` 返回李四，其他 ID 返回 404。

**配置步骤**：

1. 选中接口 `/api/users`（GET 方法）；
2. 在右侧编辑区点击「Add response」，新增 3 个响应：
   - **响应 1**：
     - 条件：`Query parameter "id" equals "1"`
     - 状态码：200
     - 响应体：`{"id": 1, "name": "张三"}`
   - **响应 2**：
     - 条件：`Query parameter "id" equals "2"`
     - 状态码：200
     - 响应体：`{"id": 2, "name": "李四"}`
   - **响应 3**：
     - 条件：`Else`（其他情况）
     - 状态码：404
     - 响应体：`{"error": "用户不存在"}`
3. 测试：
   - `GET http://localhost:3000/api/users?id=1` → 返回张三；
   - `GET http://localhost:3000/api/users?id=999` → 返回 404。

### 3. 其他实用配置

- **响应延迟**：在编辑区「Response delay」设置延迟时间（如 500ms），模拟网络慢的场景；
- **响应头**：添加自定义响应头（如 `Content-Type: application/json` 或 `X-Test: mock`）；
- **请求验证**：在「Request validation」中设置参数规则（如必填项、格式），不符合时返回 400 错误。

## **五、高级：环境管理与团队协作**

### 1. 多环境切换

- 新建多个环境（如「开发环境（3000 端口）」「测试环境（8080 端口）」），分别配置接口；
- 点击环境名称右侧的「Start server」切换激活的环境，避免端口冲突。

### 2. 变量管理（全局/环境变量）

- **环境变量**：仅在当前环境生效，用于存储基础路径、Token 等；  
  配置：环境右键 →「Settings」→「Environment variables」→ 添加变量（如 `baseUrl: "/api/v1"`）；  
  使用：在接口路径中引用 `{{ baseUrl }}/users`。
- **全局变量**：所有环境共享，如 `apiVersion: "v2"`；  
  配置：顶部菜单「File」→「Preferences」→「Global variables」。

### 3. 导入导出与团队共享

- **导出配置**：环境右键 →「Export」→ 保存为 `.json` 文件（包含所有接口和配置）；
- **导入配置**：顶部菜单「File」→「Import」→「From file」→ 选择 `.json` 文件；
- 团队协作：将配置文件提交到 Git 仓库，成员更新后导入即可同步最新接口。

## **六、扩展：集成与自动化**

### 1. 与前端项目集成

前端开发时，直接调用 Mockoon 接口地址（如 `http://localhost:3000/api/users`），无需等待后端：

```javascript
// 示例：Axios 调用
axios
  .get("http://localhost:3000/api/users")
  .then((res) => console.log(res.data));
```

后端开发完成后，只需修改基础路径即可切换到真实接口。

### 2. CLI 模式运行（自动化场景）

Mockoon 提供 CLI 工具（`mockoon-cli`），可在命令行启动服务，适合集成到脚本或 CI/CD：

- 安装 CLI：
  ```bash
  npm install -g @mockoon/cli
  ```
- 启动服务（指定配置文件和端口）：
  ```bash
  mockoon-cli start --data ./my-environment.json --port 3000
  ```

### 3. 部署到服务器

将 Mockoon 配置导出为 `.json` 文件，通过 Docker 部署到服务器（需安装 Docker）：

```bash
# 拉取 Mockoon 镜像
docker pull mockoon/cli:latest
# 启动容器（映射配置文件和端口）
docker run -v ./my-environment.json:/data/env.json -p 3000:3000 mockoon/cli:latest start --data /data/env.json --port 3000
```

部署后，团队成员可通过服务器 IP 访问 Mock 接口（如 `http://server-ip:3000/api/users`）。

## **七、调试与问题排查**

### 1. 查看请求日志

- 点击状态栏的「Logs」按钮，打开日志面板；
- 每次调用接口后，日志会显示请求方法、路径、参数和响应状态，方便定位问题（如参数错误、条件不匹配）。

### 2. 常见问题解决

- **接口调用 404**：检查接口路径是否正确（注意大小写）、服务器是否启动；
- **跨域错误**：在环境设置中确认「Enable CORS」已勾选；
- **动态变量不生效**：确保变量格式正确（`{{ 变量名 }}`，注意双大括号）；
- **导入 Swagger 失败**：检查 Swagger 文档格式是否正确（可通过 [Swagger Editor](https://editor.swagger.io/) 验证）。

## **八、最佳实践**

1. **接口命名规范**：路径使用小写字母+短横线（如 `/api/user-profiles`），便于识别；
2. **响应体标准化**：统一响应格式（如 `{ "code": 200, "data": ..., "msg": "" }`），前端处理更统一；
3. **版本控制**：将 Mock 配置文件纳入 Git 管理，记录变更历史；
4. **分层模拟**：简单场景用静态数据，复杂场景用动态变量+条件响应，平衡效率和真实性；
5. **定期同步**：后端接口更新后，及时重新导入 Swagger 文档，保持 Mock 接口与真实接口一致。

通过以上步骤，你可以从基础的接口模拟逐步掌握 Mockoon 的高级功能，实现从「静态数据返回」到「接近真实业务逻辑的动态模拟」，大幅提升前端开发和接口测试效率。Mockoon 的优势在于 **零代码门槛** 和 **高度可配置性**，非常适合各类团队快速搭建可靠的 Mock 服务。
