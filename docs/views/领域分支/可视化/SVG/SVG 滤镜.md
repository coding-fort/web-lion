# SVG 滤镜

2025-01-06 SVG 进阶-滤镜
基本应用
<filter> 标签，定义滤镜容器，可以包含多个具体滤镜效果。滤镜不仅支持 SVG 方式引入，还支持 CSS 方式引入。
<defs>
<filter id="f1">
<feGaussianBlur stdDeviation="2"></feGaussianBlur>
</filter>
</defs>
<rect x="10" y="10" width="40" height="60" fill="#fac" filter="url(#f1)"></rect>
filter 基本属性
● x、y、width、height：控制滤镜的作用范围
○ 默认 x=y=-10%
○ 默认 width=height=120%；
● filterUnits：设置 filter 区域的数据单元
○ objectBoundingBox，默认，百分比，基于图形
○ userSpaceOnUse，具体值，基于坐标系
● primitiveUnits：设置 filter 容器内部具体滤镜区域的数据单元
○ objectBoundingBox
○ userSpaceOnUse，默认

filter 多个滤镜生效过程
● 某个滤镜作用在图形上，不会立即生效，而是存入缓存，可以使用 result 属性定义缓存名称；
● 下一个滤镜，可以使用 in 属性，将缓存中结果加入到当前滤镜中；
● 如果没有对缓存命名，下一个滤镜会默认装载上一个临近的滤镜效果；
● 使用 in 属性还可以对原图形进行处理，使用 SourceGraphic；
<feGaussianBlur stdDeviation="2" in="SourceGraphic" result="r1"></feGaussianBlur>

<!-- feOffset 虽没使用in 指定缓存，但也会加载r1 缓存 -->

<feOffset dx="2" dy="2" result="r1"></feOffset>

滤镜效果
shadow 阴影滤镜
● <feDropShadow> 标签
● 属性 dx、dy：横向、纵向偏移；
● 属性 stdDeviation：设置模糊程度，值越大，模糊越大；
● 属性 flood-color/flood-opacity：阴影颜色/透明度；
<defs>
<filter id="f1">
<feDropShadow stdDeviation="2" dx="3" dy="3"></feGaussianBlur>
</filter>
</defs>
<rect x="10" y="10" width="40" height="60" fill="#fac" filter="url(#f1)"></rect>
blur 模糊滤镜
● <feGaussianBlur> 标签
● 属性 stdDeviation：设置模糊程度，值越大，模糊越大；
● 属性 in：作用对象
○ SourceGraphic：作用于图像
○ SourceAlpha：对图像的透明度实现模糊（阴影效果）
● 属性 x、y、width、height：控制滤镜的作用范围
<defs>
<filter id="f1">
<feGaussianBlur stdDeviation="2"></feGaussianBlur>
</filter>
</defs>
<rect x="10" y="10" width="40" height="60" fill="#fac" filter="url(#f1)"></rect>
offset 位移滤镜
● <feOffset> 标签
● 属性 dx、dy：横向、纵向偏移；
<defs>
<filter id="f1">
<feOffset dx="3" dy="3"></feOffset>
</filter>
</defs>
<rect x="10" y="10" width="40" height="60" fill="#fac" filter="url(#f1)"></rect>
merge 合并滤镜
● <feMerge>、<feMergeNode> 标签
● 默认多个滤镜效果只能按顺序生效
<defs>
<filter id="f1">
<feGaussianBlur stdDeviation="2" in="SourceGraphic" result="r1"></feGaussianBlur>
<feOffset dx="3" dy="3" result="r1"></feOffset>
<feMerge>
<feMergeNode in="SourceGraphic"></feMergeNode>
<feMergeNode in="r1"></feMergeNode>
</feMerge>
</filter>
</defs>
<rect x="10" y="10" width="40" height="60" fill="#fac" filter="url(#f1)"></rect>
blend 混合滤镜
● <feBlend> 标签
● 将多个滤镜合并，并且产生叠加；
● 属性 in、in2：上面/下面输入源
● 属性 mode：混合模式
○ normal，默认，按叠加顺序；
○ screen，两个输入源颜色反向相乘，黑色偏原色，白色偏白；
○ darken，两个输入源颜色，像素颜色使用暗色；
○ lighten，两个输入源颜色，像素颜色使用亮色；
○ multipy，两个输入源颜色相乘，黑色偏黑，白色偏原色；
<defs>
<filter id="f1">
<feImage href="./imgs/2.png" width="100" height="100" 
      preserveAspectRatio="xMidYMid slice" 
      result="img">  
 </feImage>
<feBlend in="img" in2="SourceGraphic" mode="screen"></feBlend>
</filter>
</defs>
<image href="./imgs/1.png" x="10" y="10" width="100" height="100"
filter="url(#f1)"
preserveAspectRatio="xMidYMid slice"

> </image>
> composite 合成滤镜
> ● <feComposite> 标签
> ● 将两个图形合成一个图形，针对图形的形状。
> ● 属性operator：控制合成效果
>   ○ over，默认，上下源叠放
>   ○ in，显示两个图形重叠部份，使用上层（in）颜色；
>   ○ out，显示两个图形不重叠部份，使用上层（in）颜色；
>   ○ atop，显示两个图形重叠部份和下层（in2）未重叠部份；
>   ○ xor，显示两个图形不重叠部份；
>   ○ lighter，显示两个图形；
>   ○ arithmetic，通过计算得出显示图形，配合属性k1、k2、k3、k4；

    ■ k1 影响两个图形
    ■ k2 影响in 图形
    ■ k3 影响in2 图形
    ■ k4 偏移量

<defs>
  <filter id="f1" x="0" y="0">
    <feImage href="./imgs/2.png" width="100" height="100"
      result="img">  
    </feImage>
    <feComposite in="img" in2="SourceGraphic" mode="over"></feComposite>
  </filter>
</defs>
<circle cx="50" cy="50" r="50" fill="#fac" filter="url(#f1)"></circle>
matrix 色彩矩阵滤镜
● <feColorMatrix> 标签
● 利用转换矩阵进行计算，实现色彩变化，控制亮度、饱和度、对比度、灰度效果。
● 通过原RGBA 值使用4*5 列矩阵计算新的RGBA 值；
  ○ 行分别代表R、G、B、A；
  ○ 列分别代表混合系数k1、k2、k3、k4、k5，其中k1-k4 表示混入RGBA，k5 表示偏移量；
  ○ 计算公式（以R通道为例）：new_R = k1 * R + k2 * G + k3 * B + k4 * A + k5；
● RGB 等比例增减，影响对比度
● RGB 增减偏移量，影响亮度
● RGB 值只保留一个通道，影响灰度
● 属性in：作用对象
● 属性type：混合类型
  ○ matrix：矩阵方式
  ○ saturate：饱和度
  ○ hueRotate：色相
  ○ luminanceToAlpha：根据亮度转换成透明度，越亮越可见，越暗越透明；values 无效；
● 属性values
  ○ 矩阵参数（matrix，4*5 列矩阵）
  ○ 饱和度值（saturate，0-1降低，1-n增加）
  ○ 色相值（hueRotate，0-360）
<defs>
  <filter id="f1" x="0" y="0">
    <feColorMatrix
      in="SourceGraphic"
      type="matrix"
      values="
        1 0 0 0 0
        0 1 0 0 0
        0 0 1 0 0 
        0 0 0 1 0
      "
      ></feColorMatrix>
  </filter>
</defs>
<image x="0" y="0" width="50" height="100" fill="none" filter="url(#f1)"></image>
transfer 颜色通道滤镜
针对每个颜色通道实现色彩变化处理。可以操作亮度、对比度、饱和度、灰度，相对martix 更精确。
● <feComponentTransfer> 、<feFuncR>、<feFuncG>、<feFuncB>、<feFuncA>标签
● 属性type：控制通道计算方式
  ○ identity：默认，唯一，不转变；
  ○ linear：线性，配合属性slope，intercept，计算new_C=slope*R + intercept；
  ○ gamma：曲线，配合属性amplitude，exponent，offset，计算new_r=amplitude*pow(R,exponent)+offset；
  ○ table：颜色区间映射，配合属性tableValues；
    ■ tableValues="0 0.2 1"，三个值分成两个区间，默认[0, 0.5][0.5, 1]，调整成[0, 0.2][0.2, 1]；
    ■ 颜色0, 255区间段，最多可以提供256个映射值；
  ○ discrete：离散映射，配合属性tableValues；
    ■ tableValues="0 0.2 1"，三个值分成三个区间，[0, 0][0.2, 0.2][1, 1]；
<defs>
  <filter id="f1" x="0" y="0">
    <feComponentTransfer in="SourceGraphic">
      <!-- 红色通道 -->
      <feFuncR type="linear" slope="2" intercept="1"></feFuncR>
    </feComponentTransfer>
  </filter>
</defs>
<rect x="10" y="10" width="40" height="60" fill="#fac" filter="url(#f1)"></rect>
morphology 形态滤镜
实现图像的腐蚀和扩展。
● <feMorphology> 标签
● 属性in：作用对象
● 属性operator
  ○ erode，变细
  ○ dilate，变粗
● 属性radius：变化程度
● 应用：不规则图形描边
<defs>
  <filter id="f1" x="0" y="0">
    <feMorphology operator="erode" radius=".2">
    </feMorphology>
  </filter>
</defs>
<text x="20" y="20" filter="url(#f1)">hello world</text>
map 位移映射滤镜
创建水波，涟漪，扭曲等视觉效果。
● <feDisplacementMap> 标签
● 属性in/in2
● 属性scale
● 属性xChannelSelector/yChannelSelector
<defs>
  <filter id="f1">
    <feImage href="./imgs/2.png" x="0" y="0" width="100" height="100" result="img" />
    <feDisplacementMap in="img1" in2="SourceGraphic" 
      scale="20"
      xChannelSelector="R" 
      yChannelSelector="G"
      >
    </feDisplacementMap>
  </filter>
</defs>
<g filter="url(#f1)">
  <rect x="0" y="0" width="40" height="60" fill="rgba(255,0,0,.5)"></rect>
  <rect x="50" y="0" width="40" height="60" fill="rgba(0,255,0,.5)"></rect>
</g>
turbulence 湍流滤镜
利用噪声函数，创建半透明或波纹形状。
● <feTurbulence> 标签
● 属性baseFrequency：设置波纹图形区域的大小，值越大，图形越小；
  ○ 一个值，横向/纵向拉伸一致
  ○ 两个值，横向/纵向单独控制
● 属性numOctaves：设置噪声的精细度，值越大，越精细，需要消耗更高性能；
● 属性seed：可以生成不同形状的条纹，随机数值，配合属性type 使用
● 属性type：波纹形状
  ○ turbulence，形状混乱，表现为随机
  ○ fractalNoise，分型噪声更平缓，带有模糊效果
● 属性stitchTiles：两块使用湍流滤镜的图形拼接在一起时，拼接缝处湍流效果的控制
  ○ noStitch：不拼接
  ○ stitch：拼接
<defs>
  <filter id="f1">
    <feTurbulence baseFrequency="0.5"></feTurbulence>
  </filter>
</defs>
<rect x="10" y="10" width="40" height="60" fill="#fac" filter="url(#f1)"></rect>
滤镜与动画
数值型属性基本都支持动画效果。
● 文字+湍流动画
● 图形+湍流动画，实现水波纹流动
● 图形+位移映射，实现图像涟漪
<defs>
  <filter id="f1">
    <feGaussianBlur stdDeviation="0">
      <animate
        attributeName="stdDeviation"
        to="2"
        dur="2s"
        fill="freeze"
        ></animate>
    </feGaussianBlur>
  </filter>
</defs>
<rect x="10" y="10" width="40" height="60" fill="#fac" filter="url(#f1)"></rect>
