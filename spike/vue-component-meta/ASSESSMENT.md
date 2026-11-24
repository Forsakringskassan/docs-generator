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
- **New peer dependency:** `typescript` `^5 || ^6`.
    - `typescript@7` is native and its package exports only `lib/version.cjs`, so vue-component-meta cannot work with it. `@volar/typescript` peers on `typescript <7`.
    - Consumers on TS 7 need TS 6 installed as `typescript`. Alternatively, docs-generator bundles vue-component-meta and aliases `typescript` to `@typescript/typescript6`. This is an open question.
- **API:** `vueFileReader` keeps its signature and finds the tsconfig itself. New: `createVueFileReader({ tsconfig })` and `VueFileReaderOptions`.
- **Dependencies:** `vue-docgen-api` (archived) is removed from `dependencies`; `vue-component-meta@3.3.14` is added and kept external in the bundle.

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

## Open questions

- Report the three vue-component-meta gaps upstream?
- How to support consumers on TypeScript 7: bundle TS 6 under an alias, or require `typescript` ≤ 6?
- Accept the default-value presentation and the resolved types as a documented breaking change (major version)?
- Watch mode: invalidate cached checkers when non-`.vue` dependencies change.
- `mixins` are not followed for events or slots; `extends` from non-relative imports is only covered through the `.d.ts` listener props.
- Before merging:
    - drop `spike/`, the `vue-docgen-api` devDependency and the eslint ignore for `spike/`;
    - decide whether `vueFileReader` stays zero-config.
