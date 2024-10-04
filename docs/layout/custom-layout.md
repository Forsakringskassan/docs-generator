---
title: Custom layout
layout: article
---

New layouts can be added similarly to {@link overriding-templates overriding templates} by creating a new file in the template folder with the `.template.html` extension.

`templates/foobar.template.html`:

```html static
{% extends "base.template.html" %}
```

To use this template on your page set `layout` to `foobar`.

Layouts are created with the [Nunjucks][nunjucks] templating engine.

[nunjucks]: https://mozilla.github.io/nunjucks/

## Base template

The template must override one of the base templates.

-   `base.template.html` - base template for all layouts
-   `content-with-menu.template.html` - template for layouts with side navigation.
-   `content-without-menu.template.html` - template for layouts without side navigation.

Read more about {@link plumbing plumbing} for details how these may be customized.

## Layout options

The builtin `base.template.html` comes with the following options:

-   `showAside` - if `true` the aside block on the right side will be shown.

Properties can be set with:

```html static
{% set showAside = true %} {% extends "base.template.html" %}
```

## Layout blocks

-   `sidenav` - content displayed on the right side.
-   `aside` - content displayed on the right side if `showAside` is enabled.
-   `content` - primary content.
