---
title: Javascript and Typescript
layout: article
---

Javascript and Typescript only shows the code with syntax highlight.

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

## ESLint

ESLint comments will be stripped from the rendered source code.

**Input:**

````md
```js
function foo(value) {
    /* eslint-disable-next-line eqeqeq */
    return value == "foo";
}
```
````

**Output:**

```js
function foo(value) {
    /* eslint-disable-next-line eqeqeq */
    return value == "foo";
}
```

## Snippets

The source code may also contains snippets which are cut from the rendered source code.

This is mostly useful in combination with extracting the example source code and running external tools, e.g. compiling the example might require additional imports or declarations.

**Input:**

````md
```ts
declare function add(a: number, b: number): number;

/* --- cut above --- */

const result = add(1, 2);
```
````

**Output:**

```ts
declare function add(a: number, b: number): number;

/* --- cut above --- */

const result = add(1, 2);
```

The following instructions are available:

-   `/* --- cut above --- */` removes all lines above the instruction.
-   `/* --- cut below --- */` removes all lines below the instruction.
-   `/* --- cut begin --- */` and `/* --- cut end --- */` removes all lines between the two instructions.

Blank lines above or below the instructions will always be trimmed as well.
