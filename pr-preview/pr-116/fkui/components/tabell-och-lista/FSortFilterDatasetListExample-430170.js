"use strict";
(() => {
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });

  // docs/src/setup.ts
  var import_vue = __require("vue");
  var import_vue2 = __require("@fkui/vue");
  function setup(options) {
    const { rootComponent, selector } = options;
    const app = (0, import_vue.createApp)({
      render() {
        return (0, import_vue.h)(import_vue2.FErrorHandlingApp, { defaultComponent: rootComponent });
      }
    });
    (0, import_vue2.setRunningContext)(app);
    app.use(import_vue2.ErrorPlugin, {
      captureWarnings: true,
      logToConsole: true
    });
    app.use(import_vue2.ValidationPlugin);
    app.use(import_vue2.TestPlugin);
    app.use(import_vue2.TranslationPlugin);
    app.mount(selector);
  }

  // virtual-entry:./packages/vue/src/components/FSortFilterDataset/examples/FSortFilterDatasetListExample.vue
  var import_vue3 = __require("vue");
  var import_vue4 = __require("@fkui/vue");

  // packages/vue/src/components/FSortFilterDataset/examples/fruit-data.ts
  var fruits = [
    {
      id: "1",
      name: "\xC4pple",
      origin: "Sverige",
      description: "Rund, ofta r\xF6d eller gr\xF6n frukt med s\xF6t eller syrlig smak."
    },
    {
      id: "2",
      name: "Banan",
      origin: "Colombia",
      description: "L\xE5ng, gul frukt med mjukt och s\xF6tt fruktk\xF6tt."
    },
    {
      id: "3",
      name: "Vattenmelon",
      origin: "Spanien",
      description: "Stor, rund frukt med gr\xF6nt skal och saftigt, r\xF6tt fruktk\xF6tt."
    },
    {
      id: "4",
      name: "Grapefrukt",
      origin: "Turkiet",
      description: "Stor, rund citrusfrukt med tjockt skal och saftig, syrlig smak."
    }
  ];

  // virtual-entry:./packages/vue/src/components/FSortFilterDataset/examples/FSortFilterDatasetListExample.vue
  var import_vue5 = __require("vue");
  var exampleComponent = (0, import_vue3.defineComponent)({
    components: { FSortFilterDataset: import_vue4.FSortFilterDataset, FList: import_vue4.FList },
    data() {
      return {
        sortableAttributes: {
          name: "Namn",
          origin: "Land"
        },
        fruits
      };
    }
  });
  var _hoisted_1 = /* @__PURE__ */ (0, import_vue5.createElementVNode)(
    "br",
    null,
    null,
    -1
    /* HOISTED */
  );
  var _hoisted_2 = /* @__PURE__ */ (0, import_vue5.createElementVNode)(
    "br",
    null,
    null,
    -1
    /* HOISTED */
  );
  function render(_ctx, _cache) {
    const _component_f_list = (0, import_vue5.resolveComponent)("f-list");
    const _component_f_sort_filter_dataset = (0, import_vue5.resolveComponent)("f-sort-filter-dataset");
    return (0, import_vue5.openBlock)(), (0, import_vue5.createBlock)(_component_f_sort_filter_dataset, {
      data: _ctx.fruits,
      "sortable-attributes": _ctx.sortableAttributes
    }, {
      header: (0, import_vue5.withCtx)(({ slotClass }) => [
        (0, import_vue5.createElementVNode)(
          "h3",
          {
            class: (0, import_vue5.normalizeClass)(slotClass)
          },
          "Frukter",
          2
          /* CLASS */
        )
      ]),
      default: (0, import_vue5.withCtx)(({ sortFilterResult }) => [
        (0, import_vue5.createVNode)(_component_f_list, {
          "key-attribute": "id",
          items: sortFilterResult
        }, {
          default: (0, import_vue5.withCtx)(({ item }) => [
            (0, import_vue5.createElementVNode)(
              "h3",
              null,
              (0, import_vue5.toDisplayString)(item.name),
              1
              /* TEXT */
            ),
            (0, import_vue5.createTextVNode)(),
            (0, import_vue5.createElementVNode)("p", null, [
              (0, import_vue5.createTextVNode)("\n                        Land:\n                        "),
              (0, import_vue5.createElementVNode)(
                "em",
                null,
                (0, import_vue5.toDisplayString)(item.origin),
                1
                /* TEXT */
              ),
              (0, import_vue5.createTextVNode)(),
              _hoisted_1,
              (0, import_vue5.createTextVNode)("\n                        Beskrivning:\n                        "),
              (0, import_vue5.createElementVNode)(
                "em",
                null,
                (0, import_vue5.toDisplayString)(item.description),
                1
                /* TEXT */
              ),
              (0, import_vue5.createTextVNode)(),
              _hoisted_2
            ])
          ]),
          screenreader: (0, import_vue5.withCtx)(({ item }) => [
            (0, import_vue5.createTextVNode)(
              (0, import_vue5.toDisplayString)(item.name),
              1
              /* TEXT */
            )
          ]),
          _: 2
          /* DYNAMIC */
        }, 1032, ["items"])
      ]),
      _: 1
      /* STABLE */
    }, 8, ["data", "sortable-attributes"]);
  }
  exampleComponent.render = render;
  setup({
    rootComponent: exampleComponent,
    selector: "#FSortFilterDatasetListExample"
  });
})();