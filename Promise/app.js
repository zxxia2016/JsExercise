
console.log(`start app`);

new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log(`timeout`);
        //如果没调用resolve或reject函数是不会执行then函数的
        resolve();
    }, 5000);
}).then(() => {
    console.log(`then`);
})
console.log(`end app`);

/**
start app
Promise/app.js:2
end app
Promise/app.js:13
timeout
Promise/app.js:6
then
Promise/app.js:11
 */

