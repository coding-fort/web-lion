# Canvas 滤镜

使用属性 context.filter 设置一个或多个滤镜。

## 模糊滤镜 blur

- `context.filter = 'blur(10px)'`，值越大，越模糊

## 亮度滤镜 brightness

- `context.filter = 'brightness(%)'`，1 默认，<1 变暗，>1 变亮

## 对比度滤镜 contrast

- `context.filter = 'contrast(%)'`，1 默认，<1 接近，>1 鲜明

## 饱和度滤镜 saturate

- `context.filter = 'contrast(%)'`，1 默认，<1 变灰，>1 鲜明

## 灰度滤镜 grayscale

- `context.filter = 'grayscale(%)'`，0 默认，1 变灰

## 深褐色（怀旧）滤镜 sepia

- `context.filter = 'sepia(%)'`，0 默认，1 褐色

## 反色（负片）滤镜 invert

- `context.filter = 'invert(%)'`，0 默认，1 反色

## 阴影滤镜 drop-shadow

- `context.filter = 'drop-shadow(10px 10px 10px #fac)'`

## 色相偏移滤镜 hue-rotate

- `context.filter = 'hue-rotate(deg)'`，色轮 0-360deg

## 多个滤镜

- `context-filter = 'hue-rorate(180deg) contrast(0.5)'`

## 使用 svg 滤镜

- `context-filter='url(svgFilterID)'`
