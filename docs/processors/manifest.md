---
name: Manifest
layout: content-with-menu
---

`manifestProcessor` is a processor writing out a manifest listing all generated documents that will be present in the `outputFolder`.
The manifest can be written in:

-   Markdown format
-   JSON format

This page describes the processor for writing the manifest as a file on disk, for programmatical usage use:

```ts
const config = {
    sourceFiles: [
        /* ... */
    ],
};
const docs = new Generator({
    /* ... */
});
const manifest = await docs.manifest(config.sourceFiles);
```

## Usage

```ts
const docs = new Generator({
    processors: [
        manifestProcessor({
            markdown: "etc/docs-manifest.md",
            json: "etc/docs-manifest.json",
        }),
    ],
});
```
