# week 8
```
优先级计算 inline  id  class/attr  tag 

div#a.b .c[id=x]  [0, 1, 3, 1]//attr = class

#a:not(#b)        [0, 2, 0, 0]//:not 不参与计算

*.a               [0, 0, 1, 0]// *不参与计算

div.a             [0, 0, 1, 1]

依赖树结构的伪类
:empty
:nth-child()
:nth-last-child()
:first-child :last-child :only-child

只有:nth-child()/:first-child/:empty 不需要回溯


::first-line（选中的是盒子）不能有float  ::first-letter可以，
因为float会让::first-line脱离文档流，形成新的::first-line，造成无限循环
```

现代浏览器盒的宽度默认表示content-width，可以用box-sizing影响：content-box、border-box

- content-box w3c标准盒模型

- border-box IE盒模型 / 怪异盒模型

### w3c标准盒模型

width和height不包括padding和border 

### ie盒模型

width和height包含padding和border
ie8以上都是w3c标准盒模型    ie5极其以下都是ie盒子模型，ie6、ie7、ie8在混杂模式下ie盒模型，在标准模式下是w3c标准盒模型
(注意：ie6在混杂模式下一定是Ie盒模型，而ie7、ie8在混杂模式下不一定是ie盒模型)
css3中的box-sizing

#### float
浮动元素会脱离文档流并向左/向右浮动，直到碰到父元素或者另一个浮动元素

clear属性不允许被清除浮动的元素的左边/右边挨着浮动元素，底层原理是在被清除浮动的元素上边或者下边添加足够的清除空间

#### IFC(inline formatting context)
inline box如果中间没有任何文字的话基线在底部

#### BFC(block formatting context)
- block-level表示可以被放入BFC
- block-container表示可以容纳BFC
- block-box = block-level + block-container，大部分只会发生在display:block情况下
- block-box如果overflow是visible，就和父BFC合并

一个BFC内部的block level才会有margin折叠，而且只有cross方向

只要创建一个能容纳正常流的容器(block container)，都生成了一个新的BFC，特例是overflow: visible

例如inline-block:可以当两部分看，对外面的它的兄弟节点来说，他是一个inline元素，不是box level，对它包含的元素来说，他是一个可以包含block的container，建立BFC
