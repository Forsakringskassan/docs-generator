---
title: Playground
layout: component
---

`playgroundProcessor` generates links to code playgrounds.

## Usage

```ts
import {
    Generator,
    playgroundProcessor,
} from "@forsakringskassan/docs-generator";

/* --- cut above --- */

const docs = new Generator(import.meta.url, {
    /* --- cut begin --- */
    site: { name: ".." },
    setupPath: "..",
    /* --- cut end --- */

    processors: [
        playgroundProcessor({
            entries: [
                {
                    id: "example-playground",
                    variable: "exampleUrl",
                    urlFormat: "https://example.net/#{{ base64 }}",
                    folder: "docs/playground",
                },
            ],
        }),
    ],
});
```

## Configuration

The `playgroundProcessor` takes a configuration object:

::: api properties
interface:PlaygroundProcessorOptions
:::

Each entry consists of:

::: api properties
interface:PlaygroundProcessorEntry
:::
