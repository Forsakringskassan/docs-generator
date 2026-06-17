---
name: Processors
layout: content-with-menu
sortorder: 1
---

## Writing a new processor

A procesor implements the `Processor` interface:

::: api
interface:ProcessorHandler
:::

One of `before`, `stage` or `after` must be set and decides when the processor is run.

```import
processor-stage.ts
```

The `handler` callback performs the actual work.

::: warning
When bundling processors in `@forsakringskassan/docs-generator` remember to add your processor to `src/available-processors.ts`!
:::

### Runtime scripts

If the processor needs a runtime script to be executed in the client browser use the `runtime` property to set one or more filenames.

```ts
import { type Processor } from "@forsakringskassan/docs-generator";

/* --- cut above --- */

export function myProcessor(): Processor {
    return {
        name: "awesome-processor",
        after: "render",
        runtime: [{ src: "src/runtime/awesome-processor.ts" }],
        handler() {
            /* ... */
        },
    };
}
```

Scripts from enabled processors will be bundled into a bundle `processors` added before the `</body>` tag.
Scripts from unused processors will not be included.

::: warning

Unless you are bundling your processor in `@forsakringskassan/docs-generator` it is up to you to make sure the script is properly compiled before building the documentation.

:::

### Navigation

To set navigation entries use one of the two navigation setters:

- `setTopNavigation(..)`
- `setSideNavigation(..)`

For instance:

```ts
import { type Processor } from "@forsakringskassan/docs-generator";

/* --- cut above --- */

export function myProcessor(): Processor {
    return {
        stage: "generate-nav",
        name: "custom-navigation-processor",
        handler(context) {
            context.setTopNavigation({
                path: "./index.html",
                key: ".",
                title: "Site name",
                visible: true,
                sortorder: 1,
                children: [
                    {
                        path: "./foo.html",
                        key: "foo",
                        title: "Foo",
                        visible: true,
                        sortorder: 2,
                        children: [],
                    },
                    {
                        path: "./bar.html",
                        key: "bar",
                        title: "Bar",
                        visible: true,
                        sortorder: 1,
                        children: [],
                    },
                ],
            });
        },
    };
}
```

This will create a top navigation with two entries "Foo" and "Bar".

### Link resolver

A processor can optionally implement the `resolveLink` as a link resolver.
Each link resolver is called when processing `{@link ...}` tags, if one or more link resolvers return a result the first one is used and replaced the regular link.
Link resolvers are called in the same order as they appear in the list of processors.

Typical usage includes linking to external sites.

The resolver overrides the normal handling of links, when a resolver returns a result the final link will be rendered with it even if it would normally throw an exception (e.g. when linking to missing documents).

#### Parameters

`key: string`
: Key (without hash) referenced by user

`hash: string | null`
: Optional hash from the key (includes the `#` prefix)

`title: string | null`
: Optional explicit title requested by user

`doc: Document | null`
: Matching document if one was found

#### Return value

An object with a resolved link or `null` or `undefined` if the resolver could not resolve the link.

`href: string`
: Link target (href attribute of the `<a>` element)

`title: string`
: Link text

`rel?: "external"`
: If given, the `rel` attribute is set with this value on the `<a>` element

#### Example

To resolve a `{@link foo}` tag to a custom url:

```ts
import { type Processor } from "@forsakringskassan/docs-generator";

/* --- cut above --- */

export function myProcessor(): Processor {
    return {
        name: "awesome-processor",
        before: "render",
        handler() {
            /* ... */
        },
        resolveLink({ key, title }) {
            if (key === "foo") {
                return {
                    href: "https://example.net/foo",
                    title: title ?? key,
                    rel: "external",
                };
            }
            return null;
        },
    };
}
```
