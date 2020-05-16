let currentToken = null;
let currentAttribute = null;

function emit(token) {
    console.log(token)
}

const EOF = Symbol("EOF");//EOF: End Of File, 唯一标识，解析结束

function data (c) {
    if (c === "<") {//开始接收open tag
        return tagOpen;
    } else if (c === EOF) {//结束
        emit({
            type: "EOF"
        });
        return ;
    } else {//接收文本
        emit({
            type: "text",
            content: c
        });
        return data;
    }
}
function tagOpen (c) {
    if (c === "/") {//这是一个end tag
        return endTagOpen;
    } else if (c.match(/^[a-zA-Z]$/)){//接收open tag的tag name，新建一个token，还不知道是不是自闭合的
        currentToken = {
            type: "startTag",
            tagName: ""
        }
        return tagName(c);
    } else if (c === ">") {
        emit(currentToken)
    } else {
        return;
    }
}
function tagName (c) {
    if (c.match(/^[\t\n\f ]$/)) {//遇到空格，说明后面要处理属性了
        return beforeAttributeName;
    } else if (c === "/") {//说明这是一个自闭合tag
        return selfClosingStartTag;
    } else if (c.match(/^[a-zA-Z]$/)) {//记录tagName,还在处理tagName
        currentToken.tagName += c;//.toLowerCase()标准里面是要转成小写的
        return tagName
    } else if (c === ">") {//tagName结束，回到data
        emit(currentToken);//提交token
        return data;
    } else {
        return tagName;
    }
}

function beforeAttributeName (c) {
    if (c.match(/^[\t\n\f ]$/)) {//如果继续是空格，继续当前状态等待属性名 <div     name
        return beforeAttributeName;
    } else if (c === "/" || c === ">" || c === EOF) {
        return afterAttributeName(c);
    } else if (c === "=") {//非法html，抛错

    } else {//正常属性名，创建一个属性节点
        currentAttribute = {
            name: "",
            value: ""
        }
        return attributeName(c);
    }
}
function attributeName(c) {
    if (c.match(/^[\t\n\f ]$/) || c === "/" || c === ">" || c === EOF) {
        return afterAttributeName(c);
    } else if (c === "=") {//属性名结束，开始处理属性值
        return  beforeAttributeValue;
    } else if (c === "\u0000") {//null，异常抛错

    } else if (c === "\"" || c === "'" || c === "<") {

    } else {//正常属性名，继续接收属性名
        currentAttribute.name += c;
        return attributeName;
    }
}
function afterAttributeName(c) {

}
function beforeAttributeValue (c) {
    if (c.match(/^[\t\n\f ]$/) || c === "/" || c === ">" || c === EOF) {
        return beforeAttributeValue;
    } else if (c === "\"") {
        return doubleQuotedAttributeValue;
    } else if (c === "\'") {
        return singleQuotedAttributeValue;
    } else if (c === ">") {

    } else {//不是特殊字符，说明是无引号的属性
        return UnquotedAttributeValue(c);
    }
}
function doubleQuotedAttributeValue (c) {//双引号形式的属性值

}
function singleQuotedAttributeValue (c) {//单引号形式的属性值

}
function afterQuotedAttributeValue (c) {//

}
function UnquotedAttributeValue (c) {//无引号形式的属性值
    if (c.match(/^[\t\n\f ]$/)) {//接收到空格，说明属性值接收完了，记录属性标签, 回到等待属性名状态
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforeAttributeName;
    }
}
function selfClosingStartTag (c) {
    if (c === ">") {//记录自闭合标签，回到data状态
        currentToken.isSelfClosing = true;
        return data;
    } else if (c === EOF) {//结束

    } else {

    }
}
function endTagOpen (c) {
    if (c.match(/^[a-zA-Z]$/)) {//接收end tag的tagName
        currentToken = {
            type: "endTag",
            tagName: ""
        }
        return tagName(c);
    } else if (c === ">") {

    } else if (c === EOF) {//结束

    } else {

    }
}

module.exports.parserHTML = function parserHTML(html) { //用函数实现的状态机，一个函数代表一种状态
    let state = data;
    for (let c of html) {
        state = state(c);
    }
    state = state(EOF);
}