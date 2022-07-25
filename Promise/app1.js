console.log(`start app`);


const p = new Promise((resolve, reject) => {
    resolve(null);
});
p.then((data) => {
    //这个报错会终止程序
    data.toString();
});

setTimeout(() => {
    console.log(111)
}, 10000);