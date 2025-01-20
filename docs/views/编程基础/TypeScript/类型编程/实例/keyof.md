# keyof

## 获取对象属性联合类型

```ts
// keyof any: string | number | symbol
type User = {
  id: number;
  name: string;
  age: number;
};
type UserKeys = keyof User; // 默认显示keyof User，实际类型为"id" | "name" | "age"
type userKeys = keyof User & {}; // 两者一样，这种方式可显示 "id" | "name" | "age"
/**
 * 与typeof 联合使用，获取一个对象的键的联合类型
 */
const person = {
  id: 1,
  name: "张三",
  age: 18,
};
type personType = typeof person; // 提取对象类型，{id: number; name: string; age: number;}
type personKeys = keyof typeof person; // 提取对象属性，"id" | "name" | "age"
/**
 * 与方括号运算符联合使用，获取对象类型值的类型
 */
type Person = {
  id: number;
  name: string;
  age: number;
};
type valueType = person[keyof Person]; // 提取对象属性值类型，number | string | number
```

```ts
// 通过重载方式实现createElement
function createElement(tagName, "a"): HTMLAnchorElement;
function createElement(tagName, "div"): HTMLDivElement;
function createElement(tagName, string): HTMLElement {
    return document.createElement(tagName);
};
// 通过keyof any、keyof T实现createElement
type TagName = keyof HTMLElementTagNameMap & {}; // 获取所有tag名的联合类型
function createElement<T extends TagName>(tagName: T): HTMLElementTagNameMap[T] {
    return document.createElement(tagName);
}
```

## keyof ObjectType

### 关联泛型

```ts
// 提取指定字段形成新的类型
let user = {
  id: 1,
  name: "张三",
  age: 18,
};
type PickUserType<T, K extends keyof T> = {
  [P in K]: T[P];
};

let newUser: PickUserType<user, "id" | "name"> = {
  id: 2,
  name: "李四",
};
```

## keyof any、keyof T
