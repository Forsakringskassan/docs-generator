---
title: Examples
layout: article
visible: false
---

## Multiple inline examples

All three examples should run properly, i.e. render the following strings:

1. `"foo"`
1. `"foo"`
1. `"bar"`

```vue nomarkup name=inline-1
<template>foo</template>
```

```vue nomarkup name=inline-2
<template>foo</template>
```

```vue nomarkup name=inline-3
<template>bar</template>
```

## Multiple imported examples

All three examples should run properly, i.e. render the following strings:

1. `"foo"`
1. `"foo"`
1. `"bar"`

```import nomarkup name=imported-1
examples-imported-foo.vue
```

```import nomarkup name=imported-2
examples-imported-foo.vue
```

```import nomarkup name=imported-3
examples-imported-bar.vue
```

## Diff inline

```html name=diff-base-inline hidden
<p>lorem ipsum</p>
```

```html static compare=diff-base-inline name=diff-inline
<div class="wrapper">
    <p>lorem ipsum</p>
</div>
```

## Diff imported

```import name=diff-base-imported hidden
examples-imported-base.html
```

```import static compare=diff-base-imported name=diff-imported
examples-imported-updated.html
```
