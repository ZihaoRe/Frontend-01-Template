import { parseHTML } from "../src/parser.js";
import assert from "assert";


it('parse a single element', function () {
    let document = parseHTML("<div></div>")
    let div = document.children[0];
    assert.equal(div.tagName,"div");
    assert.equal(div.children.length,0);
    assert.equal(div.type,"element");
    assert.equal(div.attributes.length,0);
});

it('parse a single element contains text node', function () {
    let document = parseHTML("<div>hello</div>")
    let text = document.children[0].children[0];

    assert.equal(text.content,"hello");
    assert.equal(text.type,"text");

});

it("tag mismatch", () => {
    try {
        let doc = parseHTML("<div></vid>")
    } catch (e) {
        console.log(e)
        assert.equal(e.message, "Tag doesn't match!");
    }
})

it("tag contains attributes", () => {
    let doc = parseHTML("<div class='test'></div>")
    let div = doc.children[0];

    assert.equal(div.attributes.length,1);
    assert.equal(div.attributes[0].name,"class");
    assert.equal(div.attributes[0].value,"test");
})

it("self closing tag", () => {
    let doc = parseHTML("<img/>")
    let img = doc.children[0];
})

it("attributes dosen't have value", () => {
    let doc = parseHTML("<div class><img class /><img class/></div><div class  ></div>")
})
