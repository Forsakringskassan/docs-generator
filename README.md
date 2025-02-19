# `@forsakringskassan/docs-generator`

```bash
npm install --save-dev --save-exact @forsakringskassan/docs-generator
```

## Setup

### Watch (development mode)

You can start a development server with watch for incremental builds using `.serve()`.

```ts name=watch
import {
    Generator,
    livereloadProcessor,
} from "@forsakringskassan/docs-generator";

const docs = new Generator({
    site: {
        name: "My Awesome Site",
    },
    setupPath: "docs/src/setup.ts",
    processors: [livereloadProcessor({ enabled: true })],
});

docs.build([
    /* ... */
]);

docs.serve();
```

### Vendor alias

Vendor alias is optional, it lets you substitute one package for another when bundling. The example below substitutes the package `vue` with the package `vue/dist/esm.bundle.js`. When an alias is given the package can be imported using the given alias as well as the original package name. For instance, when using the following configuration "vue" can be imported and resolved as "vue/dist/esm.bundle.js".

```ts name=vendor-alias
import {
    Generator,
    livereloadProcessor,
} from "@forsakringskassan/docs-generator";

const docs = new Generator({
    site: {
        name: "My Awesome Site",
    },
    setupPath: "docs/src/setup.ts",

    vendor: [
        {
            package: "vue",
            alias: "vue/dist/esm.bundle.js",
        },
    ],
});
```

## Usage

### Using with Vue 2

Vue 2 requires an additional dependency to be installed:

```bash
npm install --save-dev --save-exact @vue/component-compiler
```

Create the `setup` callback in `docs/src/setup.ts`:

```ts nocompile
import Vue from "vue";
import { type SetupOptions } from "@forsakringskassan/docs-generator";

/* optionally add global plugins or configuration */
//Vue.use(MyAwesomePlugin);

export function setup(options: SetupOptions): void {
    const { rootComponent, selector } = options;
    const vm = new Vue(rootComponent);
    vm.$mount(selector);
}
```

### Using with Vue 3

Create the `setup` callback in `docs/src/setup.ts`:

```ts nocompile
import { createApp } from "vue";
import { type SetupOptions } from "@forsakringskassan/docs-generator";

export function setup(options: SetupOptions): void {
    const { rootComponent, selector } = options;
    const app = createApp(rootComponent);

    /* optionally add global plugins or configuration */
    //app.use(MyAwesomePlugin);

    app.mount(selector);
}
```

### Styling

Three CSS files are provided:

- `@forsakringskassan/docs-generator/style/index.css` (aliased as `@forsakringskassan/docs-generator/style`)
- `@forsakringskassan/docs-generator/style/core.css`
- `@forsakringskassan/docs-generator/style/site.css`

`core` contains the necessary styling for components and elements and `site` contains the layout, typography etc required for a documentation site to work.
`index` is a combination of the two and should be used in most cases.

Style can be compiled with `compileStyle(name, src, [options])`:

```ts
import { Generator } from "@forsakringskassan/docs-generator";

const docs = new Generator({
    site: {
        name: "My Awesome Site",
    },
    setupPath: "docs/src/setup.ts",
});

docs.compileStyle("docs", "./docs/src/style.scss", {
    appendTo: "head",
});
```

Where `docs/src/style.scss` contains:

```scss
@use "~@forsakringskassan/docs-generator/style";
```

### Markdown

#### Links `{@link ...}`

To create link to a different document use `{@link ID [TITLE]}`, e.g.:

```md
See {@link MyAwesomeComponent} for details or the {@link getting-started getting started guide}.
```

will be rendered as:

```html
<p>
    See
    <a href="./components/my-awesome-component.html">MyAwesomeComponent</a> for
    details or the
    <a href="../guides/getting-started.html">getting started guide</a>.
</p>
```

The ID can be either the document identifier, name or one of the aliases.
The link destination will always be relative to the current document.

#### Code fence

For configured languages (default `html` and `vue`) code fences are run as a live example in the browser with an option to display the source code.
The following tags can be used:

- `borderless` - removes the border from the example.
- `fullscreen` - enable support for viewing the example in fullscreen.
- `static` - force code to be rendered without live preview (only syntax highlight).
- `live-example` - mark example as containing the `LiveExample` component.
- `nomarkup` - for live examples this hides the syntax highlighted code and only displays the result of the running code.
- `test-id=STRING` - Sets the `data-test` attribute.

`static` and `live` are used to manually set whenever the code should be run as a live example or not.

````md
```html static
<p>This is displayed as syntax highlighted code only</p>
```
````

````md
```js live
alert("This is run in the browser");
```
````

Examples can be imported using the `import` directive:

````md
```import
MyAwesomeFile.vue
```
````

This will search for `MyAwesomeFile.vue` in the configured `exampleFolders`.
HTML-comments may be placed before or after the filename.

To import an example that uses the [LiveExample](https://github.com/Forsakringskassan/docs-live-example) component you also need to use the `live-example` tag.

````md
```import live-example
MyAwesomeLiveExampleFile.vue
```
````

### Frontmatter

#### `status`

Set a status badge for a component.

The following statuses are recognized:

- `Produktionsklar`
- `Deprekerad`
- `Experimentell`
- `Preliminär`
- `Draft` (deprecated alias for `Preliminär`)
- `Beta` (deprecated alias for `Preliminär`)

#### `title`

Document title used for `<title>` and `<nav>`

#### `short-title`

Document title used when a shorter title is needed, e.g. site navigation.

#### `visible`

Set to `false` to hide document from navigation menu.
Default `true`.

#### `include`

Set to `false` to not write the document to file or include as a page.
Default `true`.

### Inline tags

#### `{@@link ...}`

Implicit title:

```md
Use the {@@link MyAwesomeComponent} component.
```

Explicit title:

```md
Use the {@@link MyAwesomeComponent awesome component}.
```

#### `{@@optional}`

Creates a tag (badge) to mark something as optional.

**Input:**

```md
{@@optional}
```

**Output:**

{@optional}

### Templating

The [Nunjucks](https://mozilla.github.io/nunjucks/) templating engine is used for rendering documents to HTML.
See [templating documentation](https://mozilla.github.io/nunjucks/templating.html) for help.

These custom filters and tags are available:

#### `container`

```
{% container "awesome-name" %}
```

Creates a container which processors may inject content into.

### Environment variables

#### `DOCS_ICON_LIB`

Preferred icon library package name.
Defaults to `@fkui/icon-lib-default`.
Makes it possible to dynamically load icons and get access to icon metadata.
The library must have been built using `@fkui/icon-lib-builder`.

```js nocompile
const icons = await import(process.env.DOCS_ICON_LIB);

for (const entry of Object.values(icons)) {
    entry.injectSpritesheet();
}
```

## Processors

### Matomo

```diff
 const docs = new Generator({
     processors: [
+        matomoProcessor({
+            siteId: "1",
+            apiUrl: "https://matomo.example.net/",
+            trackerUrl: "https://matomo.example.net/",
+        }),
     ],
 });
```

Optionally set `hostname` to limit which hostnames can run Matomo analytics:

```diff
 const docs = new Generator({
     processors: [
         matomoProcessor({
             siteId: "1",
             apiUrl: "https://matomo.example.net/",
             trackerUrl: "https://matomo.example.net/",
+            hostname: "docs.example.net",
         }),
     ],
 });
```

Only the domain must be specified, e.g it should not include `https://` or a path `/path/to/docs`.
Multiple hostnames can be specified as an array.
