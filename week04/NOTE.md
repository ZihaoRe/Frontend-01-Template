# 每周总结可以写在这里
setTimeout、setInterval不是 JS 语法本身的API，是JS的宿主浏览器提供的API，所以是宏任务。
而Promise是JS本身自带的API，这种就是微任务。

宿主提供的方法是宏任务，JS 自带的是微任务

一个宏任务中，只存在一个微任务队列，根据入队时间决定个微任务执行顺序，当前宏任务内微任务执行完之后才会执行下个宏任务

```js
new Promise(resolve => resolve()).then(()=>console.log(1))

setTimeout(()=>console.log(2),0)

console.log(3)

//312
//第一个宏任务 31
//第二个宏任务 2
```

```js
async function afoo(){
    console.log("-2")
    await new Promise(resolve => resolve());
    console.log("-1")
}

new Promise(resolve => (console.log("0"), resolve()))
    .then(()=>(
        console.log("1"), 
        new Promise(resolve => resolve()).then(() => console.log("1.5")) 
    )
);

setTimeout(function(){//下一个宏任务
    console.log("2");
    new Promise(resolve => resolve()).then(() =>console.log("3"))
}, 0)
console.log("4");
console.log("5");
afoo()

//0,4,5,1,-1,1.5,2,3 
//第一个宏任务 
//   同步 0,4,5
//   (入队1,-1)
//   1 
//   (1.5入队)  
//   -1  
//   1.5
//第二个宏任务  
//   2  
//   3

async function async1() {
    console.log('async1 start');
    await async2();
    console.log('async1 end');
}
async function async2() {
    console.log('async2');
}
async1();
new Promise(resolve =>{
    console.log('promise1');
    resolve();
}).then(function () {
    console.log('promise2');
});

//async1 start, async2, promise1 同步代码
//微任务1 async end, 微任务2 promise2
```




