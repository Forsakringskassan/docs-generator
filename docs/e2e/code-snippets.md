---
title: Code snippets
layout: article
visible: false
---

## Inline typescript

```ts name=ts-inline test-id=ts-inline
declare function foo(value: string): string;

/* --- cut above --- */

foo("bar");
```

## Imported typescript

```import name=ts-import test-id=ts-import
code-snippets-ts.ts
```

## Inline Vue

```vue name=vue-inline test-id=vue-inline
<script setup>
const name = "World";
</script>

<template>
    <!-- cut above -->
    <p>Hello {{ name }}!</p>
    <!-- cut below -->
</template>
```

## Imported Vue

```import name=vue-import test-id=vue-import
code-snippets-vue.vue
```
