---
title: Alternative text
layout: pattern
---

The `alt` container is used to provide an alternative text from another markdown file to replace a default text (or add text if no default text is added to the container).

Can be used to simplify the process of serving different documentation snippets in cases where the repository is duplicated to another environment with a different target audience.

## Usage

To define a file with content you want to use as alternative text, insert its filename after the `alt` keyword.
If this file should only be used to provide an alternative text and not be output as a page, use `include: false` in the frontmatter of the alternative text.
Using a default text is optional. If the container's content is empty, nothing will be rendered if the file is not found.

```md
:::alt my-alternative-text-file
This text will be rendered if the file is not found.
:::
```

**my-alternative-text-file.md**:

```md
---
include: false
---

This is an alternative text from another markdown file.
```

**Rendered alternative text if file is found**:

:::alt my-alternative-text-file
This text will be rendered if the file is not found.
:::

**Rendered default text if file is not found**:

:::alt my-alternative-text-file-not-found
This text will be rendered if the file is not found.
:::

## Configuration

In order for the alternative text to be rendered, the file containing the alternative text need to be included in `sourceFiles` using `frontMatterFileReader`.

Alt files may be included by being located in the documentation file structure (such as right next to the documentation file pointing to it).
If the alt files are located in a seperate folder or in an external package you will need to provide its path in `sourceFiles` as well.

```mjs
// docs.config.mjs
export default {
    sourceFiles: [
        // Files used to generate documentation (alt files will also be included if located here)
        {
            include: "docs/**/*.md",
            basePath: "./docs/",
            fileReader: frontMatterFileReader,
        },
        // Alt files from other folder
        {
            include: "my-alt-texts/**/*.md",
            basePath: "./my-alt-texts/",
            fileReader: frontMatterFileReader,
        },
        // Alt files from external package `@my-awesome-alt-texts`
        {
            include: "node_modules/@my-awesome-alt-texts/dist/**/*.md",
            basePath: "./node_modules/@my-awesome-alt-texts/dist",
            fileReader: frontMatterFileReader,
        },
    ],
};
```
