#!/usr/bin/env node
import path from "path";
import { compileDirectory } from "./compile/compileDirectory";

(async () => {
    console.log(`[Start]`);
    await compileDirectory(path.join(process.cwd()));
    console.log(`[Finished]`);
})();

