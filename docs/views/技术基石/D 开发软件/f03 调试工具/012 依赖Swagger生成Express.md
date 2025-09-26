# 依赖 Swagger 生成 Express

要快速基于 Swagger 文档生成 Express 服务器（含基础路由和模拟数据），可以借助 **OpenAPI 代码生成工具** 自动生成骨架代码，再结合 Mock 库补充动态数据。以下是具体实现步骤，全程无需手动编写路由：

## **核心工具**

- **openapi-generator**：自动根据 Swagger/OpenAPI 文档生成 Express 项目骨架（路由、控制器、参数校验等）；
- **Mock.js**：为生成的接口添加动态模拟数据；
- **Swagger UI Express**：集成 Swagger 文档到生成的服务器，方便调试。

## **步骤 1：安装依赖工具**

### 1.1 安装 OpenAPI 生成器

```bash
# 方式 1：通过 npm 安装（推荐）
npm install @openapitools/openapi-generator-cli -g

# 方式 2：若 npm 安装失败，可直接下载官方 CLI（适合非 Node 环境）
# 参考：https://openapi-generator.tech/docs/installation
```

### 1.2 准备 Swagger 文档

确保有 Swagger/OpenAPI 文档（JSON 或 YAML 格式），例如：

- 本地文件（如 `swagger.json`）；
- 在线地址（如 `https://petstore.swagger.io/v2/swagger.json`）。

## **步骤 2：生成 Express 服务器骨架**

执行终端中执行以下命令，基于 Swagger 文档生成项目：

```bash
# 生成命令格式
openapi-generator generate -i [Swagger文件路径/URL] -g nodejs-express-server -o [输出目录]

# 示例（使用宠物商店 Swagger 示例）
openapi-generator generate -i https://petstore.swagger.io/v2/swagger.json -g nodejs-express-server -o express-swagger-server

# npx 会临时下载 @openapitools/openapi-generator-cli 包（无需全局安装），确保使用的是官方 OpenAPI Generator
npx @openapitools/openapi-generator-cli generate \
  -i ./public/swagger.json \
  -g nodejs-express-server \
  -o ./express
```

### 生成结果说明：

生成的 `express-swagger-server` 目录结构如下（核心文件）：

```
express-swagger-server/
├── src/
│   ├── controllers/      # 控制器控制器：自动生成的接口处理逻辑
│   ├── routes/           # 路由配置：自动映射 Swagger 路径到控制器
│   ├── middleware/       # 中间件：参数校验、错误处理等
│   ├── models/           # 数据模型：基于 Swagger schema 生成的 TypeScript 类型
│   └── app.js            # Express 入口文件
├── package.json          # 依赖配置
└── README.md             # 启动说明
```

## **步骤 3：安装项目依赖并启动基础服务器**

```bash
# 进入生成的项目目录
cd express-swagger-server

# 安装依赖
npm install

# 启动服务器（默认端口 3000）
npm start
```

此时，基础服务器已运行，但接口返回的是默认占位数据（如 `{"message": "Not implemented"}`），需下一步步补充添加模拟数据。

## **步骤 4：集成控制器添加添加 Mock 动态数据**

生成的控制器文件（`src/controllers/` 下）是接口逻辑的核心，我们可以在其中集成 Mock.js 生成动态数据。

### 4.1 安装 Mock.js

```bash
npm install mockjs --save
```

### 4.2 修改控制器，添加模拟数据

以 `src/controllers/PetController.js`（宠物接口控制器）为例，修改 `getPetById` 方法：

```javascript
// 引入 Mock.js
const Mock = require("mockjs");

// 找到原方法：默认返回 Not implemented
// exports.getPetById = function getPetById(req, res) {
//   res.status(501).send({ message: 'Not implemented' });
// };

// 修改后：返回用 Mock 生成动态数据
exports.getPetById = function getPetById(req, res) {
  const { petId } = req.params; // 从路径参数获取 petId

  // 根据 Swagger schema 生成符合结构的模拟数据
  const mockData = Mock.mock({
    id: parseInt(petId), // 用路径参数中的 ID 作为基础
    name: "@name", // 随机宠物名称
    "photoUrls|1-3": ["@url"], // 1-3 个随机图片 URL
    status: Mock.Random.pick(["available", "pending", "sold"]), // 从 Swagger 定义的枚举中随机选择
  });

  res.status(200).json(mockData);
};
```

### 4.3 批量修改其他接口

按同样逻辑修改其他控制器方法（如 `addPet`、`getPets` 等），例如 `getPets` 生成列表数据：

```javascript
exports.findPets = function findPets(req, res) {
  const { limit = 5 } = req.query; // 从查询参数获取分页限制
  const mockList = Mock.mock({
    "list|1-{{limit}}": [
      {
        // 生成 1-limit 条数据
        "id|+1": 1,
        name: "@name",
        status: Mock.Random.pick(["available", "pending", "sold"]),
      },
    ],
  });

  res.status(200).json(mockList.list);
};
```

## **步骤 5：集成 Swagger UI（可选，方便调试）**

生成的服务器默认不带 Swagger UI，可手动添加以方便接口调试：

### 5.1 安装 Swagger UI Express

```bash
npm install swagger-ui-express --save
```

### 5.2 修改入口文件 `src/app.js`

```javascript
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json"); // 若生成的项目中没有，可手动下载 Swagger 文件

const app = express();

// 原有路由配置...
require("./routes")(app);

// 添加 Swagger UI 路由（访问路径：http://localhost:3000/api-docs）
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;
```

## **步骤 6：测试接口**

重启服务器后，通过以下方式测试：

1. 直接调用接口：

   - `GET http://localhost:3000/pets` → 返回随机宠物列表；
   - `GET http://localhost:3000/pets/123` → 返回 ID 为 123 的随机宠物数据。

2. 通过 Swagger UI 调试：  
   访问 `http://localhost:3000/api-docs`，在界面中直接调用接口，查看动态返回结果。


## **错误处理**

```
{
  "message": "Could not find 'x-eov-operation-handler' with id login in module ...
  "errors": ""
}
```

1. 查看`controllers/Controller.js` 文件中是否存在调用接口；
2. 若接口在`controllers/DefaultController.js`中，则修改`/api/openapi.yaml` 文件中字段`x-eov-operation-handler: controllers/DefaultController`；

## **关键优势**

1. **零手动编写路由**：OpenAPI 生成器自动根据 Swagger 路径、参数、响应结构生成路由和控制器；
2. **数据结构严格匹配**：模拟数据完全符合 Swagger schema 定义（类型、枚举、必填项等）；
3. **可扩展性强**：生成的代码是纯 Express 项目，可自由添加中间件、数据库逻辑或复杂业务规则；
4. **适配 Swagger 更新**：若 Swagger 文档变更，只需重新执行生成命令（`openapi-generator generate`），再合并 Mock 逻辑即可。

## **总结**

通过 `openapi-generator` 快速生成 Express 骨架，结合 Mock.js 填充动态数据，可在 10 分钟内搭建一个与 Swagger 完全同步的模拟服务器。这种方式兼顾了「自动化生成」和「代码级自由度」，适合需要高度定制化模拟逻辑的场景。
