# `this` 关键字

```ts
type Foo = {
  a: number;
  b: number;
  foo(): number;
};

const foo: Foo = {
  a: 10,
  b: 20,
  foo() {
    return this.a + this.b + this.foo; // this.foo 没有限定
  },
};

type Bar = {
  a: number;
  b: number;
  foo(): number;
} & ThisType<{
  a: number;
  b: number;
}>;

// ThisType<T> 官方工具，允许我们为 this 指定类型

const bar: Bar = {
  a: 10,
  b: 20,
  foo() {
    return this.a + this.b + this.foo; // 此处会报错，因为this.foo 已经限定排除了
  },
};
```
