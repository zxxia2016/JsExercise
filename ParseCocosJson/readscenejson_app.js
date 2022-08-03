
import fs from "fs";
import Path from "path";

try {
    let fn = Path.resolve() + '/ParseCocosJson/scene.json';

    const data = fs.readFileSync(fn, 'utf8');

    // parse JSON string to JSON object
    const config = JSON.parse(data);
    // _components
    console.log(`length: ${config.length}`)
    config.forEach(element => {
        const components = element._components;
        if (!!components && components.length > 0) {
            console.log(element._name);
            components.forEach(element => {
                console.log(config[element.__id__]);
            });
        }
    });
    

} catch (err) {
    console.log(`Error reading file from disk: ${err}`);
}
