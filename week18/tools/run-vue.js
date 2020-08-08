const compiler = require("@vue/compiler-sfc");

let output = compiler.compileTemplate({
    filename: 'example.vue',
    source: "<div>Hello World!</div>"
})
console.log(output)