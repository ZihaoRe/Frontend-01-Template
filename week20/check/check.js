var page = require('webpage').create();
page.open('http://localhost:8080/', function(status) {
    console.log("Status: " + status)
    if (status === "success") {
        var body = page.evaluate(function () {
            var toString = function (pad, element) {
                var children = element.children;
                var childrenString = "";
                for (var i=0;i<element.children.length;i++) {
                    childrenString += toString("    " + pad, element.children[i]) + "\n";
                }
                return pad + element.tagName + (children && children.length ? "\n" + childrenString : "");
            }
            return toString("", document.body);
        })
        console.log(body)
    }
    phantom.exit();
});