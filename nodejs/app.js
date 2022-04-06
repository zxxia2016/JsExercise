import Fs from "fs";
import Path from "path";
// 返回运行文件所在的目录
// 当前命令所在的目录
let fn = Path.resolve() + '/nodejs/index.html';
let data = Fs.readFileSync(fn, 'utf8');
// console.log(data);

const reg = new RegExp(/<p class="footer".*p>/);
const ret = data.match(reg);
const bottomTips = `Powered by Game`;
data = data.replace(ret[0], `<p class="footer">${bottomTips}</a></p>`);
// companyprefix=Powered by;
// company=我是公司名;
console.log(data)