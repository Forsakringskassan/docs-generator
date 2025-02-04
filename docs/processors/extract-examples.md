---
title: Extract examples
name: extractExamplesProcessor
alias:
    - extractExamples
layout: article
---

The `extractExamplesProcessor` extracts the content from each example and saves to a directory.
This is used to further process examples with tooling such as linting and compilation.

Given `docs/foo/bar.md` with:

````md
```ts
const x = "foo";
const y = x + 1;
```
````

The example will generate the file:

```
${outputFolder}/docs/foo/bar.md/example-1.ts
```

If the markdown code fence contains either of the two tags `nocompile` or `nolint` it will be added to the filename:

````md
```ts nocompile
const x = "foo";
const y = x + 1;
```
````

The filename will then be:

```
${outputFolder}/docs/foo/bar.md/example-1-nocompile.ts
```

This can be used to exclude the file from compilation or linting.

## Usage

```ts
import fs from "node:fs/promises";
import {
    Generator,
    extractExamplesProcessor,
} from "@forsakringskassan/docs-generator";

/* --- cut above --- */

const docs = new Generator({
    /* --- cut begin --- */
    site: { name: ".." },
    setupPath: "..",
    /* --- cut end --- */

    processors: [
        extractExamplesProcessor({
            outputFolder: "docs/examples/files",
        }),
    ],
});
```

## Configuration

`outputFolder: string`
: Folder to write examples to. The output folder would typically be git ignored except for configuration files such as `tsconfig.json`.

`languages: string[]` {@optional}
: Array of languages to extract.

    Default:

    - `"javascript"
    - `"typescript"`
    - `"css"`
    - `"scss"`
