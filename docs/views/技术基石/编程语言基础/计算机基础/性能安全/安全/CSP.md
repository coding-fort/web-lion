# CSP (Content Security Policy, 内容安全策略)

CSP (Content Security Policy, 内容安全策略) 是一种安全策略机制，用于帮助防范跨站脚本 (XSS) 攻击以及其他代码注入攻击。通过 CSP，网站可以定义哪些来源的内容是可以信任和加载的，从而限制了攻击者能够注入恶意内容的机会。

### CSP 的工作原理

CSP 是通过 HTTP 响应头来实现的，允许开发者指定哪些资源可以从哪里加载，以及如何加载。当浏览器解析文档时，它会检查这些策略，并阻止那些不符合策略规定的资源加载或执行。

### 基本 CSP 指令

CSP 定义了一系列指令，每个指令控制着特定类型的资源加载行为。一些常见的指令包括：

- `default-src`: 设置默认的来源策略，适用于所有其他指令未覆盖的资源类型。
- `script-src`: 控制哪些来源的 JavaScript 可以执行。
- `connect-src`: 控制哪些来源的 XMLHttpRequest 和 Fetch 请求可以发出。
- `img-src`: 控制哪些来源的图像可以加载。
- `style-src`: 控制哪些来源的 CSS 可以加载。
- `font-src`: 控制哪些来源的字体文件可以加载。
- `object-src`: 控制哪些来源的对象（如 Flash 对象）可以加载。
- `frame-src`: 控制哪些来源的 `<iframe>` 可以加载。
- `base-uri`: 控制哪些来源的 `<base>` 标签可以设置。
- `form-action`: 控制哪些来源的表单提交是允许的。

### 指定来源

CSP 允许使用几种方式来指定来源：

- `'self'`: 表示同一源策略。
- `'unsafe-inline'`: 允许内联脚本和样式（不推荐，因为它可能会引入 XSS 风险）。
- `'unsafe-eval'`: 允许使用 `eval()` 和内联事件处理程序（同样不推荐）。
- `'nonce-'`: 用于标记内联脚本或样式，需要配合一个随机数（nonce）使用。
- `'hash-'`: 用于基于哈希值的内联脚本或样式，需要计算内联脚本或样式的哈希值。
- 域名、IP 地址或 URL: 明确指定来源。

### 示例

下面是一个简单的 CSP 头部示例，只允许从当前站点加载脚本和样式，并允许从 `example.com` 加载图片：

```http
Content-Security-Policy: default-src 'self'; img-src 'self' example.com; script-src 'self'; style-src 'self'
```

### 报告机制

CSP 还支持报告模式 (`report-uri` 或 `report-to`)，即使违反了策略也不会阻止资源加载，而是将违规情况发送给指定的端点供分析。

### 实施 CSP 的步骤

1. **评估现有的网页**：确定哪些资源是必要的，并记录它们的来源。
2. **制定 CSP 策略**：基于第一步的信息，制定合适的 CSP 指令。
3. **测试 CSP 策略**：使用 `Content-Security-Policy-Report-Only` 头部进行测试，确保没有误报。
4. **部署 CSP**：一旦测试无误，将 `Content-Security-Policy-Report-Only` 更改为 `Content-Security-Policy`。
5. **监控和调整**：持续监控 CSP 报告，必要时调整策略。

### 注意事项

- 在部署 CSP 之前，一定要彻底测试以避免意外地阻止合法内容。
- 使用报告模式可以帮助调试和理解哪些资源会被阻止。
- 为了更精细的控制，可以使用更多的 CSP 指令。

通过正确配置 CSP，可以显著提高网站的安全性，减少被恶意攻击的可能性。
