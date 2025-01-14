# Vue 过滤属性

在 Vue 2 中，过滤器（Filters）是一种用于格式化文本显示的工具。它们可以在必须对数据进行特定格式化处理（如日期格式化、货币转换等）时非常有用。过滤器可以应用于双大括号插值和 `v-bind` 表达式中。然而需要注意的是，在 Vue 3 中官方已经移除了对过滤器的支持，推荐使用计算属性或方法来替代。

## 1.使用过滤器

### 定义全局过滤器

你可以通过 `Vue.filter()` 方法定义一个全局过滤器，这样它就可以在整个应用程序中使用。

```javascript
// 注册一个全局过滤器
Vue.filter("capitalize", function (value) {
  if (!value) return "";
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
});
```

### 定义局部过滤器

你也可以在组件选项中定义局部过滤器，这些过滤器只能在该组件内部使用。

```javascript
export default {
  // ...
  filters: {
    capitalize(value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
};
```

### 使用过滤器

一旦定义了过滤器，你就可以在模板中使用管道符号 (`|`) 来应用它们。

```html
<!-- 在双大括号插值中 -->
<p>{{ message | capitalize }}</p>

<!-- 在 v-bind 中 -->
<span :id="rawId | formatId"></span>
```

## 2.过滤器链

你可以将多个过滤器链接在一起，按照从左到右的顺序依次应用。

```html
<!-- 多个过滤器 -->
<p>{{ message | filterA | filterB }}</p>
```

## 3.参数传递

过滤器还可以接受额外的参数，这使得它们更加灵活。

```html
<!-- 传递静态参数 -->
{{ message | filterByArg('arg') }}

<!-- 传递动态参数 -->
{{ message | filterByDynamicArg(someProp) }}
```

```javascript
filters: {
  filterByArg(value, arg) {
    // 使用 arg 对 value 进行处理
    return value + ' ' + arg;
  },
  filterByDynamicArg(value, dynamicArg) {
    // 使用 dynamicArg 对 value 进行处理
    return value + ' ' + dynamicArg;
  }
}
```

## 4.实际案例

下面是一些实际使用的例子：

### 格式化日期

```javascript
Vue.filter("formatDate", function (value) {
  if (value) {
    return new Date(value).toLocaleDateString();
  }
});
```

```html
<p>发表于 {{ post.date | formatDate }}</p>
```

### 货币格式化

```javascript
Vue.filter("currency", function (value) {
  var formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  return formatter.format(value);
});
```

```html
<p>价格：{{ product.price | currency }}</p>
```

### 文本截断

```javascript
Vue.filter("truncate", function (text, length, suffix) {
  if (text.length > length) {
    return text.substring(0, length) + (suffix || "...");
  } else {
    return text;
  }
});
```

```html
<p>{{ longText | truncate(100, '...') }}</p>
```

## 5.注意事项

- **性能考虑**：虽然过滤器可以简化模板代码，但过度使用可能会导致性能问题，尤其是在复杂列表渲染中。因此，请谨慎选择何时以及如何使用过滤器。
- **替代方案**：在 Vue 3 中，官方建议使用计算属性或方法来代替过滤器。这样做不仅能够获得更好的类型推断支持，还能让逻辑更清晰地组织在 JavaScript 中而不是模板里。

## 总结

Vue 2 的过滤器提供了一种简洁的方式来处理视图层的数据格式化需求。尽管它们在 Vue 3 中被移除，但对于仍在使用 Vue 2 的项目来说，了解并正确使用过滤器仍然是有价值的技能。如果你有更多问题或需要进一步的帮助，请随时告诉我！
