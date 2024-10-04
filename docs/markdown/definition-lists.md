---
title: Definition lists
layout: article
---

Definition lists can be created with:

**Input:**

```md
Term
: Definition
```

**Output:**:

Term
: Definition

## Multiple definitions

Multiple definition can be used:

**Input:**

```md
Term
: Definition 1
: Definition 2
```

**Output:**:

Term
: Definition 1
: Definition 2

## Markdown content

Both terms and definitions may contain markdown content:

**Input:**

```md
Term **with** markdown
: Definition **with** markdown
```

**Output:**:

Term **with** markdown
: Definition **with** markdown

## Nested content

The definition may contain nested lists, definition lists, and other complex content by indenting the block with four spaces:

**Input:**

````md
`options`
: An object containing one or more properties:

    `foo`
    : Sets the foo option of the function call.

        Can be one of:

        * `"foo"`
        * `"bar"`

    `bar`
    : Sets the bar option of the function call.

        ```ts
        nestedCodeBlock("foo");
        ```
````

**Output:**:

`options`
: An object containing one or more properties:

    `foo`
    : Sets the foo option of the function call.

        Can be one of:

        * `"foo"`
        * `"bar"`

    `bar`
    : Sets the bar option of the function call.

        ```ts
        nestedCodeBlock("foo");
        ```
