---
title: Manifest
name: manifestProcessor
alias:
    - manifest
layout: content-with-menu
---

`manifestProcessor` is a processor writing out a manifest listing all generated documents that will be present in the `outputFolder`.
The manifest can be written in:

- Markdown format
- JSON format

This page describes the processor for writing the manifest as a file on disk, for programmatical usage use:

```ts
import { Generator } from "@forsakringskassan/docs-generator";

/* --- cut above --- */

const config = {
    sourceFiles: [
        /* ... */
    ],
};
const docs = new Generator(import.meta.url, {
    /* --- cut begin --- */
    site: { name: ".." },
    setupPath: "..",
    /* --- cut end --- */

    /* ... */
});
const manifest = await docs.manifest(config.sourceFiles);
```

## Usage

```ts
import {
    Generator,
    manifestProcessor,
} from "@forsakringskassan/docs-generator";

/* --- cut above --- */

const docs = new Generator(import.meta.url, {
    /* --- cut begin --- */
    site: { name: ".." },
    setupPath: "..",
    /* --- cut end --- */

    processors: [
        manifestProcessor({
            markdown: "etc/docs-manifest.md",
            json: "etc/docs-manifest.json",
        }),
    ],
});
```

## Verification

Manifest verification (requires markdown) can be performed by setting the `verify` flag to true:

```ts name=verify-original hidden
import { manifestProcessor } from "@forsakringskassan/docs-generator";

/* --- cut above --- */

manifestProcessor({
    markdown: "etc/docs-manifest.md",
});
```

```ts compare=verify-original
import { manifestProcessor } from "@forsakringskassan/docs-generator";

/* --- cut above --- */

import isCI from "is-ci";

manifestProcessor({
    markdown: "etc/docs-manifest.md",
    verify: isCI,
});
```

With the flag set to `true` the manifest file `etc/docs-manifest.md` will not be written but instead verified to ensure it is up-to-date.
Typically this would be set to `true` in `CI` builds to ensure it is properly commited.
