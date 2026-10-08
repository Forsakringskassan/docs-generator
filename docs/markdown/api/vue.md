---
title: Documenting Vue components
short-title: Vue Components
layout: article
---

adsf {@link vue-component-example}.

API documentation for Vue components can be enabled using the {@link vueFileReader}:

```ts
import {
    Generator,
    frontMatterFileReader,
    vueFileReader,
} from "@forsakringskassan/docs-generator";

const docs = new Generator(import.meta.url, {
    site: { name: "My Awesome Site" },
    sourceFiles: [
        {
            include: ["./docs/**/*.md"],
            fileReader: frontMatterFileReader,
        },
        {
            include: ["./src/**/*.vue"],
            fileReader: vueFileReader,
        },
    ],
});

await docs.build();
```

This will read each component and generate API documentation which can later be included in markdown with:

```md
:::api
vue:AwesomeComponent
:::
```

For details about how to document Vue components see [vue-docgen-api documentation](https://vue-styleguidist.github.io/docs/Documenting.html).

Translations can be generated with:

```md
:::api
translation:AwesomeComponent
:::
```

Calls to `$t()` will be read from the source component.
If the call has a leading jsdoc-style comment it is used as the description of the translation, for example:

```vue static
<template>
    <p>
        {{
            /** something something... */
            $t("translation.key.bar", "bar default text", {
                /** A thingamajig */
                foo: 1,
                /** A doodad */
                bar: "baz",
            })
        }}
    </p>
</template>
```

## Example

:::api
vue:VueExample
:::

## Translation

:::api
translation:VueExample
:::
