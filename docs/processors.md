---
name: Processors
---

## Writing a new processor

A procesor implements the `Processor` interface:

```ts
export interface ProcessorHandler {
    before?: ProcessorStage;
    stage?: ProcessorStage;
    after?: ProcessorStage;
    name: string;
    enabled?: boolean;
    handler(
        context: ProcessorContext,
    ): void | string[] | Promise<void> | Promise<string[]>;
}
```

One of `before`, `stage` or `after` must be set and decides when the processor is run.

```import
processor-stage.ts
```

The `handler` callback performs the actual work.

### Navigation

To set navigation entries use one of the two navigation setters:

-   `setTopNavigation(..)`
-   `setSideNavigation(..)`

For instance:

```ts
export const myProcessor: Processor = {
    handler(context) {
        context.setTopNavigation({
            path: "./index.html",
            name: ".",
            title: "Site name",
            children: [
                {
                    path: "./foo.html",
                    name: "foo",
                    title: "Foo",
                    children: [],
                },
                {
                    path: "./bar.html",
                    name: "bar",
                    title: "Bar",
                    children: [],
                },
            ],
        });
    },
};
```

This will create a top navigation with two entries "Foo" and "Bar".

There is a helper function `generateNavtree` which creates a navigation structure from the document structure:

```ts
export const myProcessor: Processor = {
    handler(context) {
        const navtree = generateNavtree(context.docs);
        context.setTopNavigation(navtree);
        context.setSideNavigation(navtree);
    },
};
```

The above behaviour is bundled in the builtin `navigationProcessor()`.
