---
title: Header
layout: article
sortorder: 20
---

The default header uses tree columns (stacked in mobile):

Desktop:

```mermaid
block
  columns 4
  a["Left"] b["Navigation"]:2 c["Toolbar"]
```

Mobile:

```mermaid
block
  columns 3
  a["Left"]:3 b["Navigation"]:2 c["Toolbar"]:1
```

Each column can be customized by {@link overriding-templates overriding the partials}:

- `partials/header-left.html`
- `partials/mobile-nav.html`
- `partials/topnav.html`

To fully customize the header override the header partial:

- `partials/header.html`

## Containers

To add custom widgets to the header, append them to one of the containers:

- `header:left` - widget is placed in the left column.
- `toolbar` - widget is placed in the right column.

```ts
import { type ProcessorContext } from "@forsakringskassan/docs-generator";

declare const context: ProcessorContext;

/* --- cut above --- */

context.addTemplateBlock("toolbar", "awesome-doodad", {
    filename: "partials/awesome-doodad.html",
});
```
