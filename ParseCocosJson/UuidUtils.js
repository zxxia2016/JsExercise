
import fs from "fs";
import path from "path";
//meta uuid
var g_metaUuid = {};
var g_oldUuids = null;
var g_newUuids = [];
var g_replaceCount = 0;

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
function readMetaUuid(filePath) {
    let fileNames = fs.readdirSync(filePath);
    fileNames.forEach(fileName => {
        var fileDir = path.join(filePath, fileName);
        var stats = fs.statSync(fileDir);
        var isDir = stats.isDirectory();//是文件夹
        if (isDir) {
            readMetaUuid(fileDir);
        }
        var isFile = stats.isFile();//是文件
        if (isFile) {
            var extName = path.extname(fileDir);
            // console.log(fileDir);
            if (extName.toLowerCase() == '.meta') {
                var buffer = fs.readFileSync(fileDir);
                var content = JSON.parse(buffer);
                g_metaUuid[content.uuid] = 1;
            }
        }
    });
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
function renameUuid(filePath) {
    let fileNames = fs.readdirSync(filePath);
    fileNames.forEach(fileName => {
        var fileDir = path.join(filePath, fileName);
        var stats = fs.statSync(fileDir);
        var isDir = stats.isDirectory();//是文件夹
        if (isDir) {
            renameUuid(fileDir);
        }
        var isFile = stats.isFile();//是文件
        if (isFile) {
            var extName = path.extname(fileDir);
            let name = extName.toLowerCase();
            if (name != '.png' && name != '.jpg' && name != '.jpeg' && name != '.mp3'
                && name != '.ttf' && name != '.html' && name != '.fnt' && name != '.manifest') {
                var buffer = fs.readFileSync(fileDir, 'utf8');
                let l = g_oldUuids.length;
                let outBuffer = buffer;
                for (let i = 0; i < l; ++i) {
                    let oldid = g_oldUuids[i];
                    let newid = g_newUuids[i];

                    let reg = new RegExp(checkInvalidChar(oldid), "g");
                    outBuffer = outBuffer.replace(reg, newid);
                    let oldtypeid = typeid(oldid);
                    let newtypeid = typeid(newid);
                    let reg1 = new RegExp(checkInvalidChar(oldtypeid), "g");
                    outBuffer = outBuffer.replace(reg1, newtypeid);
                }
                fs.writeFileSync(fileDir, outBuffer);
                g_replaceCount++;
                // console.log("g_replaceCount = " + g_replaceCount);
            }
        }
    });
}

function replaceAllUuid(assets_path) {
    console.log("-----replace uuid start-----");
    g_metaUuid = {};
    readMetaUuid(assets_path);
    g_oldUuids = Object.keys(g_metaUuid);
    g_newUuids = [];
    g_replaceCount = 0;
    let targetLength = g_oldUuids.length;
    let l = 0;
    while (l < targetLength) {
        let decompressUuid = uuid();
        if (g_metaUuid[decompressUuid] == null) {
            l++;
            g_newUuids.push(decompressUuid);
        }
    }
    if (targetLength != g_newUuids.length) {
        console.log("targetLength = " + targetLength + ',g_newUuids length = ' + g_newUuids.length);
        console.log("rename uuid error.");
        return;
    }
    renameUuid(assets_path, g_oldUuids, g_newUuids);
    console.log("-----replace uuid end-----");
}

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

var uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
function isUUID(uuid) {
    return uuidRegex.test(uuid);
}

module.exports = uuid;