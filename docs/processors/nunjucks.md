---
title: Nunjucks
layout: content-with-menu
---

## Filters

### `dump(value: unknown)`

Dump input into a JSON serialized content wrapped into a `<pre>`.
See also `json`.

```
{{ item | dump }}
```

Given `item` is `{ foo: "bar" }` this outputs:

```html static
<pre>
{
  foo: "bar"
}</pre
>
```

### `json(value: unknown)`

Convert input into a JSON serialized string.
See also `dump`.

```
{{ item | json }}
```

Given `item` is `{ foo: "bar" }` this outputs:

```html static
{ foo: "bar" }
```

### `relative(url: string, document: Document)`

Creates a relative link to `url`.
The current document must be passed in as an `argument`.

```
{{ "/path/to/page.html" | relative(doc) }}
```

Given `doc` is a document at `/path/from/here.html` this outputs:

```html static
../to/page.html
```

### `take(haystack: T[], key: string, value: string)`

Takes all items from `haystack` where `key` is `value`.

```
{{ items | take("type", "thing") }}
```

Given that `items` is an array where only some of the items matches `{ type: "thing" }` this will output only those items.
