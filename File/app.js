
import fs from "fs";
import path from "path";

function getFiles(dir) {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, list) => {
            if (err) {
                return reject(err);
            }
            Promise.all(list.map((node) => {
                return new Promise((resolve, reject) => {
                    const filepath = path.join(dir, node);
                    fs.stat(filepath, (err, desc) => {
                        if (err) {
                            return reject(err);
                        }
                        if (desc.isDirectory()) {
                            getFiles(filepath).then(files => resolve(files));
                        } else if (desc.isFile()) {
                            resolve(filepath);
                        }
                    });
                });
            })).then(all => resolve(all.flat()));
        });
    });
}
getFiles(`./`).then(files => console.log(files));