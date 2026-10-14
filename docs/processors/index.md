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

One of `before`, `stage` or `after` decides when the processor is run.
Any combination can be set, `before` and `after` can also be an array.
A processor without any of them is run as early as possible.

```import
processor-stage.ts
```

`stage`
: Run during the given stage. Must be one of the stages above.

`before`, `after`
: Run before or after a stage, or before or after another processor (by `name`).
When set to the name of another processor the processor is run in the same stage as the other processor.

The processor is run once, in the earliest position satisfying all constraints.
If a referenced processor does not exist the reference is ignored.
For instance a processor with only `after: "missing-processor"` is run as early as possible.

If the constraints cannot be satisfied (e.g. `before` and `after` set to the same name, circular dependencies or `stage` set to the name of a processor) the build fails with an error describing the conflict.

```ts
import { type Processor } from "@forsakringskassan/docs-generator";

/* --- cut above --- */

export function myProcessor(): Processor {
    return {
        name: "awesome-processor",
        after: ["generate-nav", "other-processor"],
        before: "render",
        handler() {
            /* ... */
        },
    };
}
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
