---
title: Source url
layout: component
component:
    - Foo
    - name: Bar
      source: example-content/**/_bar.scss
---

`sourceUrlProcessor` adds a template function, `componentSourceUrl`, used by the component layout
template for generating links at the upper right menu.

## Usage

```ts
const pkg = await fs.readFile("package.json", "utf-8");
const docs = new Generator({
    processors: [
        sourceUrlProcessor(pkg, {
            urlFormat: "{{ repository }}/tree/main/{{ path }}",
            componentFileExtension: "baz",
        }),
    ],
});
```

## Configuration

The `sourceUrlProcessor` takes a configuration object:

`sourceUrlProcessor(pkg, { /* ... */ })`

### `enabled`

-   Type: `boolean`
-   Default: `true`

Enables/disables the processor.

### `urlFormat`

-   Type: `string`
-   Required: true

The URL format of the generated source link.

`{{ repository }}/blob/{{ hash }}/{{ path }}`

The following placeholders can be used:

-   `hash` - the full hash of the commit.
-   `short` - the abbreviated hash of the commit.
-   `path` - relative source file path.
-   `repository` - the normalized URL to the source repository (derived from the `repository.url` field in `package.json`).

### `componentFileExtension`

-   Type: `string | undefined`
-   Default: `vue`

File extension searched for when trying to find a component by name.

### Component template metadata

A component link is generated for each item in the `component` section.

For a simple string, it will search for a file matching the component name and file extension as configured in the processor.

```ts
---
component:
    - Foo
---
```

For an object with name and source, it will search for a file matching the `source` pattern.
This hint may be neccessary when having multiple files with the same filename, or when the component name
differs from the filename.

```ts
---
component:
    - name: Bar
      source: example-content/**/_bar.scss
---
```

Docs generation will fail if a component is not found or if there are multiple hits.
