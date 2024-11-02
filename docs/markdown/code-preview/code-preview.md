---
title: Code preview
layout: article
---

Code within markdown code fences will be rendered with syntax highlighting and for languages that can run in the browser a runnable example will be created.

## Default, no language or tags

By default no language is implied and the code is rendered as-is with no syntax highlight.

**Input:**

````md
```
Lorem ipsum
```
````

**Output:**

```
Lorem ipsum
```

## Explicit languages

When explicit languages is set the behaviour varies for different languages.

### HTML

HTML is rendered in the browser and the HTML markup is shown with syntax highlight.

**Input:**

````md
```html
<p>lorem <em>ipsum</em></p>
```
````

**Output:**

```html
<p>lorem <em>ipsum</em></p>
```

### Javascript / Typescript

Javascript and Typescript only shows the code with syntax highlight.

See also {@link javascript Javascript and Typescript} for additional details about wrinting JS-based examples.

**Input:**

````md
```ts
export interface Foo {
    name: string;
}
```
````

**Output:**

```ts
export interface Foo {
    name: string;
}
```

## Importing files

Instead of writing examples inline the source can be imported from another file.
This is especially useful if the examples become long and clumpsy to write in a code fence.

When importing files the extension determines the language but is otherwise the same as if the contents of the file was written inside the code fence directly.

**Input:**

````md
```import
my-file.html
```

```import
my-file.ts
```
````

**Output:**

```import
my-file.html
```

```import
my-file.ts
```

## Fullscreen

See documentation for {@link fullscreen fullscreen examples}.

## Tags

### `static`

Disables rendering the example and only shows the source code with highlighting.

**Input:**

````md
```html static
<p>lorem <em>ipsum</em></p>
```

```import static
my-file.html
```
````

**Output:**

```html static
<p>lorem <em>ipsum</em></p>
```

```import static
my-file.html
```

### `nomarkup`

Disables showing souce with syntax highlighting and only shows a rendered example.

**Input:**

````md
```html nomarkup
<p>lorem <em>ipsum</em></p>
```

```import nomarkup
my-file.html
```
````

**Output:**:

```html nomarkup
<p>lorem <em>ipsum</em></p>
```

```import nomarkup
my-file.html
```

## Runnable examples

```import
my-file.vue
```

## Selectors for E2E testing

While generally discouraged to write E2E tests against the generated documentation it is sometimes a necessity.

There are three supported ways to write selectors:

-   Via a unique automatically generated id retrieved from {@link Manifest manifest}.
-   Via a custom author specified `test-id` tag.
-   Via a generic `.code-preview` selector.

### Unique generated id

Each example gets a unique generated id similar to `id="example-${hash}"`.
The {@link Manifest manifest} includes each example and its selector.

Use this when you want to run the same test over each example available on the site, e.g. when testing if each example starts up properly.

### Custom test id

Examples can be given a custom test id using the `test-id=string` tag which can be used to write a selector such as `[data-test=string]`:

````md
```html test-id="foobar"
<!-- markup -->
```
````

Use this when you want to run a test against a specific example on a given page.

### Generic selector

Each example can also be selected using the `.code-preview` selector.

This selector gives the least stability as for any given page it might yield no results (no examples on that page) or multiple.
Moving examples around on the same page will change the order this selector returns the example.

This selector should generally be avoided.

## Example metadata

The example tags and language can be queried from the `data-tags` (space-separated list of author given tags) and `data-language` (explicit or resolved language):

Given an example such as:

````md
```ts nomarkup custom-tag
/* ... */
```
````

```ts
const element = document.querySelector<HTMLElement>("#example-c0ffee");

const language = element?.dataset.language;
const tags = element?.dataset.tags?.split(/\s+/);

console.log(language); // --> "ts"
console.log(tags); // --> ["nomarkup", "custom-tag"]
```
