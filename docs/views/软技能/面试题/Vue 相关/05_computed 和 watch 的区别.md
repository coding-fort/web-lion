# computed 和 watch 的区别

1. computed 是计算属性，具有缓存功能，只有当依赖的属性发生变化时，才会重新计算
2. watch 是监听属性，当监听的属性发生变化时，会执行相应的回调函数
3. computed 一般用于同步操作，watch 一般用于异步操作
