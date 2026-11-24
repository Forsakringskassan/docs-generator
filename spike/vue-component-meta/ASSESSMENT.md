# Spike: vue-component-meta instead of vue-docgen-api

Branch `claude/stoic-bose-f58904`.

- **Prototype:** `src/file-reader/vue-file-reader/`.
- **Comparison harness:** `spike/vue-component-meta/compare.mjs`.
- **FKUI comparison reports:** `fkui-round1-report.md` (first prototype) and `fkui-round3/report.md` (final).

## Verdict: go, as a hybrid

vue-component-meta 3.3.14 (vuejs/language-tools, actively maintained) extracts what vue-docgen-api gets wrong:

- method-signature props such as `fetchData?(a, b): R`;
- `defineModel`, reactive-destructure defaults and generics;
- real function types instead of `TSFunctionType`.

On its own it does not give doc parity. docs-generator therefore keeps a small source pass of its own (`sfc-source.ts`, `parse-jsdoc.ts`, `component-type.ts`, about 900 lines). It uses only `vue/compiler-sfc` and the TypeScript parser, which were already available.

What the source pass covers, because vue-component-meta 3.3.14 does not:

| Gap in vue-component-meta                                                                                                                                                     | Handled by                                                                                                                                                 |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Event JSDoc (description, `@deprecated`, `@ignore`, `@param`/`@arg`, `@type`) is always empty, for every emits form. The declarations resolve into Vue's `runtime-core.d.ts`. | Reading `emits`, `defineEmits` and `this.$emit`/`emit()` doc comments from the source                                                                      |
| Options-API `emits: ["a", "b"]`: the single signature with a union event name is dropped; `onA`/`onB` props are reported instead (72 in FKUI).                                | Event names from the source; listener props hidden. `on*` function props declared only in `.d.ts` files (inherited from a compiled package) become events. |
| Template `@slot`/`@binding` comments are not read. Options-API components with a `<script>` get no slots at all.                                                              | Every `<slot>` comes from the template: description, `@binding`, attribute bindings, and merging when a slot is rendered more than once                    |
| `extends: X` loses inherited emits and template slots.                                                                                                                        | Following relative `.vue` imports given to `extends`                                                                                                       |
| Runtime `default() {}` methods are not reported. `() => x` is unwrapped also for function props, where `x` is not the default.                                                | Defaults read from the declaration: factories show their value, function props show the function                                                           |
| `validator(v) { return ["a", "b"].includes(v) }` enums                                                                                                                        | Literal union derived from the validator, including local and relatively imported `const` arrays                                                           |

All three vue-component-meta problems in the first rows are worth reporting upstream: event JSDoc, union names in `emits` arrays, and options-API template slots. Fixed upstream, the source pass shrinks to template slot comments and `@binding`.

## Spec results (`translate-api.spec.ts`)

|         | Today (vue-docgen-api) | Prototype |
| ------- | ---------------------- | --------- |
| Pass    | 27                     | 37        |
| Skipped | 5                      | 0         |

The 37 are the 32 existing tests plus 5 new regression tests:

- method-signature props with destructured defaults;
- untyped `emits` with `@type`;
- documented plus inferred slot bindings;
- validator enums;
- `extends` inheritance.

The 5 tests that were skipped now pass. `defineModel` passes as written. Props destructuring, emits object and both enum tests needed their expectations corrected, since those were placeholders: destructuring expected `{ name: string }` for a prop declared `number`.

Changed expectations, all intended:

- `mixed` and `unknown` become real types;
- tuple labels are kept (`[foo: number]`);
- the `FIXME` where slot `bar` got another slot's description is fixed;
- an untyped runtime `Array` prop becomes `unknown[]`;
- a `default() { return { name: "" } }` factory shows `{ name: "" }`, consistent with how vue-component-meta treats `() => value`.

The full repo suite passes: 476 tests.

## FKUI comparison (144 components in the docs config, final round)

0 errors, 68 components byte-identical. Per category, vue-docgen-api compared with the prototype:

- **Slots:** 1 removed, the bogus `item.name` from the dynamic `:name="item.name"`. 5 binding changes, all better types (e.g. `unknown` becomes `T`) or doc order. 3 description changes:
    - multi-line `@slot` text is now kept in full (2);
    - FDatepickerField has two stacked `@slot` comments, and the nearest is used (1).
- **Events:** 1 removed: FConfirmModal's dynamic `this.$emit(button.event)`, which vue-docgen-api documented as an event literally named `button.event`. 3 added:
    - XTimeTextField's inherited `blur` and `change`;
    - IPopupError's `close`, which vue-docgen-api missed.

    23 argument changes, mostly `<anonymous>` becoming the real argument name, and `undefined` or `mixed` becoming the real type.

- **Models:** 3 added: XTimeTextField; FTable `v-model:selectedRows` (`defineModel`); FCrudDataset (its update event is `@ignore`d). 17 type changes, all formatting (`string|null` becomes `string | null`) or resolved constructor aliases (`anyType` becomes the union).
- **Props:**
    - Added: `fetchData` (the original bug), FCrudDataset `modelValue` (now a v-model) and XTimeTextField's inherited props. vue-docgen-api could not resolve `extends` from `@fkui/vue`.
    - Type changes (26) are improvements: generic arguments kept (`NormalizedTableColumn<T, K>`, `Dataset<T> | T[]`), `TSFunctionType` becomes `(row: T) => HTMLAttributes["class"]`, `Record` becomes `Record<PropertyKey, …>`, and IFlex's imported validator lists become literal unions. FExpandableParagraph now includes the `""` its validator allows.
    - Default changes (108) are all intended: 47 `undefined` defaults shown as no default; 32 factories shown as their value (`() => generateElementId()` becomes `generateElementId()`); 19 newly detected (reactive destructure and `withDefaults`); and formatting (dedented, return types kept).

Review needed before shipping: whether the default-value presentation, and the resolved types where no annotation exists (`anyType`, `Record<string, any>` for `Object`), are what FKUI wants. Everything else is at least on par.

## Breaking-change surface

- **Rendered output:** types, defaults, event argument names, some slot/binding descriptions, a v-model for `@ignore`d update events, and newly visible inherited props. Component names and slugs, and with them anchors, are unchanged.
- **New optional peer dependency:** `typescript` `^5 || ^6`, only needed when `vueFileReader` is used (see "Lazy loading").
    - `typescript@7` is native and its package exports only `lib/version.cjs`, so vue-component-meta cannot work with it. `@volar/typescript` peers on `typescript <7`.
    - Consumers on TS 7 who document Vue components need TS 6 installed as `typescript`. Alternatively, docs-generator bundles vue-component-meta and aliases `typescript` to `@typescript/typescript6`. This is an open question.
- **API:** `vueFileReader` keeps its signature and finds the tsconfig itself. New: `createVueFileReader({ tsconfig })` and `VueFileReaderOptions`.
- **Dependencies:** `vue-docgen-api` (archived) is removed from `dependencies`; `vue-component-meta@3.3.14` is added and kept external in the bundle.

## Lazy loading

`vueFileReader` loads the extractor on first use (`load-translate-api.ts`): `vue-component-meta`, `@vue/language-core` and the source pass. The rollup build emits it as a separate chunk, `dist/translate-api-*.mjs`. Before loading, it checks the TypeScript compiler API and fails with a clear message otherwise:

```text
vueFileReader requires the TypeScript compiler API ("typescript" 5.x or 6.x) but the installed "typescript" (version 7.0.2) does not provide it. TypeScript 7 and later only provide the native compiler.
```

`typescript` is an optional peer dependency. vue-component-meta stays a regular dependency, about 2.4 MB not already installed by Vue, so Vue users install nothing extra; its own `typescript` peer is optional, so npm does not auto-install TS 7.

Measured on the built `dist`:

|                                            | Before (eager)                                                                | Lazy                                         |
| ------------------------------------------ | ----------------------------------------------------------------------------- | -------------------------------------------- |
| Importing `dist/index.mjs`                 | ~830 ms + ~120 ms, +~255 MB                                                   | ~830 ms, +~207 MB                            |
| Import with `typescript` resolving to TS 7 | failed at import (`Cannot read properties of undefined (reading 'Deferred')`) | ok; `vueFileReader` throws the message above |
| FKUI build                                 | unchanged; the cost moves to the first component                              |                                              |

- The deferred chunk costs ~120 ms and ~49 MB, measured over 5 runs.
- **Not avoided:** `typescript` itself still loads at import. The bundled `esbuild-plugin-vue3` (`dist/vue3-*.mjs`, which compiles examples) does `require("typescript")` at top level, as on `main`. Making that lazy too is a separate change.
- **Verified:**
    - `load-translate-api.spec.ts` covers loading once, a missing `typescript` and TS 7;
    - the full `npm run build` passes, including generating this repo's docs site with `vueFileReader` and html-validate;
    - the Vue example page renders its models, props, events and slots.

## tsconfig

- **Resolution order:**
    1. the explicit `tsconfig` option;
    2. the nearest `tsconfig.json`, following `references` to the project that includes the file (as tsserver does);
    3. otherwise an inferred project with default compiler options, the file added via `updateFile()`.
- **FKUI:** needs no configuration. `packages/vue/tsconfig.json` and `packages/vue-labs/tsconfig.json` are solution-style and resolve to their `tsconfig.lib.json`.
- **Caching:** one checker per tsconfig, so each program is built once per build. `updateFile()` is only called when a file's content changes (watch mode). A changed imported `.ts` dependency is not picked up within a long-lived process (open question: clear the cache on any change).

## Type normalisation

- **Declared types first:** use the author's annotation (`foo?: X`, `fetchData?(…): R` as a function type, `PropType<X>`, validator lists). This avoids checker noise such as `FormatFunction<any> & FormatFunction<string>`, `ClassValue` for `HTMLAttributes["class"]`, and the `| undefined` on optional props.
- **Fallback:** the checker type, with a trailing ` | undefined` and outer parentheses stripped and type literals on one line without `;`. Types using `typeof` always use the checker type.
- **Caveat:** the order of a checker-resolved union depends on which files TypeScript checked first. One fixture came out `"bar" | "foo" | "baz"` in one run and `"foo" | "bar" | "baz"` in another. Declared types are not affected.

## Build cost (FKUI)

| Measurement                                              | vue-component-meta                                            | vue-docgen-api  |
| -------------------------------------------------------- | ------------------------------------------------------------- | --------------- |
| `packages/vue`, 139 files, extractor only                | ~5.4 s (~3.8 s of it building the first program), ~740 MB RSS | ~1.3 s, ~430 MB |
| Full docs set, 144 files, through `translateAPI`, 2 runs | 7.9–8.7 s                                                     | 5.4–6.9 s       |

vue-docgen-api is slow on the full set because `vue-labs`' XTimeTextField makes it resolve the built `@fkui/vue`. The cost is paid once per build.

## Comparison with `origin/refactor/vue-component-meta`

An earlier, unmerged attempt exists: commit 573d624 by David Sveningsson, 2025-12-21, `feat(deps)!: replace vue-docgen-api with vue-component-meta`. Its implementation is copied verbatim, apart from import paths, to `translate-api-refactor.ts`, so the harness can compare it (`--baseline` / `--candidate refactor`). Reports: `fkui-refactor-vs-docgen/report.md` and `fkui-refactor-vs-meta/report.md`.

### What it does

- Only **slots** move to vue-component-meta. **Props, events and models still come from vue-docgen-api**, so the archived dependency stays, and so do its bugs: `fetchData?()` is dropped, and `defineModel`, destructure defaults, the composition `emits` object and `TSFunctionType` are unchanged.
- Slot docs in HTML comments are removed as a breaking change. Slots must be declared with `defineSlots()` or `slots: Object as SlotsType<…>`.
- `vueFileReader` becomes a factory, `vueFileReader(tsconfig = "tsconfig.json")`, which is a breaking change for every consumer. vue-component-meta is an optional peer dependency loaded with a dynamic `import()`.
- The returned reader calls `createChecker(tsconfig)` for every file, so the TypeScript program is rebuilt per component.

### Results

|                                                                     | vue-docgen-api (`main`)   | `refactor/vue-component-meta`                                                                       | This branch                                                       |
| ------------------------------------------------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| This branch's spec (37 tests)                                       | 18 pass / 19 fail         | 18 pass / 19 fail                                                                                   | 37 pass                                                           |
| Its own spec, Jest on a 2025-12 base, not run here                  | (same tests: 4 skipped)   | 26 active, 4 skipped (enums ×2, `defineModel`, composition emits object)                            | –                                                                 |
| FKUI slots / with description                                       | 235 / 203                 | 56 / 4                                                                                              | 234 / 203                                                         |
| FKUI slot bindings / with description                               | 128 / 120                 | 40 / 1                                                                                              | 127 / 121                                                         |
| FKUI components identical to vue-docgen-api                         | –                         | 72 of 144 (only slots differ)                                                                       | 68 of 144 (differences classified above)                          |
| `fetchData?()`, `defineModel`, destructure defaults, function types | ✗                         | ✗                                                                                                   | ✓                                                                 |
| Event docs, `extends`, validator enums                              | ✓                         | ✓ (via vue-docgen-api)                                                                              | ✓ (source pass)                                                   |
| Template `@slot` / `@binding` comments                              | ✓                         | ✗ (breaking)                                                                                        | ✓                                                                 |
| `defineSlots()` / `SlotsType` JSDoc and binding types               | partial (types `unknown`) | ✓                                                                                                   | ✓                                                                 |
| Options-API slots without `SlotsType`                               | ✓                         | ✗ (vue-component-meta reports none)                                                                 | ✓                                                                 |
| Archived `vue-docgen-api` at runtime                                | yes                       | yes                                                                                                 | no                                                                |
| `vueFileReader` API                                                 | `(filePath)`              | breaking: `(tsconfig?) => reader`                                                                   | unchanged, plus `createVueFileReader({ tsconfig })`               |
| Finding the tsconfig                                                | –                         | explicit; one tsconfig must include every component                                                 | automatic (nearest, following `references`) or explicit           |
| FKUI full set, time                                                 | 5.4–6.9 s                 | ~225 s extrapolated (~1.5 s per file with a new checker each time); ~8 s if the checker were cached | 7.9–8.7 s                                                         |
| `typescript` / vue-component-meta loading                           | –                         | lazy, optional peer                                                                                 | lazy; `typescript` optional peer, vue-component-meta a dependency |

The two implementations fail different tests from this branch's spec. Some expectations encode this branch's intended output (e.g. default-value formatting), so that row shows coverage, not strict correctness.

**FKUI impact of the earlier approach:** 179 of 235 slots and 199 of 203 slot descriptions disappear until FKUI rewrites the slot docs of about 80 components as `defineSlots()` or `SlotsType`. For the 65 options-API components that also means adding `slots: Object as SlotsType<…>`.

### Worth adopting from the earlier branch

- **Lazy loading.** It dynamically imports vue-component-meta and makes it an optional peer dependency. Adopted here, see "Lazy loading" above.
- **Optional slots in `defineSlots()`** (`default?()`), as in its fixtures. Already handled here; worth a fixture.

### Recommendation

Continue from this branch rather than the earlier one:

- it removes vue-docgen-api instead of keeping it;
- it fixes the reported bugs;
- it keeps FKUI's existing slot documentation working;
- it does not break `vueFileReader`.

The earlier branch's goal of steering authors toward `defineSlots()` / `SlotsType` still makes sense as guidance, but not as a hard break. Both are supported here.

Before either goes further, agree with the author of `origin/refactor/vue-component-meta` on two questions:

1. Should HTML-comment slot docs keep working?
2. Should `vueFileReader` stay zero-config?

## Open questions

- Report the three vue-component-meta gaps upstream?
- Make the example compiler's `typescript` import (bundled `esbuild-plugin-vue3`) lazy as well, so importing docs-generator never loads TypeScript?
- How to support consumers on TypeScript 7: bundle TS 6 under an alias, or require `typescript` ≤ 6?
- Accept the default-value presentation and the resolved types as a documented breaking change (major version)?
- Watch mode: invalidate cached checkers when non-`.vue` dependencies change.
- `mixins` are not followed for events or slots; `extends` from non-relative imports is only covered through the `.d.ts` listener props.
- Before merging:
    - drop `spike/`, the `vue-docgen-api` devDependency and the eslint ignore for `spike/`;
    - decide whether `vueFileReader` stays zero-config.
