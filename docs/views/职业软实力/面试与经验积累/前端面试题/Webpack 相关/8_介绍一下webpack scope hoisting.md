# 8\_介绍一下 webpack scope hoisting

<bwp></bwp>
`scope hoisting` 是 webpack 的内置优化，它是针对模块的优化，在生产环境打包时会自动开启。

在未开启`scope hoisting` 时，webpack 会将每个模块的代码放置在一个独立的函数环境中，这样是为了保证模块的作用域互不干扰。

`scope hoisting` 是将多个模块的代码合并到一个函数环境中执行。在这一过程中，webpack 会按照顺序正确的合并模块代码，同时对涉及的标识符作适当的处理以避免重名。

这样做的好处是减少了函数的调用，对运行效率有一定的提升，同时也降低了打包体积。

但`scope hoisting` 的启用是有前提的，如果遇到某些模块多次被其他模块引用，或者使用了动态导入的模块，或者是非 ESM 模块，都不会有`scope hoisting`
