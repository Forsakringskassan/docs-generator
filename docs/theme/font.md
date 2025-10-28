---
title: Font
layout: article
---

By default the [Inter][inter] font is included in the generated site.

If you need to customize the font you can set the CSS variables:

```css
--docs-font-family: AwesomeFont;
--docs-heading-font-family: AwesomeFont;
```

To disable bundling the font set the `bundleDefaultFont` to `false`:

```ts name=original hidden
import { Generator } from "@forsakringskassan/docs-generator";

/* --- cut above --- */

const docs = new Generator(import.meta.url, {
    site: { name: "Awesome Site", lang: "en" },
    setupPath: "src/setup.ts",
});
```

```ts compare=original
import { Generator } from "@forsakringskassan/docs-generator";

/* --- cut above --- */

const docs = new Generator(import.meta.url, {
    site: { name: "Awesome Site", lang: "en" },
    bundleDefaultFont: false,
    setupPath: "src/setup.ts",
});
```

[inter]: https://rsms.me/inter/
