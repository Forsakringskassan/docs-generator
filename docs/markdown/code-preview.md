---
title: Code preview
layout: content-with-menu
---

## Default, no language or tags

```
foo
```

## Explicit languages

**html**:

```html
<p>lorem <em>ipsum</em></p>
```

**ts**:

```ts
export interface Foo {
    name: string;
}
```

## Import

**html**:

```import
my-file.html
```

**ts**:

```import
my-file.ts
```

## Tags

### `static`

**inline**:

```html static
<p>lorem <em>ipsum</em></p>
```

**imported**:

```import static
my-file.html
```

### `nomarkup`

**inline**:

```html nomarkup
<p>lorem <em>ipsum</em></p>
```

**imported**:

```import nomarkup
my-file.html
```

## Runnable examples

```import
my-file.vue
```
