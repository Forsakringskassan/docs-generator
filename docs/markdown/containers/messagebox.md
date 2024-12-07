---
title: Messagebox
layout: article
---

Messageboxes can be added with:

**Input:**

```md
::: messagebox
Lorem ipsum dolor sit amet.
:::
```

**Output:**

::: messagebox
Lorem ipsum dolor sit amet.
:::

Messages may contain additional markdown:

**Input:**

```md
::: messagebox

Lorem **ipsum** dolor sit amet.

- foo
- bar
- baz

:::
```

**Output:**

::: messagebox

Lorem **ipsum** dolor sit amet.

- foo
- bar
- baz

:::

## Variants

An optional variant can be specified:

```md
::: messagebox warning
lorem ipsum dolor sit amet
:::
```

The following variants are supported:

- `info` (default)
- `warning`
- `danger`

::: messagebox info
This is an info box.
`with code`
:::

::: messagebox warning
This is a warning.
`with code`
:::

::: messagebox danger
This is a dangerous warning.
`with code`
:::

For these variants the following aliases can also be used:

**Input:**

```md
::: info
This is an info box.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::
```

**Output:**

::: info
This is an info box.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

## Custom title

A custom title can be set by appending the text right after the variant of the container:

**Input:**

```md
::: messagebox warning Lorem ipsum
Dolor sit amet.
:::
```

**Output:**

::: messagebox warning Lorem ipsum
Dolor sit amet.
:::

## Custom variant

Custom variants can be implemented by adding the CSS-class `docs-messagebox--${variant}`.

```css
.docs-messagebox--rainbow {
    border-color: black;
    background: linear-gradient(in hsl longer hue 45deg, red 0 0);

    p {
        color: white;
        font-weight: bold;
        text-shadow:
            0 0 5px black,
            1px 1px 0px black;
    }
}
```

**Input:**

```md
::: messagebox rainbow
Custom variant
:::
```

<style>
.docs-messagebox--rainbow {
    border-color: black;
    background: linear-gradient(in hsl longer hue 45deg, red 0 0);

    p {
        color: white;
        font-weight: bold;
        text-shadow:
            0 0 5px black,
            1px 1px 0px black;
    }
}
</style>

**Output:**

::: messagebox rainbow
Custom variant
:::

## Localization

The default titles can be set globally in the site configuration:

```ts
import { Generator } from "@forsakringskassan/docs-generator";

/* --- cut above --- */

const docs = new Generator({
    /* --- cut begin --- */
    site: { name: ".." },
    setupPath: "..",
    /* --- cut end --- */

    markdown: {
        messagebox: {
            title: {
                info: "Information",
                warning: "Varning",
                danger: "Se upp!",
            },
        },
    },
});
```
