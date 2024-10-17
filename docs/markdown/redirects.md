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
