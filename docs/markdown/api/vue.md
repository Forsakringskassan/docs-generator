---
title: Documenting Vue components
short-title: Vue Components
layout: article
---

API documentation for Vue components can be enabled using the {@link vueFileReader}:

```ts
import {
    Generator,
    frontMatterFileReader,
    vueFileReader,
} from "@forsakringskassan/docs-generator";

const docs = new Generator({
    site: { name: "My Awesome Site" },
    setupPath: "setup.ts",
});

/* --- cut above --- */

await docs.build([
    {
        include: ["./docs/**/*.md"],
        fileReader: frontMatterFileReader,
    },
    {
        include: ["./src/**/*.vue"],
        fileReader: vueFileReader,
    },
]);

/* --- cut below --- */

export {}; // for TLA to work
```

This will read each component and generate API documentation which can later be included in markdown with:

```md
:::api
vue:AwesomeComponent
:::
```

For details about how to document Vue components see [vue-docgen-api documentation](https://vue-styleguidist.github.io/docs/Documenting.html).

## Example

:::api
vue:VueExample
:::
