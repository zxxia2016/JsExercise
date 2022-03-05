
console.log(`start app`);

new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log(`dfadddf`);
        //如果没调用resolve或reject函数是不会执行then函数的
        resolve();
    }, 5000);
}).then(() => {
    console.log(`then`);
})
console.log(`end app`);

