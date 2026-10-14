---
title: Content width
layout: article
---

The documentation theme supports three independent CSS variables for limiting block widths.
Set them in your site's theme:

```css
:root {
    --docs-content-max-width: 770px;
    --docs-text-max-width: 625px;
}
```

These are example values, not defaults.
With this configuration, live examples still use the full available width.

| Variable                        | Applies to                                                                                               | Behaviour when unset                                                                |
| ------------------------------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `--docs-content-max-width`      | Headings including the page title, regular examples, code blocks, tables and expandable details sections | Existing widths are preserved                                                       |
| `--docs-text-max-width`         | Paragraphs, unordered and ordered lists, definition lists, blockquotes and regular messageboxes          | Paragraphs retain their 680px maximum; other text blocks keep their existing widths |
| `--docs-live-example-max-width` | Interactive live examples                                                                                | Full available width                                                                |

Text blocks are limited by both the content and text widths.
Setting only the text width does not limit headings or other content blocks.
For messageboxes, the limit includes padding and borders.
Expandable sections (`.docs-messagebox--details`) use the content width regardless of whether they contain text, code or tables.
Their text blocks still follow the text width.

To limit live examples separately, set `--docs-live-example-max-width` in your theme:

```css
:root {
    --docs-live-example-max-width: 850px;
}
```

All limits adapt to the available space on smaller screens.
The variables limit individual documentation blocks rather than shared page or section wrappers, so live examples can be wider than other content.
The width rules do not apply to component content inside regular or live examples.
