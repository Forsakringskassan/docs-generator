---
title: Redirects
layout: article
redirect_from:
    - "example/redirect.html"
---

Redirects are configured on the target document.

To configure a redirect from `old-page.html` to `new-page.html` edit `new-page.md`:

```md
---
title: New page
redirect_from:
    - old-page.html
---
```

Make sure `old-page.md` does not exist.

::: warning

Remember to configure a redirect generator:

- `htmlRedirectProcessor` for generating HTML meta refresh redirects.
- `redirectFileProcessor` for generating a Netlify-style `_redirect` file.

:::

## `htmlRedirectProcessor`

Generates html-files with a HTML meta refresh.
supported by all hosting services but does not respond with proper a proper HTTP 301 response.

## `redirectFileProcessor`

Generate a Netlify-style `_redirect` file.
Not supported by all hosting sevices but will respond with proper HTTP status codes.
