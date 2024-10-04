---
title: Overriding templates
layout: article
---

Templates and partials can be overwritten to allow for custom designs of site layout as well as individual processors partials.

In the site configuration add one or more template folder:

```ts
const docs = new Generator({
    templateFolders: ["docs/templates"],
});
```

These folders are search (in order) and has precedence over the builtin template folder.
The first match is always used.
