---
document_type: code
document_created: 23-07-15
mdc: {
	"postEval": "console.log('hello world! 123')"
}
---

# Imports
```ts
#!/usr/bin/env node
import path from "path";
import { compileDirectory } from "./compile/compileDirectory";
```

# Main
```ts
(async () => {
    console.log(`[Start]`);
    await compileDirectory(path.join(process.cwd()));
    console.log(`[Finished]`);
})();
```
