// import "./foo";

function createElement(Cls, attributes, ...children) {
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

class Text {
    constructor(text) {
        this.root = document.createTextNode(text);
    }
    mountTo(parent) {
        parent.appendChild(this.root);
    }
}

class Wrapper {
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

////////////////////////////////////////////////////
class MyComponent {
    constructor(config) {
        this.children = [];
        this.attributes = new Map();
    }
    setAttribute(name, value) {
        this.attributes.set(name, value);
    }
    mountTo(parent) {
        this.render().mountTo(parent);

        for (let child of this.children) {
            this.slot.appendChild(child);
        }
    }
    appendChild(child) {
        this.children.push(child);
    }
    render() {
        this.slot = <div></div>;
        return (
            <article>
                <h1>{this.attributes.get("title")}</h1>
                <header>header</header>
                {this.slot}
                <header>footer</header>
            </article>
        )
    }
}

let component = (
    <MyComponent id="a" class="b" title="i'm title">
        <div>test</div>
    </MyComponent>
)
component.mountTo(document.body);
console.log(component);