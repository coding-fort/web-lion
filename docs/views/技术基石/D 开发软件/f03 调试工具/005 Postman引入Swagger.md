# Postman 引入 Swagger

Swagger 与 Postman 的搭配使用是 API 开发中提升效率的经典组合。Swagger 专注于 **API 规范定义与文档生成**，而 Postman 提供 **强大的调试、测试与协作功能**。通过将 Swagger 生成的规范导入 Postman，可实现从文档到测试的全流程贯通。以下是具体操作与最佳实践：

## **一、核心整合流程**

### **1. 从 Swagger 导出 API 规范**

- **方法一**：通过 Swagger UI 获取实时 JSON 文档  
  启动 Swagger 服务后，访问 `http://your-api-host/v2/api-docs`（或 `openapi.json`），直接复制 JSON 内容。
- **方法二**：导出本地 YAML/JSON 文件  
  使用 Swagger Editor 或后端框架（如 Spring Boot）生成规范文件（例如 `swagger.json`）。

### **2. 在 Postman 中导入规范**

- **步骤**：
  1. 打开 Postman，点击左侧 **Import** → 选择 **Link** 或 **Upload File**。
  2. 输入 Swagger 的 `api-docs` URL（如 `http://localhost:8080/v2/api-docs`），或上传本地 JSON/YAML 文件。
  3. 点击 **Import**，Postman 会自动生成请求集合和环境变量（如 `baseUrl`）。

### **3. 配置环境变量**

- **基础配置**：  
  导入后，Postman 会自动创建一个环境（如 `Swagger Environment`），需手动设置 `baseUrl` 为 API 根地址（例如 `http://localhost:8080`）。
- **动态变量（如 Token）**：  
  对于需要认证的接口，可通过 Pre-request Script 自动获取 Token：
  ```javascript
  // 登录接口响应后，将 Token 存入环境变量
  const response = pm.response.json();
  pm.environment.set("token", response.token);
  ```
  后续接口在请求头中添加 `Authorization: Bearer {{token}}`。

### **4. 调试与测试**

- **可视化调试**：  
  在 Postman 中直接修改请求参数、Body，点击 **Send** 发送请求，实时查看响应状态码和内容。
- **自动化测试**：  
  在请求的 **Tests** 标签页编写断言脚本（基于 JavaScript）：
  ```javascript
  pm.test("状态码为 200", () => {
    pm.response.to.have.status(200);
  });
  pm.test("响应包含用户 ID", () => {
    const response = pm.response.json();
    pm.expect(response.id).to.be.a("number");
  });
  ```
  批量执行测试时，使用 **Collections Runner** 或集成 CI/CD 工具（如 Jenkins）。

### **5. 处理更新与同步**

- **手动更新**：  
  Swagger 规范变更后，重新导出 JSON 文件并覆盖 Postman 集合。
- **自动化工具**：  
  使用 `Swagger2Postman` 工具（需 Node.js 环境）自动同步，保留测试脚本和变量配置。  
  安装命令：
  ```bash
  npm install -g swagger2postman
  swagger2postman -s swagger.json -c postman-collection.json
  ```

### **6. swagger html 文档引入**

若只有一个单独的 Swagger HTML 文件，需先从中提取出 OpenAPI 规范（JSON 或 YAML 格式），再导入到 Postman 中。以下是具体操作步骤：

#### **方法 1：通过浏览器开发者工具提取**

1. **用浏览器打开 Swagger HTML 文件**  
   直接双击 HTML 文件，在浏览器中打开（如 Chrome、Edge）。

2. **打开开发者工具**  
   按 `F12` 或右键「检查」，切换到 **Network**（网络）面板。

3. **查找规范数据请求**

   - 刷新页面，在网络请求列表中寻找包含 `openapi.json`、`swagger.json` 或 `api-docs` 的请求（通常是 JSON 格式）。
   - 若未找到网络请求，说明规范数据可能内嵌在 HTML 中，可切换到 **Elements**（元素）面板，搜索 `openapi:` 或 `swagger:` 关键字，找到完整的 JSON 结构。

4. **复制规范数据**

   - 找到对应的 JSON 响应后，右键选择「Copy response」（复制响应）。
   - 若数据内嵌在 HTML 中，直接选中完整的 JSON 结构并复制。

5. **保存为 JSON 文件**  
   将复制的内容粘贴到文本编辑器（如记事本、VS Code），保存为 `swagger-spec.json`（文件名任意，后缀为 `.json`）。

#### **方法 2：直接从 HTML 源码中提取（适用于内嵌数据）**

1. **用文本编辑器打开 Swagger HTML 文件**  
   右键 HTML 文件 → 选择「打开方式」→ 用记事本或 VS Code 打开。

2. **搜索规范数据**  
   在编辑器中搜索 `openapi` 或 `swagger` 关键字（通常在 `<script>` 标签内），找到类似以下格式的 JSON 结构：

   ```json
   {
     "openapi": "3.0.0",
     "info": { "title": "...", "version": "..." },
     "paths": { ... }
   }
   ```

3. **提取并保存**  
   完整选中这段 JSON 代码（注意不要包含 HTML 标签），保存为 `.json` 文件（如 `spec.json`）。

## **二、进阶技巧与最佳实践**

### **1. 环境变量精细化管理**

- **多环境支持**：  
  创建开发、测试、生产等环境，通过 **Environment Selector** 快速切换。  
  例如：  
  | 环境变量 | 开发环境值 | 生产环境值 |
  |----------|------------------|------------------|
  | baseUrl | `http://dev-api` | `http://prod-api`|
- **敏感数据保护**：  
  使用 Postman Vault 存储 API Key、Token 等敏感信息，避免直接暴露在环境变量中。

### **2. 测试脚本高级用法**

- **数据驱动测试**：  
  通过 **Data** 标签页导入 CSV/JSON 文件，结合 `pm.iterationData` 动态生成测试用例：
  ```javascript
  const username = pm.iterationData.get("username");
  pm.request.body.formData.set("username", username);
  ```
- **接口依赖处理**：  
  使用 `pm.globals.set()` 或 `pm.environment.set()` 在请求间传递数据：

  ```javascript
  // 第一个请求（获取用户 ID）
  const response = pm.response.json();
  pm.globals.set("userId", response.id);

  // 第二个请求（根据 ID 获取用户）
  pm.request.url = `https://api/users/{{userId}}`;
  ```

### **3. 团队协作与版本控制**

- **共享集合与环境**：  
  将 Postman 集合和环境同步到云端，团队成员可通过链接协作。
- **与 Swagger Hub 集成**：  
  在 Swagger Hub 中管理规范，通过 Webhook 自动触发 Postman 集合更新。

### **4. 性能与监控**

- **性能测试**：  
  使用 Postman 的 **Monitors** 功能定期执行测试，监控响应时间和错误率。
- **导出测试报告**：  
  执行测试后，导出为 HTML/JSON 格式，生成可视化报告：
  ```bash
  newman run collection.json -r html --reporter-html-export report.html
  ```

## **三、对比一体化工具：为何选择组合方案？**

虽然 Apifox 等工具可实现 **设计-调试-测试** 一体化，但 Swagger + Postman 仍有独特优势：

- **灵活性**：Swagger 与后端框架深度集成（如注解生成规范），Postman 支持复杂测试逻辑。
- **生态成熟**：两者均为行业标准，社区资源丰富，适合跨团队协作。
- **成本优势**：Swagger 开源免费，Postman 基础功能免费，企业版成本可控。

**适用场景**：

- 后端主导的 API 开发，需自动生成文档。
- 复杂测试逻辑（如断言、数据驱动）或 CI/CD 集成。
- 团队已习惯 Swagger 规范管理，需补充调试与测试能力。

## **四、总结**

Swagger 与 Postman 的搭配是 **规范管理 + 高效测试** 的黄金组合。通过导出规范、导入配置、环境变量管理和脚本编写，可显著提升 API 开发与测试效率。若需进一步简化流程，可考虑引入自动化同步工具（如 Swagger2Postman）或探索一体化平台（如 Apifox）。

**核心流程示意图**：

```
Swagger 规范（YAML/JSON） → 导出 → Postman 导入 → 配置环境 → 调试/测试 → 团队协作/CI/CD
```

通过合理运用这两个工具，开发者可实现从 API 设计到上线的全链路质量保障。
