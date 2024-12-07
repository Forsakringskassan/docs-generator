---
title: Fullscreen examples
layout: content-with-menu
---

Examples can run in fullscreen mode by using the `fullscreen` tag.
Currently supported languages is:

- `html`
- `vue`

````md
```html fullscreen
<p>Lorem ipsum</p>
```
````

This will render the following:

```html fullscreen
<p>Lorem ipsum</p>
```

### Template

The `template/example.template.html` file can be overridden to wrap the examples in additional elements, e.g:

```html static
<main>
    <h1>Awesome Heading</h1>
    <div>{{ content }}</div>
</main>
```

would wrap the example in a `<main>` tag and add a `<h1>` heading above it.
Do note that these changes will only be present in fullscreen mode, not when rendering inline on the markdown page.
