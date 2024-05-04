---
name: MOTD
layout: content-with-menu
---

`motdProcessor` adds a MOTD style global message on the site.

This processor is also available as the deprecated alias `versionBannerProcessor`.

## Usage

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

The message to display.
May contain HTML markup.
