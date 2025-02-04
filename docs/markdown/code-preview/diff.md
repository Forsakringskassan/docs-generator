---
title: Diff
layout: article
---

Code diff can either be written manually using the `diff` language tag:

**Input:**

````md
```diff
-export function foo(value: string): string {
+export function foo(value: string, param: number): string {
     return "bar";
 }
```
````

**Output:**

```diff
-export function foo(value: string): string {
+export function foo(value: string, param: number): string {
     return "bar";
 }
```

Each line in a diff should:

- Use `+` to signify an added line.
- Use `-` to signify a removed line.
- Use ` ` (space) to have context lines surrounding added or removed lines.

## Comparing

Diffs can also be created by comparing two examples by naming the first using `name` and comparing with `compare`.
The original example may optionally be hidden with the `hidden` tag.

::: info Tip

Using `compare` instead of handwriting diff helps with syntax highlight, ensures code is well formatted and if {@link extractExamples extracting examples} ensure the source code compiles and lints as the extraction runs on the source code as written and not the diff.

:::

**Input:**

````md
```ts name=original hidden
export function foo(value: string): string {
    return "bar";
}
```

```ts compare=original
export function foo(value: string, param: number): string {
    return "bar";
}
```
````

**Output:**

```ts name=original hidden
export function foo(value: string): string {
    return "bar";
}
```

```ts compare=original
export function foo(value: string, param: number): string {
    return "bar";
}
```
