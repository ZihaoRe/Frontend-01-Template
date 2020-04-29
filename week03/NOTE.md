# 总结
```
原生对象
Error: [[ErrorData]]
Boolean: [[BooleanData]]
Number: [[NumberData]]
Date: [[DateValue]]
RegExp: [[RegExpMatcher]]
Symbol: [[SymbolData]]
Map: [[MapData]]

特殊对象
window  在全局作用域中声明的变量、函数都是window对象的属性和方法 

Object.prototype 原型链始终指向null不可修改 

Function 
    [[call]] 视为函数Function
    [[Construct]] 可以被new 操作符调用，根据new的规则返回对象

Array   
    [[DefineOwnProperty]]
    Property == length
        设置对象的length属性，根据length的变化对对象进行操作 
        newLength > length 用空扩充数组
        newLength < length 截取数组

String  length属性只读

this 函数运行时，自动生成的一个内部对象，只能在函数内部使用，this不能在执行期间被赋值

Arguments 一个类数组对象，包含着传入函数中的所有参数
    [[callee]] 一个指针，指向拥有这个arguments对象的函数

Module Namespece
    [[Module]]  视为一个引入的模块
    [[Exports]] 视为一个导出的模块

Delete delete 操作符

