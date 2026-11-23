# Spike: vue-component-meta instead of vue-docgen-api

Branch `claude/stoic-bose-f58904`. Status: prototype works, a second round of fixes is still pending (see "Not done").

## Verdict: go, but as a hybrid

vue-component-meta 3.3.14 fixes what vue-docgen-api gets wrong: method-signature props such as `fetchData?(a, b): R`, `defineModel`, reactive-destructure defaults, generics and `TSFunctionType`. It does not give doc parity on its own, so docs-generator keeps a small SFC source pass of its own. That pass is `sfc-source.ts` plus `parse-jsdoc.ts`, about 600 lines, built on `vue/compiler-sfc` and the TypeScript parser, both already available. The pass covers four gaps in vue-component-meta 3.3.14:

1. **Event JSDoc is always empty.** This holds for every emits form, call signatures included, because the declarations resolve into Vue's `runtime-core.d.ts`. Descriptions, `@deprecated`, `@ignore`, `@param`/`@arg` and `@type` are read from the source.
2. **Options-API `emits: ["a", "b"]` loses its events.** It yields a single signature whose event name is a union, and vue-component-meta drops it. Instead it leaves `onA`/`onB` props behind (72 such props in FKUI). This would be a small upstream fix; for now the prototype recovers the names from the source and hides the listener props.
3. **Template `@slot`/`@binding` comments are not read.** Also, for options-API components with a `<script>`, vue-component-meta returns no slots at all (e.g. FIcon, FExpandablePanel, FSelectField). Every `<slot>` must therefore come from the template pass.
4. **`extends: X` (11 FKUI extended text fields) does not inherit the parent's emits or template slots.** This is pending, see below.

## Spec results (`translate-api.spec.ts`)

- Today: 27 pass, 5 skipped.
- Prototype: 32 of 32 pass, plus 3 new regression tests (method-signature props, the `emits` array with `@type`, mixed documented/inferred bindings).
- The 5 previously skipped tests now pass: `defineModel` as written, and props destructuring, emits object and both enum tests after fixing expectations that were placeholders.
- Expected-value changes are all improvements:
    - real types replace `mixed` and `unknown`;
    - tuple labels are kept;
    - the `FIXME` where a slot inherited the wrong description is fixed;
    - an untyped runtime `Array` prop becomes `unknown[]`.

## FKUI comparison, round 1 (144 components, no errors)

- 65 components identical.
- Full table: `fkui-report-round1.md`. Harness: `compare.mjs`.
- Improvements:
    - `fetchData` restored;
    - 40 newly detected defaults;
    - generic args kept (`NormalizedTableColumn<T, K>`, `Dataset<T> | T[]`);
    - `TSFunctionType` becomes `(row: T) => HTMLAttributes["class"]`;
    - named event arguments with real types.

**Regressions still to fix (round 2):**

- `extends`: inherited events, v-model and slots are missing in the 11 text fields.
    - Patch written: `pending-sfc-rewrite.py`.
    - Not yet applied: `translate-api.ts` still needs to consume `attributeBindings`/`withDefaults`, and declarations in another `.vue` file need their own SFC lookup.
- Undocumented `<slot>`s in options-API components are missing (same patch).
- `validator(v) { return ["h1", …].includes(v) }` enums now show `string` (13 props). vue-docgen-api derived the literal union from the validator. Still to do.
- Event argument descriptions written as `@arg`, and `@param {T} name` on untyped emits, are not picked up yet.
- Default values:
    - method defaults are not dedented;
    - `undefined` should count as no default;
    - vue-component-meta unwraps `() => x` to `x`, which is wrong for function-typed props.
- Slot doc comments separated from the `<slot>` by another comment (FInteractiveTable), and binding types containing `{}`.

## Breaking-change surface

- **Rendered output changes:** types (resolved or as-written), default text, event argument names, some slot/binding descriptions, and prop order for `extends`.
    - Anchors and slugs: unchanged so far (component names are the same).
- **New peer dependency:** `typescript` `^5 || ^6`.
    - TypeScript 7 (`typescript@7` is native and exports only `lib/version.cjs`) breaks it.
    - `@volar/typescript` peers on `typescript <7`.
    - Option: bundle vue-component-meta and alias `typescript` to `@typescript/typescript6`.
- **API:** `vueFileReader` is unchanged (it auto-discovers the tsconfig). New: `createVueFileReader({ tsconfig })` and `VueFileReaderOptions`.

## tsconfig

- **Resolution order:**
    1. the explicit `tsconfig` option;
    2. the nearest `tsconfig.json`, following `references` to the project that includes the file (as tsserver does);
    3. otherwise an inferred default project, with the file added via `updateFile`.
- **FKUI:** needs no config. `packages/vue/tsconfig.json` and `packages/vue-labs/tsconfig.json` are solution-style and resolve to their `tsconfig.lib.json`.
- **Caching:** one checker per tsconfig. `updateFile` is only called when a file's content changes (watch mode); a changed imported `.ts` dependency is not detected.

## Type normalisation

- **Declared types first:** use the author's annotation (`foo?: X`, `fetchData?(…): R`, `PropType<X>`) when it exists. This avoids resolved-type noise such as `FormatFunction<any> & FormatFunction<string>`, `ClassValue` for `HTMLAttributes["class"]` and `| undefined`.
- **Fallback:** use the checker type with a trailing ` | undefined` and outer parentheses stripped and `;` removed in type literals. Types using `typeof` always use the resolved type.
- **Caveat:** the order of a resolved union depends on which files TypeScript checked first. It differed between runs: `"bar" | "foo" | "baz"` in one, `"foo" | "bar" | "baz"` in another.

## Build cost (FKUI `packages/vue`, 139 files)

- vue-component-meta: about 5.4 s and 740 MB RSS, of which about 3.8 s is building the first program.
- vue-docgen-api: about 1.3 s and 430 MB.
- So roughly 4× slower and +300 MB, paid once per build.

## Open questions

- Upstream fixes, since vue-component-meta is maintained:
    - event JSDoc;
    - union names in `emits` arrays;
    - options-API template slots.
- Vendor or bundle TypeScript 6 for consumers that move to TS 7?
- Keep docgen-compatible type strings, or accept the more precise resolved/declared types as a documented breaking change?
- Before merging: drop `spike/`, the `vue-docgen-api` devDependency and the `eslint` ignore for `spike/`.
