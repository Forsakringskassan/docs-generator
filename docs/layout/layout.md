---
title: Layout
layout: article
sortorder: 1
---

The page layout can be set from the frontmatter block:

```md
---
layout: article
---
```

where `layout` can be one of:

- `article` - a page with with side navigation and aside.
- `component` - a page with side navigation, aside and component details.
- `default` - a blank page with no navigation or aside.
- `pattern` - deprecated alias for `article`.

or a {@link custom-layout custom layout}.
