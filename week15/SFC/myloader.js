const parser = require("./parser");

module.exports = function (source, map) {
    const tree = parser.parseHTML(source);

    let template = null;
    let script = null;

    for (let node of tree.children) {
        if (node.tagName == "template") {
            template = node;
        } else if (node.tagName == "script") {
            script = node.children[0].content;
        }
    }

    let visit = (node) => {
        if (node.type === "text") {
            return JSON.stringify(node.content);
        }
        let attrs = {};
        for (let attr of node.attributes) {
            attrs[attr.name] = attr.value;
        }

        let children = node.children.map(node => visit(node));
        return `createElement("${node.tagName}", ${JSON.stringify(attrs)}, ${children})`;
    }


    let r = `
        import { createElement, Text, Wrap } from "./createElement";
        export class Carousel {
            constructor() {
                this.children = [];
                this.attributes = new Map();
            }
            setAttribute(name, value) {
                this.attributes.set(name, value);
            }
            render() {
                return ${visit(template)}
            }
            mountTo(parent) {
                this.render().mountTo(parent);
            }
        } 
    `
    return r
}