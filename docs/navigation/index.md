---
title: Navigation
layout: content-with-menu
sortorder: 1
---

The navigation in the side-panel is generated from the following folder structure:

```
navigation/
.
├── child-page-1.md
├── child-page-2.md
├── child-page-3.md
├── external-link.json
├── group/
│   ├── index.json
│   ├── nested-page-1.md
│   ├── nested-page-2.md
│   └── nested-page-3.md
├── index.md
└── internal-link.json
```

It uses the `frontMatterFileReader` and `navigationFileReader` to read the documents:

```ts
import {
    Generator,
    frontMatterFileReader,
    navigationFileReader,
} from "@forsakringskassan/docs-generator";

const docs = new Generator(import.meta.url, {
    site: { name: "" },
    setupPath: "docs/src/setup.ts",
});

/* --- cut above --- */

await docs.build([
    {
        include: "docs/**/*.md",
        basePath: "./docs/",
        fileReader: frontMatterFileReader,
    },
    {
        include: "docs/**/*.json",
        basePath: "./docs/",
        fileReader: navigationFileReader,
    },
]);
```

## Hiding pages

Each file will be present in the navigation unless the `visible` attribute is set to `false`, e.g.:

```md
---
title: My hidden page
visible: false
---

This page will be rendered but will not be visible in the menu.
It can be linked to by other means.
```

If a section (`index.md`) is hidden it will still generate a navigation tree but will not be rendered in the menu.

## Expandable groups

Each folder with new files will be a expandable group.
To set the title of the group create a new `index.json` with the `title` attribute set:

```json
{
    "title": "My awesome group"
}
```

## Links

Custom links can be created by adding a json file with both the `title` and `href` property set, e.g. `external-link.json`:

```json
{
    "title": "My awesome link",
    "href": "https://example.net"
}
```

If the `href` starts with `http://`, `https://` or `//` it is considered an external link.
Otherwise it is considered a link relative to the output folder.
It is recommended to start such hrefs with a single `/` for better clarity.

## Sorting

Sorting uses the optional `sortorder` attribute:

```md
---
title: My Awesome Page
sortorder: 1
---
```

Pages with the `sortorder` attributes are sorted with the lower number appearing higher.
Pages sharing the same `sortorder` or when `sortorder` is omitted are sorted alphabetically, for instance:

- `title: Foo`, `sortorder: 1` - Appears first
- `title: Bar`, `sortorder: 2` - Appears together with "Baz", sorted alphabetically
- `title: Baz`, `sortorder: 2` - Appears together with "Bar", sorted alphabetically
- `title: Tux`, `sortorder: 3` - Appears after "Bar" and "Baz"
- `title: Barney`, - Appears last, sorted alphabetically
- `title: Fred`, - Appears last, sorted alphabetically

## Page title

Normally the title shown in the navigation is read from the `title` attribute of the document.
If the `shortTitle` attribute is set it is used instead.

```md
---
title: A longer title unsuitable for the navigation
sort-title: Shorter title
---
```
