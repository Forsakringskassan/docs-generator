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

---

::: api syntax
interface:ProcessorHandler
:::

---

One of `before`, `stage` or `after` must be set and decides when the processor is run.

::: api
type:ProcessorStage
:::

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
