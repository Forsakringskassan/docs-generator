---
title: Images
layout: article
---

Images can be inserted using the `![alt text](./path/to/image.png)` syntax.
The path must be relative to the markdown file.

```md
![Photo of a cat](./cat.jpg)
```

Above will be rendered as:

![Photo of a cat](./cat.jpg)

All referenced images will be copied into `${outputFolder}/assets/images` automatically.
