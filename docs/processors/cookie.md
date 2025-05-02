---
name: Cookie
layout: content-with-menu
---

The `cookieProcessor` adds a cookie warning template block.
After the user consents, the cookie warning is hidden and cookies are set.

## Usage

```ts
import { Generator, cookieProcessor } from "@forsakringskassan/docs-generator";

/* --- cut above --- */

const docs = new Generator(import.meta.url, {
    /* --- cut begin --- */
    site: { name: ".." },
    setupPath: "..",
    /* --- cut end --- */

    processors: [cookieProcessor()],
});
```

## Configuration

For a custom cookie warning, replace the template at `partials/cookie-warning.html`.

Make sure to use the same button id's and top `cookie-warning` class.

## Making a processor respect cookie consent

A processor that sets cookies should respect the cookie consent, for example Matomo.
Do this by passing a callback to the global function `withCookieConsent`.

```ts
declare function withCookieConsent(cb: () => void): void;

/* --- cut above --- */

withCookieConsent(() => {
    // processor script
});
```

::: danger

This function is not publicly exported.
If you need this please file a bug explaining your use-case.

:::
