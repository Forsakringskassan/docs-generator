---
title: Extract Markdown
name: extractMarkdownProcessor
alias:
    - extractMarkdown
layout: article
---

`extractMarkdownProcessor()` extracts rendered Markdown documentation and the resources it references to a separate folder.
The generated folder can be published as a package or loaded by another `Generator`.

The processor runs after rendering and requires `manifestProcessor()` to have run earlier in the build.
It removes and recreates its `outputFolder` before writing the extracted files.

## Usage

```ts
import {
    Generator,
    extractMarkdownProcessor,
    manifestProcessor,
} from "@forsakringskassan/docs-generator";

/* --- cut above --- */

const docs = new Generator(import.meta.url, {
    /* --- cut begin --- */
    site: { name: ".." },
    setupPath: "..",
    /* --- cut end --- */

    processors: [
        manifestProcessor(),
        extractMarkdownProcessor({
            outputFolder: "dist/docs",
            version: "1.2.3",
            metadata() {
                return {
                    revision: 1,
                };
            },
        }),
    ],
});

await docs.build();
```

## Augment the metadata interface

`ExtractedDocsMetadata` is an open interface that you can augment with the shape of your application-specific metadata.
Add a module declaration for `@forsakringskassan/docs-generator` to a TypeScript file included in your project:

```ts
declare module "@forsakringskassan/docs-generator" {
    interface ExtractedDocsMetadata {
        revision: number;
    }
}

export {};
```

The added properties are then type-checked in the `metadata` callback and included in the type of `metadata` imported from the generated `index.mjs`:

```ts nolint nocompile
import { metadata } from "./dist/docs/index.mjs";

metadata?.revision; // number | undefined
```

## Use the extracted documentation

Import `sourceFiles` and `exampleFolders` from the generated `index.mjs` and pass them to another `Generator`.
The generated `sourceFiles()` helper configures the extracted Markdown pages and partials for reading.

```ts nolint nocompile
import { Generator } from "@forsakringskassan/docs-generator";
import { exampleFolders, sourceFiles } from "./dist/docs/index.mjs";

const docs = new Generator(import.meta.url, {
    site: { name: "My documentation site" },
    exampleFolders,
    sourceFiles: sourceFiles(),
});

await docs.build();
```

## Generated module

The processor generates an `index.mjs` module in `outputFolder` for loading the extracted documentation. Its exported fields are:

`generatorVersion: string`
: Version of `@forsakringskassan/docs-generator` used to generate the module.

`version: string | null`
: Documentation version from the `version` option, or `null` when it is omitted.

`metadata: ExtractedDocsMetadata | null`
: JSON-serializable metadata returned by the `metadata` callback, or `null` when no value is provided.

`basePath: string`
: Absolute path to the directory containing `index.mjs`.

`exampleFolders: string[]`
: Paths to the extracted examples directory, for use as a `Generator` option.

`filesPath: string`
: Path to the extracted documentation files directory.

`partialsPath: string[]`
: Paths to the extracted API partial data.

`linksPath: string[]`
: Paths to the extracted page-link data.

`sourceFiles(src: Partial<SourceFiles>): SourceFiles[]`
: Returns source-file entries for loading the extracted Markdown pages and API partials in another `Generator`. The properties in `src` are merged into the Markdown entry.

## Configuration

`enabled: boolean` {@optional}
: Inherited processor option that disables extraction when set to `false`. Defaults to `true`.

`outputFolder: string`
: Required destination folder. Existing contents are removed before extraction.

`version: string` {@optional}
: Documentation version exported by the generated `index.mjs`. Defaults to `null`.

`metadata: () => ExtractedDocsMetadata | null | undefined | Promise<ExtractedDocsMetadata | null | undefined>` {@optional}
: Callback invoked once per extraction. Its result is serialized into `index.mjs`; if the callback is omitted or returns `null` or `undefined`, the exported metadata is `null`. Metadata must be JSON-serializable.
