# Axios

[Axios 中文官网](http://www.axios-js.com/zh-cn/docs/index.html)

## Axios 是什么

Axios 是一个基于 promise 的 HTTP 库，可以用在浏览器和 node.js 中。

## 特性

* 从浏览器中创建 XMLHttpRequests
* 从 node.js 创建 http 请求
* 支持 Promise API
* 拦截请求和响应
* 转换请求数据和响应数据
* 取消请求
* 自动转换 JSON 数据
* 客户端支持防御 XSRF

## 安装

使用 npm:

```
$ npm install axios
```

## 并行

处理并发请求的助手函数

### axios.all(iterable)

### axios.spread(callback)

```javascript
    /* 串行 */
    const serialRequest = async () => {
        warn("axios 串行请求....")
        let capital = await reqSellerList()
        info(capital)
        if (capital.code === "0000") {}
        let opencity = await reqOpencityList()
        info(opencity)
        if (opencity.code === "0000") {}
        let supply = await reqSupplyList()
        info(supply)
        if (supply.code === "0000") {}
    }

    /* 并行 */
    const eruptRequest = () => {
        warn("axios 并行请求....")
        this.axios
            .all(
                [reqSellerList(), reqOpencityList(), reqSupplyList()]
            ).then(
                this.axios.spread((capital, opencity, supply) => {
                    info(capital)
                    if (capital.code === "0000") {}
                    info(opencity)
                    if (opencity.code === "0000") {}
                    info(supply)
                    if (supply.code === "0000") {}
                })
            )
    }
```
