---
name: Version
layout: content-with-menu
---

`versionProcessor` adds a template block with the package version.

## Usage

```ts
import fs from "node:fs/promises";
import { Generator, versionProcessor } from "@forsakringskassan/docs-generator";

/* --- cut above --- */

const pkg = JSON.parse(await fs.readFile("package.json", "utf-8"));

const docs = new Generator(import.meta.url, {
    /* --- cut begin --- */
    site: { name: ".." },
    setupPath: "..",
    /* --- cut end --- */

    processors: [versionProcessor(pkg, "footer:right")],
});
```

## Configuration

The `versionProcessor` takes an optional configuration object:

`versionProcessor(pkg, "..", { /* ... */ })`

### `enabled`

- Type: `boolean`
- Default: `true`

Enables/disables the version processor.

### `scm`

- Type: `object | undefined`
- Default: `undefined`

If set it enables SCM output such as branch name, commit hash and if known Pull Request ID.

### `scm.commitUrlFormat`

- Type: `string`
- Required: true

The URL format of the generated link to SCM commit.

`{{ homepage }}/commit/{{ hash }}`

The following placeholders can be used:

- `hash` - the full hash of the commit.
- `short` - the abbreviated hash of the commit.
- `homepage` - the `homepage` field of `package.json`.
- `repository` - the normalized URL to the source repository (derived from the `repository.url` field in `package.json`).

### `scm.prUrlFormat`

- Type: `string`
- Required: true

The URL format of the generated link to SCM pull request.

`{{ homepage }}/pull-requests/{{ pr }}`

The following placeholders can be used:

- `pr` - the pull request id.
- `homepage` - the `homepage` field of `package.json`.
- `repository` - the normalized URL to the source repository (derived from the `repository.url` field in `package.json`).
