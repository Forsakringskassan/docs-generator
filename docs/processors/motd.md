---
name: MOTD
layout: content-with-menu
---

`motdProcessor` adds a MOTD style global message on the site.

```html nomarkup
<div class="docs-motd docs-motd--info">
    <span class="docs-motd__icon">
        <span class="icon-stack icon-stack--info">
            <svg class="icon icon--circle" focusable="false" aria-hidden="true">
                <use xlink:href="#docs-icon-circle"></use>
            </svg>
            <svg class="icon icon--i" focusable="false" aria-hidden="true">
                <use xlink:href="#docs-icon-i"></use>
            </svg>
        </span>
    </span>
    <span class="sr-only">Informationsmeddelande</span>
    <p>My awesome message of the day!</p>
</div>
```

This processor is also available as the deprecated alias `versionBannerProcessor`.

## Usage

```ts
import fs from "node:fs/promises";
import { Generator, motdProcessor } from "@forsakringskassan/docs-generator";

/* --- cut above --- */

const docs = new Generator(import.meta.url, {
    /* --- cut begin --- */
    site: { name: ".." },
    setupPath: "..",
    /* --- cut end --- */

    processors: [motdProcessor()],
});
```

If you need a static message (always present) you can set the `message` property.

```ts
import fs from "node:fs/promises";
import { Generator, motdProcessor } from "@forsakringskassan/docs-generator";

/* --- cut above --- */

const docs = new Generator(import.meta.url, {
    /* --- cut begin --- */
    site: { name: ".." },
    setupPath: "..",
    /* --- cut end --- */

    processors: [
        motdProcessor({
            message: "Lorem ipsum dolor sit amet.",
        }),
    ],
});
```

## Configuration

The `motdProcessor` takes a configuration object:

```ts
import { motdProcessor } from "@forsakringskassan/docs-generator";

/* --- cut above --- */

motdProcessor({
    enabled: true,
    container: "body:begin",
    message: "Lorem ipsum dolor sit amet",
});
```

### `enabled`

- Type: `boolean`
- Default: `true`

Enables/disables the MOTD processor.

### `container`

- Type: `string`
- Default: `body:begin`

The name of a container (in layout template) to render content in.
If the container does not exist for given layout the content will not be rendered.

### `message`

- Type: `string`
- Required: yes

Output a static message.
May contain HTML markup.

## API

There is a runtime API to render dynamic messages:

```ts
interface MOTDMessage {
    /** Text message (may include HTML) */
    message: string;

    /** ID of message template to use */
    template?: string;

    /** Optional extra bindings */
    bindings?: Record<string, string>;

    /** Called with the new DOM element before the element is shown */
    preprocess?(element: DocumentFragment): void;
}

declare const motd: {
    readonly enabled: boolean;
    showMessage(message: MOTDMessage): void;
};
```

::: warning

Using the API without the processor causes a runtime error.

:::

Example usage:

```ts
import { motd } from "@forsakringskassan/docs-generator/runtime";

motd.showMessage({
    message: "lorem ipsum dolor sit amet",
});
```

::: info

This may cause the page content to be pushed down after initial rendering.
This may degrade user experience.

:::
