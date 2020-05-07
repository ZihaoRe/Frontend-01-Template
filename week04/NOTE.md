# week04 事件循环
setTimeout、setInterval不是 JS 语法本身的API，是JS的宿主浏览器提供的API，所以是宏任务。
而Promise是JS本身自带的API，这种就是微任务。

宿主提供的方法是宏任务，JS 自带的是微任务

一个宏任务中，只存在一个微任务队列，根据入队时间决定个微任务执行顺序，当前宏任务内微任务执行完之后才会执行下个宏任务

### 同步宏任务
同步任务指的是在 JS 引擎主线程上按顺序执行的任务，只有前一个任务执行完毕后，才能执行后一个任务，形成一个执行栈（函数调用栈）。
```js
console.log('script start');
console.log('script end');
````

### 异步宏任务

异步任务指的是不直接进入 JS 引擎主线程，而是满足触发条件时，相关的线程将该异步任务推进任务队列(task queue)，等待 JS 引擎主线程上的任务执行完毕，空闲时读取执行的任务，例如
- 异步 Ajax
- DOM 事件
- setTimeout/setInterval
- I/O
- UI rendering
- postMessage
- MessageChannel
- setImmediate(Node.js 环境)

### 微任务
微任务（micro-task/job）是在es6和node环境中出现的一个任务类型，如果不考虑 es6 和 node 环境的话，我们只需要理解宏任务事件循环的执行过程就已经足够了，但是到了 es6 和 node 环境，我们就需要理解微任务的执行顺序了。

微任务（micro-task）的 API 主要有:
- Promise.then
- async/await
- process.nextTick(Node.js 环境)
- Object.observer
- MutationObserver

微任务可以理解是在当前宏任务执行结束后立即执行的任务。也就是说，在当前宏任务后，下一个宏任务之前，在渲染之前。
所以它的响应速度相比setTimeout（setTimeout是task）会更快，因为无需等渲染。也就是说，在某一个 macrotask 执行完后，就会将在它执行期间产生的所有 microtask 都执行完毕（在渲染前）
###示例
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
//微任务1: async end, 微任务2: promise2
```




