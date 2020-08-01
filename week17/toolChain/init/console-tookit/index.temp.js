const tty = require('tty');
const ttys = require('ttys');
const readline = require("readline")

const stdin = ttys.stdin;
const stdout = ttys.stdout;


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

async function ask(question) {
    return new Promise((resolve, reject) => {
        rl.question(question, (answer) => {
            resolve(answer)
        })
    })
}

void async function () {
    console.log(await ask("your project name?"))
}()