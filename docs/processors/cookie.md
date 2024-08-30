---
name: Cookie
layout: content-with-menu
---

The `cookieProcessor` adds a cookie warning template block.
After the user consents, the cookie warning is hidden and cookies are set.

## Usage

```ts
const docs = new Generator({
    processors: [cookieProcessor()],
});
```

## Configuration

For a custom cookie warning, replace the template at `partials/cookie-warning.html`.

Make sure to use the same button id's and top `cookie-warning` class.

## Making a processor respect cookie consent

A processor that sets cookies should respect the cookie consent, for example Matomo.
Do this by passing a callback to the global function `withCookieConsent`.

```js
withCookieConsent(() => {
    // processor script
});
```
