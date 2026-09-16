---
title: Workers
name: compileWorker
layout: article
---

Scripts can be compiled with the bultin `compileWorker()` method:

```ts nolint nocompile
Generator.compileWorker(name, src, options, buildOptions);
```

This works similar to the {@link compileScript `compileScript()` method} but with some differences:

- The script is written directly to `outputFolder` instead of `assetFolder` (i.e. to the web root).
- The output filename does not include a hash.

`name: string`
: Unique name for this script. Used when referencing the script and as the base of the output filename.

`src: string`
: Path to the script entrypoint.

`buildOptions: object` {@optional}
: Options passed to `esbuild`.

    `format: "iife" | "cjs" | "esm"` {@optional}
    : Output format.

    `define: Record<string, string>` {@optional}
    : Global identifiers to replace.
