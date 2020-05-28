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

伪元素
::first-line不能有float  ::first-letter可以，
因为float会让::first-line脱离文档流，形成新的::first-line，造成无限循环
```