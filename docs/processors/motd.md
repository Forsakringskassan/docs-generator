---
name: MOTD
layout: content-with-menu
---

`motdProcessor` adds a MOTD style global message on the site.

```html nomarkup
<div class="message-box message-box--info">
    <span class="message-box__icon">
        <span class="icon-stack icon-stack--info">
            <svg class="icon__info icon" focusable="false" aria-hidden="true">
                <use xlink:href="#docs-icon-circle"></use>
            </svg>
            <svg class="icon" focusable="false" aria-hidden="true">
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
const docs = new Generator({
    processors: [motdProcessor()],
});
```

If you need a static message (always present) you can set the `message` property.

```ts
const docs = new Generator({
    processors: [motdProcessor({ message: "Lorem ipsum dolor sit amet." })],
});
```

## Configuration

The `motdProcessor` takes a configuration object:

```ts
motdProcessor({
    enabled: true,
    container: "body:begin",
    message: "Lorem ipsum dolor sit amet",
});
```

### `enabled`

-   Type: `boolean`
-   Default: `true`

Enables/disables the MOTD processor.

### `container`

-   Type: `string`
-   Default: `body:begin`

The name of a container (in layout template) to render content in.
If the container does not exist for given layout the content will not be rendered.

### `message`

-   Type: `string`
-   Required: yes

Output a static message.
May contain HTML markup.

## API

There is a runtime API to render dynamic messages:

```ts
export interface MOTDMessage {
    /** Text message (may include HTML) */
    message: string;

    /** ID of message template to use */
    template?: string;

    /** Optional extra bindings */
    bindings?: Record<string, string>;

    /** Called with the new DOM element before the element is shown */
    preprocess?(element: DocumentFragment): void;
}

declare global {
    interface Window {
        MOTD: {
            showMessage(message: MOTDMessage): void;
        };
    }
}
```

Example usage:

```ts
MOTD.showMessage({
    message: "lorem ipsum dolor sit amet",
});
```

> Note: this may cause the page content to be pushed down after initial
> rendering. This may degrade user experience.

Using the API without the processor causes a runtime error.
