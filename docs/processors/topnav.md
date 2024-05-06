---
name: Topnav
layout: content-with-menu
---

`topnavProcessor` is a processor for manually handling the top navigation.
It allows you to specify the order and which items should appear.

## Usage

```ts
const docs = new Generator({
    processors: [topnavProcessor("./docs/topnav.json", "My Awesome Site!")],
});
```

The JSON file should a list of navigation items:

```json
[
    { "path": "./foo", "title": "Foo" },
    { "path": "./bar", "title": "bar" }
]
```
