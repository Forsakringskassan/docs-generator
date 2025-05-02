---
title: Details
layout: article
---

Expandable area using the `<details>` element.
Implemented as a special variant of {@link messagebox}.

**Input:**

```md
::: details

Lorem ipsum dolor sit amet.

- Foo
- Bar
- Baz

:::
```

**Output:**

::: details

Lorem ipsum dolor sit amet.

- Foo
- Bar
- Baz

:::

Title can optionally be specified:

**Input:**

```md
::: details Click me!

Lorem **ipsum** dolor sit amet.

- foo
- bar
- baz

:::
```

**Output:**

::: details Click me!

Lorem **ipsum** dolor sit amet.

- foo
- bar
- baz

:::

## Localization

Uses the same `messagebox.title` property as messageboxes with `details` as key.

```ts
import { Generator } from "@forsakringskassan/docs-generator";

/* --- cut above --- */

const docs = new Generator(import.meta.url, {
    /* --- cut begin --- */
    site: { name: ".." },
    setupPath: "..",
    /* --- cut end --- */

    markdown: {
        messagebox: {
            title: {
                details: "Läs mer",
            },
        },
    },
});
```
