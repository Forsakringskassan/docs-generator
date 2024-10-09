---
title: Mermaid
layout: content-with-menu
---

Diagrams and charts can be created with [Mermaid](https://mermaid.js.org/) in markdown.
The results are rendered as SVG in the browser.

For instance, a flowchart can be created with:

````md
```mermaid
flowchart TD
  A-->B;
  A-->C;
  B-->D;
  C-->D;
```
````

Above will be rendered as:

```mermaid
flowchart TD
  A-->B;
  A-->C;
  B-->D;
  C-->D;
```

You can use the [Mermaid Live Editor](https://mermaid.live/) to help write your diagrams.

## Git graph

**Input:**

````md
```mermaid
gitGraph
    commit
    commit tag: "v1.2.0"
    commit
    branch feature/awesome-feature
    checkout feature/awesome-feature
    commit id: "feat: new awesome feature"
    checkout main
    commit
    commit tag: "v1.2.1"
    checkout feature/awesome-feature
    commit id: "docs: write documentation"
```
````

**Output:**

```mermaid
gitGraph
    commit
    commit tag: "v1.2.0"
    commit
    branch feature/awesome-feature
    checkout feature/awesome-feature
    commit id: "feat: new awesome feature"
    checkout main
    commit
    commit tag: "v1.2.1"
    checkout feature/awesome-feature
    commit id: "docs: write documentation"
```
