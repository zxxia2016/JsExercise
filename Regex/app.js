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


const strName = `"Nickname":"  ท้องฟ้าเวิ"`
const search = `"Nickname":"`;
const rrrr = strName.indexOf(search);
const rrrrr = strName.indexOf(`"`, rrrr + search.length);
const re1 = strName.substring(0, rrrr + search.length) + strName.substring(rrrrr, strName.length);
const strName1 = `"Nickname":"  ท้องฟ้าเวิ้งว้า"`

const strConfig = `GLOBAL_CONFIG.LogSwitch = true;11111`;
const rrr = strConfig.match(/^\s?GLOBAL_CONFIG.LogSwitch\s?=\s?([a-z]+);\s?/);
if (rrr) {
    console.log(rrr[0]);
    console.log(rrr[1]);

}

const v = '%\{number\}'
let phrase = `Quer ganhar %{number}+ por mês`;
var replace = String.prototype.replace;
phrase = replace.call(phrase, new RegExp(v, 'g'), '111');
console.log(phrase);

console.log(`-----------------------------`);