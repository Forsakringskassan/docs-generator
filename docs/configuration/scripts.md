---
title: Scripts
layout: article
---

Scripts can be compiled with the bultin `compileScript()` function:

```ts nolint nocompile
Generator.compileScript(name, src, options, buildOptions);
```

`name: string`
: Unique name for this script. Used when referencing the script and as the base of the output filename.

`src: string`
: Path to the script entrypoint.

`options: CompileOptions` {@optional}
: Options for this script.

    `appendTo` {@optional}
    : If and where the script should be injected into the document.

        One of:

    	* `"head"` - a `<script>` tag is automatically injected into `<head>`.
    	* `"body"` - a `<script>` tag is automatically injected into `<body>`.
    	* `"none"` - the script is not injected automatically.

    	If the script is not injected it is included in the importmap and can be referenced by other scripts with `import("name")`.

    	Default is `"none"`.

    `attributes: Record<string, unknown>` {@optional}
    : Extra HTML attributes to set on the `<script>` tag.

    `priority: number` {@optional}
    : Assets with higher priority is sorted and loaded earlier than assets with lower.
