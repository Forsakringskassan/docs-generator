---
name: Manifest
layout: content-with-menu
---

`manifestProcessor` is a processor writing out a manifest listing all generated documents that will be present in the `outputFolder`.
The manifest can be written in:

-   Markdown format
-   JSON format

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
