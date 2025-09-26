# Postman 入门使用

Postman 是一款功能强大的 API 开发与测试工具，支持从设计、调试到自动化测试的全流程。以下是从零开始深入使用 Postman 的详细指南：

## **一、基础入门**

### **1. 安装与注册**

- **下载地址**：[Postman 官网](https://www.postman.com/downloads/)，支持 Windows、Mac 和 Linux 系统。
- **注册账号**：免费版支持基础功能，团队协作可升级至企业版。

### **2. 界面布局**

- **左侧导航栏**：管理请求集合（Collections）、环境（Environments）、Mock 服务器等。
- **请求编辑器**：构建 HTTP 请求，支持 GET、POST 等方法，可设置 Headers、Body 和 Parameters。
- **响应区**：查看 API 响应结果、状态码、耗时等。

### **3. 发送第一个请求**

1. 输入 URL（如 `https://api.postman.com/health`）。
2. 选择请求方法（如 GET）。
3. 点击 **Send**，查看响应结果。

## **二、变量与环境管理**

### **1. 变量类型**

- **环境变量**：与特定环境（如开发、测试、生产）绑定，优先级高于全局变量。  
  **创建步骤**：
  1. 点击右上角 **Environment** → **Add Environment**。
  2. 添加变量（如 `baseUrl`），设置初始值（如 `http://dev-api`）。
  3. 在请求 URL 中使用 `{{baseUrl}}/api/users`。
- **全局变量**：所有环境通用，优先级最低。  
  **设置方法**：  
  `pm.globals.set("variableName", "value");`

### **2. 动态变量与脚本**

- **Pre-request Script**：请求发送前执行，用于生成动态参数。  
  **示例**：
  ```javascript
  // 生成随机邮箱
  const email = `user_${Date.now()}@example.com`;
  pm.environment.set("email", email);
  ```
- **Post-response Script**：响应返回后执行，用于验证结果或提取数据。  
  **示例**：
  ```javascript
  // 从响应中提取 Token 并保存到环境变量
  const response = pm.response.json();
  pm.environment.set("token", response.token);
  ```

## **三、测试脚本与断言**

### **1. 基础断言**

使用内置的 Chai 断言库，支持 BDD 风格语法。  
**示例**：

```javascript
pm.test("状态码为 200", () => {
  pm.response.to.have.status(200);
});

pm.test("响应包含用户 ID", () => {
  const response = pm.response.json();
  pm.expect(response.id).to.be.a("number");
});
```

### **2. 高级断言**

- **JSON Schema 验证**：
  ```javascript
  pm.test("响应符合 JSON Schema", () => {
    const schema = {
      type: "object",
      properties: {
        id: { type: "number" },
        name: { type: "string" },
      },
      required: ["id", "name"],
    };
    pm.response.to.have.jsonSchema(schema);
  });
  ```
- **响应时间与大小检查**：
  ```javascript
  pm.test("响应时间小于 200ms", () => {
    pm.expect(pm.response.responseTime).to.be.below(200);
  });
  ```

## **四、数据驱动测试**

通过 CSV 或 JSON 文件批量执行测试，适用于边界值、异常场景等。  
**步骤**：

1. **准备数据文件**（如 `testdata.csv`）：
   ```csv
   username,email
   user1,user1@example.com
   user2,user2@example.com
   ```
2. **设置 Pre-request Script**：
   ```javascript
   const username = pm.iterationData.get("username");
   pm.request.body.formData.set("username", username);
   ```
3. **运行测试**：  
   点击 **Collections Runner** → 选择数据文件 → 点击 **Run**。

## **五、团队协作与版本控制**

### **1. 共享集合与环境**

- **云端同步**：将集合和环境保存到 Postman Cloud，团队成员可实时协作。
- **权限管理**：在 Workspace 中分配角色（如管理员、编辑者、查看者），控制访问权限。

### **2. 与 Git 集成**

- **导出集合**：点击 **Collection** → **Export**，保存为 `.json` 文件。
- **版本控制**：将文件提交到 Git 仓库，通过分支管理不同版本。

## **六、自动化测试与 CI/CD**

### **1. 使用 Newman 命令行工具**

- **安装**：
  ```bash
  npm install -g newman
  ```
- **运行集合**：
  ```bash
  newman run collection.json -e environment.json -r html
  ```
  生成 HTML 测试报告，便于分析结果。

### **2. 集成到 CI/CD 流程**

- **Jenkins 配置**：
  1. 在 Jenkins 中添加 **Execute Shell** 步骤。
  2. 输入 Newman 命令：
     ```bash
     newman run collection.json -e environment.json --reporters cli,html --reporter-html-export report.html
     ```
  3. 构建后通过邮件或 Slack 发送报告。

## **七、高级功能**

### **1. Mock 服务器**

模拟 API 响应，用于前端开发或后端未完成时的联调。  
**步骤**：

1. 创建 Mock 服务器，设置路由和响应规则。
2. 生成 Mock URL（如 `https://postman-mock.com/...`）。
3. 在前端代码中使用该 URL 进行测试。

### **2. 性能监控**

通过 **Monitors** 定期执行测试，监控 API 性能指标（如响应时间、错误率）。  
**设置步骤**：

1. 点击 **Monitors** → **Create Monitor**。
2. 选择集合和环境，设置运行频率（如每小时一次）。
3. 查看监控图表和历史数据。

## **八、最佳实践**

1. **规范命名**：集合、请求、变量等使用清晰命名，便于维护。
2. **分层测试**：将测试分为单元测试、集成测试、端到端测试，逐步覆盖。
3. **持续维护**：随着 API 变更，及时更新测试用例和断言。

通过以上内容，你可以全面掌握 Postman 的核心功能，从基础请求发送到复杂的自动化测试与团队协作，大幅提升 API 开发与测试效率。
