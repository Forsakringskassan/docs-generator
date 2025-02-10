---
title: Documenting TypeScript
short-title: TypeScript
layout: article
---

API documentation for TypeScript can be enabled using the {@link apiExtractorProcessor}:

Currently supports:

- Interfaces
- Type aliases

Only items that are publicly exported (i.e. exported from the main entrypoint and marked with `@public`) will be included.

## Usage

```md
::: api [OPTIONS]
TYPE:NAME
:::
```

where:

- `OPTIONS` is an optional list of options.
- `TYPE` is the kind of item to display, e.g. `interface`.
- `NAME` is the name of the item to display.

For instance:

```md
::: api
interface:ExampleInterface
:::
```

## Interfaces

Interfaces can either be shown as code (default) or as a table.

### Options

`code` (default)
: Renders interface as code.

`table`
: Renders interface as a property table.

### Examples

**Input:**

```md
::: api
interface:ExampleInterface
:::
```

**Output:**

::: api
interface:ExampleInterface
:::

**Input:**

```md
::: api table
interface:ExampleInterface
:::
```

**Output:**

::: api table
interface:ExampleInterface
:::

### Functions

Functions can either be shown as a function prototype or a parameter table.

### Options

`code` (default)
: Renders function as function prototype.

`table`
: Renders function as a parameter table.

### Examples

**Input:**

```md
::: api
function:exampleFunction
:::
```

**Output:**

::: api
function:exampleFunction
:::

**Input:**

```md
::: api table
function:exampleFunction
:::
```

**Output:**

::: api table
function:exampleFunction
:::
