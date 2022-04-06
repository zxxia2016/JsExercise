
console.log(`start app`);

// start app >> end app >> timeout >> then
new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log(`timeout`);
        //如果没调用resolve或reject函数是不会执行then函数的
        resolve();
    }, 5000);
}).then(() => {
    console.log(`then`);
})

// 执行异步队列任务

let f1 = function () {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`f1`);
            resolve();
        }, 2000);
    });
};

let f2 = function () {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`f2`);
            resolve();
        }, 1000);
    });
};

let f3 = function () {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`f3`);
            resolve();
        }, 3000);
    });
};

const plist = [f1, f2, f3];
// 递归调用
// 使用 await & async
async function promise_queue(list) {
    let index = 0
    while (index >= 0 && index < list.length) {
        await list[index]();
        index++
    }
}
promise_queue(plist);

console.log(`end app`);





