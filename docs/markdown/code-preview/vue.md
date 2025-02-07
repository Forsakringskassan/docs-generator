---
title: Vue examples
layout: article
---

## Options API

```import
vue-options.vue
```

## Composition API

```import
vue-composition.vue
```

## Snippets

The source code may also contains snippets which are cut from the rendered source code.

This is mostly useful in combination with extracting the example source code and running external tools, e.g. compiling the example might require additional imports or declarations.

**Input:**

````md
```vue
<script setup>
import { ref } from "vue";

const name = "World";
</script>

<template>
    <!-- cut above -->
    <p>Hello {{ name }}!</p>
    <!-- cut below -->
</template>
```
````

**Output:**

```vue
<script setup>
const name = "World";
</script>

<template>
    <!-- cut above -->
    <p>Hello {{ name }}!</p>
    <!-- cut below -->
</template>
```

The following instructions are available:

- `<!-- cut above -->` removes all lines above the instruction.
- `<!-- cut below -->` removes all lines below the instruction.
- `<!-- cut begin -->` and `<!-- cut end -->` removes all lines between the two instructions.

Blank lines above or below the instructions will always be trimmed as well.
