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

Comparision can also be used with imported sources:

**Input:**

````md
```import name=original-imported hidden
diff-original.ts
```

```import compare=original-imported
diff-updated.ts
```
````

**Output:**

```import name=original-imported hidden
diff-original.ts
```

```import compare=original-imported
diff-updated.ts
```

### Context lines

To control the number of context lines use `context=N` where `N` is an integer greater than zero.
This sets the number of lines to show before and after the changed lines.
Default is 3 lines.

```plaintext name=numbers hidden
line 1
line 2
line 3
line 4
line 5
line 6
line 7
line 8
line 9
line 10
line 11
line 12
line 13
line 14
line 15
line 16
line 17
line 18
line 19
line 20
line 21
line 22
line 23
line 24
line 25
line 26
line 27
line 28
line 29
```

For instance, with `context=1` we see one line before and after:

```plaintext compare=numbers context=1
line 1
line 2
line 3
line 4
line 5
line 6 # change this line
line 7
line 8
line 9
line 10
line 11
line 12
line 13
line 14
line 15
line 16
line 17
line 18
line 19
line 20 # and this
line 21
line 22
line 23
line 24
line 25
line 26
line 27
line 28
line 29
```

And with `context=6` we see four lines instead:

```plaintext compare=numbers context=4
line 1
line 2
line 3
line 4
line 5
line 6 # change this line
line 7
line 8
line 9
line 10
line 11
line 12
line 13
line 14
line 15
line 16
line 17
line 18
line 19
line 20 # and this
line 21
line 22
line 23
line 24
line 25
line 26
line 27
line 28
line 29
```

::: info Tip

To avoid creating diffs with multiple chunks add two or more code fences each with their own part of the diff.

For instance, the above example could be split into:

```plaintext compare=numbers context=2
line 1
line 2
line 3
line 4
line 5
line 6 # change this line
line 7
line 8
line 9
line 10
line 11
line 12
line 13
line 14
line 15
line 16
line 17
line 18
line 19
line 20
line 21
line 22
line 23
line 24
line 25
line 26
line 27
line 28
line 29
```

```plaintext compare=numbers context=2
line 1
line 2
line 3
line 4
line 5
line 6
line 7
line 8
line 9
line 10
line 11
line 12
line 13
line 14
line 15
line 16
line 17
line 18
line 19
line 20 # and this
line 21
line 22
line 23
line 24
line 25
line 26
line 27
line 28
line 29
```

:::
