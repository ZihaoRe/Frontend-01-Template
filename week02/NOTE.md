# 每周总结
非形式语言： 中文，英文 形式语言

- 0型 无限制文法
- 1型 上下文相关文法
- 2型 上下文无关文法
- 3型 正则文法

<产生式BNF> - 用尖括号括起来的名称来表示

一个a和b组成的语言
```
"a"
"b"
<program>:= "a"+ | "b"+
<program>:= <program> "a"+ | <program> "b"+
```
定义四则运算
```
<Number> = "0"|"1"|"2" | ..... | "9"

<DecimalNumber> = "0" | (("1"|"2"| .... | "9") <Number>*)   //(/0|[1-9][0-9]*/)

<PrimaryExpression> = <DecimalNumber> |
    "(" <LogicalExpression> ")"

<MultiplicativeExpression> = <PrimaryExpression> |
    <MultiplicativeExpression> "*" <PrimaryExpression> |
    <MultiplicativeExpression> "/" <PrimaryExpression>

<AdditiveExpression> = <MultiplicativeExpression> |
    <AdditiveExpression> "+" <MultiplicativeExpression> |
    <AdditiveExpression> "-" <MultiplicativeExpression> |


<LogicalExpression> = <AdditiveExpression> |
    <LogicalExpression> "||" <AdditiveExpression> |
    <LogicalExpression> "&&" <AdditiveExpression>

<ExponentiationExpression> = <MultiplicativeExpression> |
    <MultiplicativeExpression> "*" <ExponentiationExpression>  （右结合）
```
图灵完备性： 一切可计算的问题都能计算，这样的虚拟机或者编程语言就叫图灵完备的
    命名式 --- 图灵机
        goto
        if while
    声明式 --- lambda
        递归

动态与静态
    动态： Runtime
    静态： 产品开发、Compiletime
Unicode 字符集 Blocks Cate



