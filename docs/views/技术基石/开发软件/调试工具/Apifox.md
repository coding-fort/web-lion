# Apifox - API 一体化协作平台

- 更先进的 API 设计/开发/测试工具，Apifox = Postman + Swagger + Mock + JMeter，API 文档、API 调试、API Mock、API 自动化测试。
- 官网：[https://www.apifox.cn](https://www.apifox.cn/)
- [Web 版](https://www.apifox.cn/web)

## API 文档

<p style="text-align: center;">Apifox_01.png</p>

## API 调试

<p style="text-align: center;">Apifox_02.png</p>

- 【响应检测】 文档中若配置了返回响应结构对象，则会在调用接口后对返回的响应进行检测，若未按文档定义（多字段/缺字段/字段类型错误/字段值错误）均可被检测出。

  > 如图 **[Apifox_01.png]** 展示，响应结构对象字段[code] 为枚举值，若接口返回了非定义中的值“1”，则软件校验响应（需开启校验（默认开启））会报错：
  >
  > **返回数据结构与接口定义不一致$.code 应当是预设定的枚举值之一（枚举值 -1、0、9999、600）**

- 【参数缓存】 如果接口中返回的参数，需要用于其他接口的请求参数，可将响应对象中的一个或多个值进行存到变量中（**临时变量（当次有效）**、**环境变量（当前环境有效）**、**全局变量**）。

  > 如图 **[Apifox_02.png]** 展示，可在后置操作栏添加“提取变量”或“自定义脚本（可对参数进行处理后再提取）”提取参数到变量中。
  >
  > 自定义脚本（示例）
  >
  > ```js
  > // 接口返回结果
  > let responseData = pm.response.json();
  > // 设置变量到环境变量中
  > let name = pm.environment.set("name", "zhangsan");
  > ```

<p style="text-align: center;">Apifox_03.png</p>

- 【参数提取】 若接口请求参数需要缓存到变量中的某些参数，可以在“前置操作”栏中提取参数并做预处理。

  > 如图 **[Apifox_03.png]** 展示，登录接口请求前，需要对登录账号和登录密码进行 MD5 加密，则需要使用“前置操作-自定义脚本”对参数进行预处理。
  >
  > 自定义脚本（示例）
  >
  > ```js
  > // 获取环境变量中的公钥
  > let publicKey = pm.environment.get("publicKey");
  > // 设置登录用户
  > let username = "admin",
  >   password = "admin";
  >
  > let encryptUsr = encrypt(username, publicKey);
  > let encryptPwd = encrypt(password, publicKey);
  > /* 将处理好的参数再次缓存到环境变量中，在body 栏通过{{username}} 获取 */
  > pm.environment.set("username", encryptUsr);
  > pm.environment.set("password", encryptPwd);
  >
  > // MD5 加密
  > function encrypt(encryptData, pubk) {
  >   var jsrsasign = require("jsrsasign");
  >   pubk = "-----BEGIN PUBLIC KEY-----" + pubk + "-----END PUBLIC KEY-----";
  >   // 读取解析pem格式的秘钥, 生成秘钥实例 (RSAKey)
  >   var pub = jsrsasign.KEYUTIL.getKey(pubk);
  >   var enc = jsrsasign.KJUR.crypto.Cipher.encrypt(encryptData, pub);
  >   return jsrsasign.hextob64(enc);
  > }
  > ```
  >
  > 注 1：需要将自定义脚本拖动到“变量替换”前，对参数预处理才有效；在“变量替换”后，则是在请求发送后，再执行脚本。
  >
  > 注 2：对于（""）空字符串，缓存时需要添加一层引号（'""'），否则通过{{}} 获取变量中的值为空，请求报错。

## API MOCK

<p style="text-align: center;">Apifox_04.png</p>

- 若接口已配置好返回响应的对象类型及可取值，则可以通过“自动生成”按钮，自动生成模拟数据。

<p style="text-align: center;">Apifox_05.png</p>

- 对于常用的返回数据结构，可以通过“数据模型” 进行统一管理。在接口“返回响应”中通过“引用模型”选择对应的数据模型，即可实现快速配置返回数据结构。

> 注 1：引用模型，默认为关联状态，不可单独修改，但可通过“解除关联”脱离关联。

## API 自动化测试

### 断言（自定义脚本）

- 对接口进行断言监控，可在“后置操作”中添加“自定义脚本” 进行。

> ```js
> // 接口返回结果
> let responseData = pm.response.json();
>
> // 判断接口code 是否为正常“0”
> pm.test("接口正常响应（code=0）", function () {
>   // 如果code == 0，断言通过，否则触发断言报错
>   pm.expect(responseData.code).to.equal("0");
> });
>
> /* 部分常用断言判断 */
> // 1. 条件过滤去重后，通过数组长度是否为1，判断接口是否返回额外错误数据
> pm.expect(_processDataList).to.have.lengthOf(1);
> // 2. 判断两个值是否相等
> pm.expect(+billingStatus).to.equal(_processDataList[0]);
> ```

> 注 1：Apifox 后置操作支持直接添加“断言”，但只可进行简单的断言判断；如果需要对返回参数进行预处理后再进行断言判断，推荐使用“自定义脚本”方式添加断言。
>
> 注 2：[其他脚本断言](https://www.bookstack.cn/read/apifox-zh/83f25f17fc651ddb.md)

### 测试用例

- 测试用例是将多个接口有序地组合在一起运行，用来测试一个完整业务流程。

> 注 1：建议通过接口用例方式导入，且导入模式选择“绑定”，使得接口用例更新后，动态更新测试用例。

### 测试套件

- 测试套件为测试用例的集合，每个测试套件包含多个测试用例。
