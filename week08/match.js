const reg = /^([a-z|A-Z]+)?(#[a-z|A-Z]+)?(\.[a-z|A-Z]+)?(\[[a-z|A-Z]+=[a-z|A-Z]+\])?$/;

function isMatched (selector, element) {
    const result = selector.match(reg)
    let isMatch = false
    if (!result) {
        return false
    }
    let [temp, tag, id, className, attr] = result
    if (tag) {
        isMatch = tag === element.tagName.toLowerCase()
    }
    if (id) {
        isMatch = id.slice(1) === element.id
    }
    if (className) {
        isMatch = className.slice(1) === element.className
    }
    if (attr) {
        let reg = /([a-z|A-Z]+)=([a-z|A-Z]+)/
        let [temp, key, value] = reg.exec(attr)
        isMatch = element.hasAttribute(key) && element.getAttribute(key) === value
    }
    return isMatch
}

function match (selector, element) {
    if (!selector || !element) {
        return false
    }
    let selectorList = selector.split(' ').reverse();//todo 按子孙选择器拆分，从最后一个开始匹配，暂时没时间做其他复合选择器，伪类等
    let i = 0
    if (isMatched(selectorList[i++], element)) {
        element = element.parentNode
        while (i < selectorList.length && element && element !== document) {
            if (isMatched(selectorList[i], element)) {
                element = element.parentNode
                i++
            } else {
                break;
            }
        }
    }
    return selectorList.length <= i
}

