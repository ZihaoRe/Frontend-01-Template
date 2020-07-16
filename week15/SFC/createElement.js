export function createElement(Cls, attributes, ...children) {
    let o;
    if (typeof Cls === "string") {
        o = new Wrapper(Cls)
    } else {
        o = new Cls;
    }

    for (let name in attributes) {
        o.setAttribute(name, attributes[name]);
    }
    // console.log(children)
    for (let child of children) {
        if (typeof child === "string") {
            child = new Text(child);
        }
        o.appendChild(child);
    }
    return o;
}

export class Text {
    constructor(text) {
        this.root = document.createTextNode(text);
    }
    mountTo(parent) {
        parent.appendChild(this.root);
    }
}

export class Wrapper {
    constructor(type) {
        this.children = [];
        this.root = document.createElement(type);
    }
    set class(v) {//property
        console.log("Parent::class", v)
    }
    setAttribute(name, value) {
        this.root.setAttribute(name, value);
    }
    mountTo(parent) {
        parent.appendChild(this.root);
    }
    appendChild(child) {
        this.children.push(child);
        for (let child of this.children) {
            child.mountTo(this.root);
        }
    }
}