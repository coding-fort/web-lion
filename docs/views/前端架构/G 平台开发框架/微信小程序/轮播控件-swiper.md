# 小程序轮播图

在微信小程序中，轮播图（Swiper）是一个非常常见的组件，用于展示一系列的图片或内容。下面我将提供一个简单的轮播图示例，包括 WXML、WXSS 和 JS 文件的代码。
[官网](https://developers.weixin.qq.com/miniprogram/dev/component/swiper.html)

## 1. 创建轮播图组件

假设我们在 `pages/index/index` 页面中添加一个轮播图。

### index.wxml

```xml
<view class="container">
  <swiper class="swiper" indicator-dots="{{indicatorDots}}" autoplay="{{autoplay}}" interval="{{interval}}" duration="{{duration}}">
    <block wx:for="{{imgUrls}}" wx:key="*this">
      <swiper-item>
        <image src="{{item}}" class="slide-image" mode="aspectFill"></image>
      </swiper-item>
    </block>
  </swiper>
</view>
```

### index.wxss

```css
.container {
  padding: 20px;
}

.swiper {
  height: 200px; /* 轮播图的高度 */
  width: 100%; /* 轮播图的宽度 */
}

.slide-image {
  width: 100%;
  height: 100%;
}
```

### index.js

```javascript
Page({
  data: {
    imgUrls: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
      "https://example.com/image3.jpg",
    ],
    indicatorDots: true, // 是否显示面板指示点
    autoplay: true, // 是否自动切换
    interval: 5000, // 自动切换时间间隔
    duration: 1000, // 滑动动画时长
  },
});
```

## 2. 解释

- **WXML**:

  - `<swiper>` 标签定义了一个轮播图组件。
  - `indicator-dots` 属性控制是否显示指示点。
  - `autoplay` 属性控制是否自动播放。
  - `interval` 属性设置自动播放的时间间隔。
  - `duration` 属性设置滑动动画的时间。
  - 使用 `wx:for` 循环遍历 `imgUrls` 数组，生成多个 `<swiper-item>`。

- **WXSS**:

  - `.container` 类设置了容器的内边距。
  - `.swiper` 类设置了轮播图的高度和宽度。
  - `.slide-image` 类确保每个轮播项中的图片能够填满整个轮播项，并保持其宽高比。

- **JS**:
  - `data` 对象中定义了 `imgUrls` 数组，包含要展示的图片 URL。
  - 其他属性如 `indicatorDots`、`autoplay`、`interval` 和 `duration` 用来配置轮播图的行为。

## 3. 运行效果

这个轮播图将会自动播放，每隔 5 秒切换一次图片，每次切换的动画时间为 1 秒。同时，底部会显示指示点来标识当前显示的是哪一张图片。

## 4. 扩展功能

- 如果需要自定义指示点样式，可以使用 CSS 来覆盖默认样式。
- 可以通过绑定事件处理函数（如 `bindchange`）来实现更多的交互功能，例如在用户手动滑动时执行某些操作。

这样，你就有了一个基本的轮播图组件。你可以根据实际需求进行进一步的定制和优化。

## 5. 事件

### 常用的 swiper 事件

- bindchange：当当前 swiper 的 index 发生变化时触发。
- bindtransition：当 swiper 动画开始时触发。
- bindanimationfinish：当 swiper 动画结束时触发。

## 6. 禁用滑动

你可以通过设置 `pointer-events: none;` 来禁用 `swiper` 的触摸事件，从而禁止滑动。

```xml
<!-- pages/index/index.wxml -->
<swiper style="pointer-events: none;" indicator-dots="{{indicatorDots}}" autoplay="{{autoplay}}" interval="{{interval}}" duration="{{duration}}">
  <block wx:for="{{imgUrls}}" wx:key="*this">
    <swiper-item>
      <view class="demo-slide-image">
        <image src="{{item}}" class="slide-image" />
      </view>
    </swiper-item>
  </block>
</swiper>
```

## 7. swiper-item 下的组件触摸事件不能触发

使用 `pointer-events: none;` 后可能会使子组件触摸事件不触发。
