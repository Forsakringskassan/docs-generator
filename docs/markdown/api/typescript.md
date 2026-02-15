---
title: Documenting TypeScript
short-title: TypeScript
layout: article
---

API documentation for TypeScript can be enabled using the {@link apiExtractorProcessor}:

Currently supports:

- Interfaces

Only items that are publicly exported (i.e. exported from the main entrypoint and marked with `@public`) will be included.

## Usage

```md
::: api [OPTIONS]
TYPE:NAME
:::
```

where:

- `OPTIONS` is an optional list of rendering options.
- `TYPE` is the kind of item to display, e.g. `interface`.
- `NAME` is the name of the item to display.

For instance:

```md
::: api
interface:ExampleInterface
:::
```

## Interfaces

Interfaces can either be shown as code (default) or as a property table.

### Options

`code` (default)
: Renders interface as code.

`properties`
: Renders interface as a property table.

`inherit`
: Includes members inherited from parent interfaces.

    For property tables, this is the default behavior.

`noinherit`
: Excludes inherited members.

    For code, this is the default behavior.

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
