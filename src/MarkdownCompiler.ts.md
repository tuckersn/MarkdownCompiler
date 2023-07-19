---
document_type: code
document_created: 23-07-15
---

# Imports
```ts
#!/usr/bin/env node
import path from "path";
import fs from "fs";
import fsp from "fs/promises";
```

# Markdown Compiler
```ts
async function compileFile(inputPath: string, outputPath: string) {
    console.log(inputPath, ' -> ', outputPath);
    if(fs.existsSync(outputPath)) {
        fs.rmSync(outputPath);
    }
    fs.writeFileSync(outputPath, "");

    const input = await fsp.open(inputPath, "r");
    const output = await fsp.open(outputPath, "w");

    /**
     * When this is true, input is written to output.
     */
    let writing = false;
    for await (const line of input.readLines()) {
        if(writing) {
            if(line.trim().startsWith('```')) {
                writing = false;
                await output.write("\n");
            } else {
                await output.write(line + "\n");
            }
        } else {
            if(line.trim().startsWith('```')) {
                writing = true;
            }
        }
    }
}
```


# Compile Directory
```typescript
async function compile(inputDirPath: string) {
    let directories = [];
    let promises = [];
    for(let f of fs.readdirSync(inputDirPath)) {
        if(/.+\.md(|.+)/im.test(f)) {
            promises.push(compileFile(path.join(inputDirPath, f), path.join(inputDirPath, f).replace(".md", "")));
        } else {
            directories.push(path.join(inputDirPath, f));
        }
    }
    await Promise.all(promises);

    for(let d of directories) {
        if(fs.lstatSync(d).isDirectory()) {
            await compile(path.join(inputDirPath, d));
        }
    }

}
```


# Main
```ts
(async () => {
    console.log("start");
    await compile(path.join(process.cwd(), process.argv[process.argv.length-1]));
    console.log("finished");
})();
```
