const npm = require("npm");

let config = {
    "name": "week18",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "author": "",
    "license": "ISC",
    "devDependencies": {
        "@babel/cli": "^7.10.5",
        "@babel/core": "^7.11.1",
        "@babel/preset-env": "^7.11.0",
        "@vue/compiler-sfc": "^3.0.0-rc.5",
        "npm": "^6.14.7"
    }
};

npm.load(config, (err) => {
    npm.install("webpack", (err) => {
        console.log(err)
    })
})

