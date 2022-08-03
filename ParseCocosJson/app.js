
import fs from "fs";
import path from "path";

let fn = path.resolve() + '/ParseCocosJson/hall_help.js';
let fn1 = path.resolve() + '/ParseCocosJson/hall_help1.ts';

let g_map = new Map();
let g_propertyEndIdx = -1;

function uuid() {
    var ret = '', value;
    for (var i = 0; i < 32; i++) {
        value = Math.random() * 16 | 0;
        // Insert the hypens
        if (i > 4 && i < 21 && !(i % 4)) {
            ret += '-';
        }
        // Add the next random character
        ret += (
            (i === 12) ? 4 : (
                (i === 16) ? (value & 3 | 8) : value
            )
        ).toString(16);
    }
    return ret;
}

function hexdec(hexString) {
    return parseInt(hexString, 16);
}

function typeid(id) {
    let uuid = id.replace(/-+/g, "");
    let endPos = id.length == 22 ? 2 : 5;
    let qianwu = id.substr(0, endPos);
    let ase64KeyChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let length = uuid.length;
    let i = endPos;
    let zi = "";
    while (i < length) {
        let hexVal1 = hexdec(uuid[i]);
        let hexVal2 = hexdec(uuid[i + 1]);
        let hexVal3 = hexdec(uuid[i + 2]);
        zi += ase64KeyChars[(hexVal1 << 2) | (hexVal2 >> 2)];
        zi += ase64KeyChars[((hexVal2 & 3) << 4) | hexVal3];

        i += 3;
    }
    return qianwu + zi;
}

const parseRowProperty = (row) => {
    const i = row.indexOf(':');
    if (i == -1) {
        return;
    }
    // console.log(row);
    // _GamesListWgtL: 0;
    const index = row.indexOf('cc');
    if (index == -1) {
        const m = row.match(/(\w+):[\s]{0,1}(.+),?/);
        if (m) {
            let name = m[1];
            let defaultValue = m[2];
            g_map.set(name, { type: null, defaultValue: defaultValue });
        }
        else {
            console.error(`parseRowProperty error: `, row);
        }
        return;
    }
    //  labelVersion: cc.Label,
    const m = row.match(/(\w+):[\s]{0,1}(.+)/);
    let name = m[1];
    let type = m[2];
    type = type.replace(',', '');
    let defaultValue = type.indexOf('[') == -1 ? 'null' : '[]';
    g_map.set(name, { type: type, defaultValue: defaultValue });
}
const parseRowsProperty = (array) => {
    let name, type, defaultValue;
    for (let index = 0; index < array.length - 1; index++) {
        const element = array[index];
        let ret = element.match(/[\w]+/);
        if (ret) {
            const v = ret[0];
            // console.log(v);
            if (index == 0) {
                name = v;
            }
            else if (v == 'type') {
                // type: cc.Prefab,
                const m = element.match(/:[\s]{0,1}(.+)/);
                if (m) {
                    type = m[1];
                    type = type.replace(',', '');
                    // console.log(type);
                }
                else {
                    console.error(`parse type error: ${element}`);
                }
            }
            else if (v == 'default') {
                //  default: null,
                const m = element.match(/:[\s]{0,1}(.+),/);
                if (m) {
                    defaultValue = m[1];
                    defaultValue = defaultValue.replace(',', '');

                    // console.log(defaultValue);
                }
                else {
                    console.error(`parse default error: ${element}`);
                }
            }
        }
        else {
            console.error(element);
        }
    }
    g_map.set(name, { type: type, defaultValue: defaultValue });
}
const splitProperties = (string) => {
    const lineArray = string.split("\r\n");
    let rowArray = null;
    for (let index = 0; index < lineArray.length; index++) {
        const element = lineArray[index];
        const find = element.indexOf(`/*`);
        const find1 = element.indexOf(`//`);
        if (find > -1 || find1 > -1) {
            continue;
        }
        if (rowArray) {
            const braceEnd = element.indexOf(`}`);
            rowArray.push(element);
            if (braceEnd > -1) {
                parseRowsProperty(rowArray);
                rowArray = null;
            }
            continue;
        }
        //方括号
        const braceStart = element.indexOf(`{`);
        if (braceStart > -1) {
            rowArray = [element];
        }
        else {
            parseRowProperty(element);
        }
    }
};

const parseProperty = function (data) {
    const string = `properties: {`;
    let startIdx = data.indexOf(string);
    if (startIdx > -1) {
        startIdx += string.length;
        // console.log(`find ${startIdx}`);
        const stack = [];
        let endIdex = -1;
        for (var i = startIdx; i < data.length; i++) {
            const char = data[i];
            if (char == '{') {
                stack.push(startIdx);
            }
            else if (char == '}') {
                if (stack.length > 0) {
                    stack.pop();
                }
                else {
                    endIdex = i;
                    break;
                }
            }
        }
        if (endIdex > -1) {
            const propertiesString = data.substring(startIdx, endIdex);
            splitProperties(propertiesString);
            g_propertyEndIdx = endIdex;
        }
        else {
            console.log(`not find }`);

        }
    }
    else {
        console.log(`not find ${string}`);
    }
}

const copyHead = function (data) {
    const string = `cc.Class`;
    let startIdx = data.indexOf(string);
    if (startIdx > -1) {
        return data.substring(0, startIdx);
    }
    return '';
}
const parseFunction = function (data) {
    if (g_propertyEndIdx == -1) {
        console.error(`parseFunction error: g_propertyEndIdx = -1 `);
        return '';
    }
    const idx = data.lastIndexOf('}');
    if (idx == -1) {
        console.error(`parseFunction error: lastIndexOf } = -1 `);
        return '';
    }
    let d = data.substring(g_propertyEndIdx + 2, idx);//.split('\r\n')
    // : function >> ''
    // const t = d.match(/:[\s]?function[\s]?/g);
    d = d.replace(/:[\s]?function[\s]?/g, "");

    // }, >> }
    // const t = d.match(/},\r\n/g);
    d = d.replace(/},\r\n/g, `}\r\n`);

    return d + '}';
}

function checkInvalidChar(str) {
    let strArray = "";
    for (let i = 0; i < str.length; ++i) {
        let char = str[i];
        if (char == "+") {
            strArray += "\\" + char;
        }
        else {
            strArray += char;
        }
    }
    return strArray;
}
function replaceUuid(filePath, oldID, newID, oldUuid, newUuid) {
    let fileNames = fs.readdirSync(filePath);
    fileNames.forEach(fileName => {
        var fileDir = path.join(filePath, fileName);
        var stats = fs.statSync(fileDir);
        var isDir = stats.isDirectory();//是文件夹
        if (isDir) {
            replaceUuid(fileDir, oldID, newID, oldUuid, newUuid);
        }
        var isFile = stats.isFile();//是文件
        if (isFile) {
            var extName = path.extname(fileDir);
            let name = extName.toLowerCase();
            if (name == '.prefab' || name == '.fire') {
                var buffer = fs.readFileSync(fileDir, 'utf8');
                let regTypeID = new RegExp(checkInvalidChar(oldID), "g");
                const ret = regTypeID.test(buffer);
                if (ret) {
                    buffer = buffer.replace(regTypeID, newID);
                }
                let regUuID = new RegExp(checkInvalidChar(oldUuid), "g");
                const ret1 = regUuID.test(buffer);
                if (ret1) {
                    buffer = buffer.replace(regUuID, newUuid);
                }
                if (ret || ret1) {
                    g_resFresh.push(fileDir);
                    fs.writeFileSync(fileDir, buffer);
                }

            }
        }
    });
}

let newData = '';
const data = fs.readFileSync(fn, 'utf8');
newData += copyHead(data);

const fileName = path.basename(fn).replace(path.extname(fn), "");

const ccclass = `
const { ccclass, property } = cc._decorator;

@ccclass
export default class ${fileName} extends cc.Component {

`
newData += ccclass;
parseProperty(data);

const rows = [];
for (var [key, value] of g_map) {
    const type = value['type'];
    if (!type) {
        rows.push({ key: key, value: value['defaultValue'] });
        continue;
    }
    newData += `    @property(${type})\r\n`;
    if (type.indexOf('[') > -1) {
        const baseType = type.substring(1, type.length - 1);
        newData += `    ${key}: ${baseType}[] = ${value['defaultValue']};\r\n`;
    }
    else {
        newData += `    ${key}: ${type} = ${value['defaultValue']};\r\n`;
    }
    newData += `\r\n`
}

rows.forEach(element => {
    newData += `    ${element.key} = ${element.value};\r\n`;
});

newData += parseFunction(data);

fs.writeFileSync(fn1, newData, 'utf8');

const newUuid = uuid();

const meta = `{
    "ver": "1.1.0",
    "uuid": ${newUuid},
    "importer": "typescript",
    "isPlugin": false,
    "loadPluginInWeb": true,
    "loadPluginInNative": true,
    "loadPluginInEditor": false,
    "subMetas": {}
  }`;

const metaPath = fn1 + '.meta';
fs.writeFileSync(metaPath, meta, 'utf8');

const oldMetaPath = fn + '.meta';
const OldMetaData = fs.readFileSync(oldMetaPath, 'utf8');
const m = OldMetaData.match(/"uuid": "(.+)"/);
const oldUuid = m[1];
console.log(`typeID: ${typeid(oldUuid)}`);
const assetsPath = path.resolve() + '/ParseCocosJson/';
replaceUuid(assetsPath, typeid(oldUuid), typeid(newUuid), oldUuid, newUuid);

console.log(`total size: ${g_map.size}`)

