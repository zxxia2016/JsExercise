console.log(`start app`);
// async await promise


async function f() {
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`timeout`);
            resolve();
        }, 3000);
    });
    console.log(`done app`);
}
f();

function f1() {
    const p = new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`timeout1`);
            reject();
        }, 3000);
    });
    p.then(() => console.log(`resolve`)).catch(() => {
        console.log(`reject`)
    });
}
f1();
