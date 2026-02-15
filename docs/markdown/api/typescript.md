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

`properties`
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
::: api properties
interface:ExampleInterface
:::
```

**Output:**

::: api properties
interface:ExampleInterface
:::

## Functions

Functions can either be shown as a function prototype, a parameter table or return value description.

### Options

`prototype` (default)
: Renders function as function prototype.

`parameters`
: Renders function as a parameter table.

`returnvalue`
: Renders function as a return value description.

`docs`
: Render full documentation including headings (prototype, parameters and return value).

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
::: api parameters
function:exampleFunction
:::
```

**Output:**

::: api parameters
function:exampleFunction
:::

**Input:**

```md
::: api returnvalue
function:exampleFunction
:::
```

**Output:**

::: api returnvalue
function:exampleFunction
:::

**Input:**

```md
::: api docs
function:exampleFunction
:::
```

**Output:**

::: api docs
function:exampleFunction
:::
