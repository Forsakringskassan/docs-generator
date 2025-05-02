---
name: Search processor
layout: article
search:
    terms:
        - searchProcessor
---

The `searchProcessor` adds a search function to the generated site and creates a searchable index.

The index is based on:

- the page title
- the component name(s)
- additional extra search terms given in the document.

## Usage

```ts
import { Generator, searchProcessor } from "@forsakringskassan/docs-generator";

/* --- cut above --- */

const docs = new Generator(import.meta.url, {
    /* --- cut begin --- */
    site: { name: ".." },
    setupPath: "..",
    /* --- cut end --- */

    processors: [searchProcessor()],
});
```

## Configuration

This processor has no configuration.

## Search terms

The the markdown document a list of additional search terms can be listed in the frontmatter block:

```md
---
search:
    terms:
        - foo
        - bar
---
```

Searching for any of those terms will show results for the page.
