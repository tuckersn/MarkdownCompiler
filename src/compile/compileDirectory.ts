import fs from "fs";
import fsp from "fs/promises";
import { compile } from "./compile";
import path from "path";

import { default as walk } from "ignore-walk";

export async function compileDirectory(inputDirPath: string) {
    const files: string[] = await walk({
        path: inputDirPath, 
        ignoreFiles: [ '.gitignore', '.mdcignore' ], //TODO: add CLI argument for additional ignorefiles 
        includeEmpty: true
    });

    let promises: Promise<any>[] = [];
    for(let f of files) {
        if(/.+\.md(|.+)/im.test(f)) {
            promises.push(compile(path.join(inputDirPath, f), path.join(inputDirPath, f).replace(".md", "")));
        }
    }
    await Promise.all(promises);
}