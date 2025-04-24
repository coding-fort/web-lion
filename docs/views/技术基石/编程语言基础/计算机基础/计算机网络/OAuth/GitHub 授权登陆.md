# GitHub 授权登陆

GitHub 提供了 OAuth 2.0 的支持，允许第三方应用通过 GitHub 进行用户认证和授权。使用 GitHub 授权登录可以让你的应用程序在无需处理用户密码的情况下安全地验证用户身份，并访问用户的 GitHub 数据（根据授权范围）。下面是使用 GitHub 进行授权登录的基本步骤：

## 注册 OAuth 应用程序

1. **前往 GitHub**：首先需要在 GitHub 上注册一个新的 OAuth 应用。你可以通过[这里](https://github.com/settings/applications/new)进入创建页面。
2. **填写信息**：

   - **Application name**：你的应用名称。
   - **Homepage URL**：你的应用主页 URL。
   - **Application description**：可选的描述。
   - **Authorization callback URL**：这是 GitHub 重定向到的 URL，用于处理 OAuth 回调。例如，`http://localhost:3000/auth/github/callback`对于本地开发是常见的选择。

3. **获取客户端 ID 和密钥**：完成注册后，你会获得一个客户端 ID 和一个客户端密钥，这两个值将在 OAuth 流程中使用。

## GitHub OAuth 流程

### 1. 引导用户进行授权

为了开始授权过程，你需要引导用户访问 GitHub 的 OAuth 对话框。这通常通过以下链接实现：

```
https://github.com/login/oauth/authorize
```

你需要附加几个查询参数：

- `client_id`: 从 GitHub 获取的客户端 ID。
- `redirect_uri`: 用户授权后的回调地址，必须与你在 GitHub 设置中预注册的 URL 匹配。
  - 该字段可以省略，但建议使用。
- `scope`: 请求的权限范围，如`user`表示基本用户数据，`repo`表示仓库数据等。多个范围可以用逗号分隔。
- `state`: 可选参数，用于防止 CSRF 攻击。

例如：

```
https://github.com/login/oauth/authorize?client_id=your_client_id&redirect_uri=http://localhost:3000/auth/github/callback&scope=user,repo&state=random_string
```

### 2. 处理回调并获取访问令牌

一旦用户同意授权，GitHub 会将用户重定向回你指定的`redirect_uri`，并附带一个临时的授权码。你需要用这个授权码向 GitHub 请求访问令牌：

```http
POST https://github.com/login/oauth/access_token
Content-Type: application/json
{
  "client_id": "your_client_id",
  "client_secret": "your_client_secret",
  "code": "code_received_from_github",
  "redirect_uri": "http://localhost:3000/auth/github/callback"
}
```

```js
/* 创建一个授权码的地址路由 */
router.get("/auth/callback/github", async (ctx) => {
  const { code } = ctx.query;
  /* 请求令牌 post  params参数 */
  const accessToken = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: oauthInfo.client_id,
      client_secret: oauthInfo.client_secret,
      code,
    }
  );
  const { access_token } = qs.parse(accessToken.data);
  /* 获取用户的信息 */
  userInfo = await axios.get("https://api.github.com/user", {
    /* Bearer 后面记得跟一个空格 */
    headers: {
      Authorization: "Bearer " + access_token,
    },
  });
  userInfo = userInfo.data;
  ctx.redirect("/home");
});
```

GitHub 将以如下形式返回一个包含访问令牌的响应：

```
access_token=e72e16c7e42f292c6912e7710c838347ae178b4a&token_type=bearer
```

### 3. 使用访问令牌

拿到访问令牌后，你就可以使用它来代表用户调用 GitHub API。例如，获取当前用户的信息：

```http
GET https://api.github.com/user
Authorization: token OAUTH-TOKEN
```

替换`OAUTH-TOKEN`为你从 GitHub 收到的实际访问令牌。

通过上述步骤，你可以成功实现 GitHub 授权登录功能，让用户安全地登录到你的应用并且根据需要访问他们的 GitHub 数据。请确保在整个过程中保护好你的客户端秘密以及用户的访问令牌。

[^参考Demo] : [github-auth-demo](https://gitee.com/basic-fort/github-auth-demo)
