# SVG 动画

2025-01-05 SVG 进阶-动画
动画
动画标签
● <animate> 标签
animate 基础动画
● 动画标签默认定义在图形标签内部，表示对当前图形进行动画设置；
● 通过动画标签属性 href，可以单独定义动画，再指定图形；
<circle cx="30" cy="30" r="10" fill="#fac">
<animate 
    attributeType="XML" 
    attributeName="cx"
    from="30"
    to="60"
    dur="1s"
    repeatCount="1"
    fill="freeze"
    ></animate>
</circle>
动画属性
● attribute 控制动画属性
○ attributeType：设置动画属性的类型，一般不建议设置。
■ auto：默认
■ CSS
■ XML
○ attributeName：设置具体的动画属性，支持 SVG 属性和 CSS 属性
● from/to/by 控制动画数值
○ from：起始点
○ to：结束点
○ by：经过多少值。与 to 二选一。
● dur 控制动画时长
○ 单一时间单位：1s、1000ms、1m
○ 时间组合：1.500（1500ms）、1:10（60s）
● repeatCount 控制动画次数
○ 具体次数
○ 无限次：indefinite
● repeatDur 控制动画总时长
○ 同 dur
● fill 控制最终形态
○ remove，默认，移除动画最终效果，恢复初始状态
○ freeze，保留动画最终效果
begin/end 控制动画起始
控制动画何时开始/结束，默认加载即开始。
● begin：控制动画延时开始
○ begin="2s"，延迟 2s 后开始；
○ begin="id.click"，按钮点击后开始；
○ begin="id.end"，前一个动画结束后开始；
○ begin="2s;id.end"，组合式，第一次延迟 2s，第二次前一个动画结束后；
○ begin="id.repeat(2)"，组合式，前一个动画重复两次后开始；
● end：控制动画延迟结束
○ 设置同 begin；
● restart：控制重复动画
○ always，默认，任何时刻都允许重新开始
○ whenNotActive，完成一次动画，才能开始下一次动画
○ never，不能重复动画（只执行一次）
<circle cx="30" cy="30" r="10" fill="#fac">
<animate 
    attributeType="XML" 
    attributeName="cx"
    from="30"
    to="60"
    dur="1s"
    repeatCount="1"
    fill="freeze"
    begin="btn2.click"
    ></animate>
</circle>

<!-- 按钮 -->
<g id="btn2">
  <text x="0" y="0">click</text>
</g>
values/keyTimes：控制动画过程
● from/to/by 失效；
● values="30;90;30"，提供过程中多个点的值，从30移动到90，再从90移动到30；
● keyTimes="0;0.25;1"， 配合values 使用，针对values 分段，设置每一段使用时长（dur的百分比）；
calcMode：控制运动速度
● 控制动画在运动过程中的速度变化
● linear，默认，匀速，受运动距离和keyTimes 影响
● paced，始终匀速，keyTimes 无效
● discrete，直接跳跃到目标位置，无中间过程
● spline，曲线（三次贝赛尔）变化，需配合keySplines 属性使用
keySplines：控制曲线速度
● calcMode="spline" 时生效；
● 根据values 每一段设置一个控制点，每段值0-1，使用空格间隔；
● keySplines="0 1 .5"

transform 变形动画
针对 transform 变化属性，使用<animateTransform> 标签。
type：控制变化属性
● 平移：translate，to 可设置一个值(x,0)，或坐标值(x,y)
● 旋转：rotate，to 可设置一个值(deg,0,0)，或三个值(deg,origin.x,origin.y)
● 斜切：skewX/skewY，to 设置角度
● 缩放：scale，to 可设置一个值(x,x)，或坐标值(x,y)
<rect x="30" y="30" width="40" height="60" fill="#fac">
<animateTransform 
    attributeType="XML" 
    type="translate"
    from="0"
    to="10 10"
    dur="1s"
    repeatCount="1"
    fill="freeze"
    ></animateTransform>
</rect>
多个变形动画
● 多个动画执行时，后面执行的动画会先恢复最初状态，再执行动画）
● 扩展属性 additive：效果累加，控制动画效果之间的关系
○ replace，默认，新动画会覆盖原动画效果（恢复初始状态再动画）
○ sum，新动画效果会在原动画效果基础上累加；
● 扩展属性 accumulate：效果累加，一个动画多次执行时，后一次动画效果是否基于前一次动画效果。
○ 相对值效果明显，通常搭配 by 使用
○ replace，默认，新动画会覆盖原动画效果（恢复初始状态再动画）
○ sum，新动画效果会在原动画效果基础上累加；

路径动画
<animateMotion> 标签
● 属性 path：同<path> 标签 d 属性；
● 属性 keyPoints：路径分段，分号间隔；
● 属性 rotate：控制图形在沿着路径运动过程中，保持与路径角度一致
○ auto，正向保持角度
○ auto-reverse，反向保持角度
● 子标签<mpath>：引用一个 path 图形，作为运动路径，推荐使用；
<path id="pt1" d="M20 50 A30 30 0 0 1 80 50A30 30 0 0 1 20 50" fill="none" stroke="#00f"></path>

<!-- 方式一：使用path -->
<circle cx="0" cy="0" r="3" fill="#f00" fill-opacity="0.8">
  <animateMotion
    path="M20 50 A30 30 0 0 1 80 50A30 30 0 0 1 20 50"
    dur="2s"
    fill="freeze">
  </animateMotion>
</circle>
<!-- 方式二：使用mpath -->
<circle cx="0" cy="0" r="3" fill="#f00" fill-opacity="0.8">
  <animateMotion
    dur="2s"
    fill="freeze">
    <mpath href="#pt1"></mpath>
  </animateMotion>
</circle>

set 设置变化
设置属性，使得图形发生一些变化，但没有变化过程。支持所有属性类型。
● 属性 attributeName，指定属性
● 属性 to，设置具体的属性值
● 属性 dur，保持时间
● 属性 begin，开始时间点
● 属性 fill
<rect x="30" y="30" width="40" height="60" fill="#fac">
<set attributeName="fill" to="red"></set>
</rect>
