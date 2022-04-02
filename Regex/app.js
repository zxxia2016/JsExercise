const str = `app.SysNotifyManager().ShowToast(app.i18n.t("Slot777_Gold_Inadequate"));`
const begin = "app.SysNotifyManager().ShowToast(app.i18n.t(";
const end = ")";
const reg = new RegExp(/app\.SysNotifyManager\(\)\.ShowToast\(app\.i18n\.t\((.*)\)\);/);
console.log(str.match(reg)[0]);
console.log(str.match(reg)[1]);


const ip = "Ping hog.forta.com [12.159.46.200]";
const ipReg = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
console.log(ipReg.test(ip));
console.log(ip.match(ipReg)[0]);
console.log(`end`);

let str1 = "/resources/images/beauty.jpg";
const re = str1.match(/.*\/.*\/(.*\..*)/);
console.log(re[1]);

