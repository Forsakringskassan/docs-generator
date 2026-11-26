---
title: Inline-tags
layout: content-with-menu
---

## Template variables (`{@@variable ...}`)

You can insert template variables directly in Markdown files using the `{@@variable <name>}` inline tag. (such as variables registered by processors via `context.setTemplateData(key, value)`) directly in Markdown files using the `{@@variable <name>}` inline tag.

This works in regular Markdown text as well as inside HTML attributes:

```markdown
<a class="button button--primary" href="{@@variable sandboxLink}">
    Open playground
</a>
```

If the referenced variable does not exist, rendering will fail with `EVARIABLETARGET`. Non-string values are serialized as JSON.
