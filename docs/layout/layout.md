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

- `api` - a page with with side navigation and aside.
- `article` - a page with with side navigation and aside.
- `component` - a page with side navigation, aside and component details.
- `default` - a blank page with no navigation or aside.
- `pattern` - deprecated alias for `article`.

or a {@link custom-layout custom layout}.

## API

The API layout contains several sublayouts to further specialize what type of API it describes:

- `api.class` - for documenting a class.
- `api.composable` - for documenting a composable.
- `api.constant` - for documenting a constant.
- `api.enum` - for documenting an enum.
- `api.function` - for documenting a function.
- `api.interface` - for documeting an interface.
- `api.method` - for documenting a class method.
- `api.type` - for documenting a type.

The default visual presentation of these does not differ but can be {@link overriding-templates overridden by the consumer} and/or used as metadata.
