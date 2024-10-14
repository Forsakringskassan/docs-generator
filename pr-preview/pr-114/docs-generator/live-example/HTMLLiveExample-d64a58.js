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
  function setup(options) {
    const { rootComponent, selector } = options;
    const app = (0, import_vue.createApp)({
      render() {
        return (0, import_vue.h)(rootComponent);
      }
    });
    app.mount(selector);
  }

  // virtual-entry:./docs/live-example/HTMLLiveExample.vue
  var import_vue2 = __require("vue");
  var import_docs_live_example = __require("@forsakringskassan/docs-live-example");
  var import_vue3 = __require("vue");
  var exampleComponent = (0, import_vue2.defineComponent)({
    name: "HTMLLiveExample",
    components: { LiveExample: import_docs_live_example.LiveExample },
    data() {
      return {
        name: "World"
      };
    },
    computed: {
      template() {
        return (
          /* HTML */
          ` <div>Hello ${this.name}!</div> `
        );
      }
    }
  });
  function render(_ctx, _cache) {
    const _component_live_example = (0, import_vue3.resolveComponent)("live-example");
    return (0, import_vue3.openBlock)(), (0, import_vue3.createBlock)(_component_live_example, {
      language: "html",
      template: _ctx.template
    }, {
      default: (0, import_vue3.withCtx)(() => [
        _cache[2] || (_cache[2] = (0, import_vue3.createElementVNode)(
          "label",
          {
            class: "docs-block",
            for: "html-name"
          },
          " Name ",
          -1
          /* HOISTED */
        )),
        _cache[3] || (_cache[3] = (0, import_vue3.createTextVNode)()),
        (0, import_vue3.withDirectives)((0, import_vue3.createElementVNode)(
          "select",
          {
            id: "html-name",
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.name = $event),
            class: "docs-block",
            name: "html-name"
          },
          _cache[1] || (_cache[1] = [
            (0, import_vue3.createElementVNode)(
              "option",
              { value: "World" },
              "World",
              -1
              /* HOISTED */
            ),
            (0, import_vue3.createTextVNode)(),
            (0, import_vue3.createElementVNode)(
              "option",
              { value: "Kalle Anka" },
              "Kalle Anka",
              -1
              /* HOISTED */
            ),
            (0, import_vue3.createTextVNode)(),
            (0, import_vue3.createElementVNode)(
              "option",
              { value: "Fred Flintstone" },
              "Fred Flintstone",
              -1
              /* HOISTED */
            )
          ]),
          512
          /* NEED_PATCH */
        ), [
          [import_vue3.vModelSelect, _ctx.name]
        ])
      ]),
      _: 1
      /* STABLE */
    }, 8, ["template"]);
  }
  exampleComponent.render = render;
  setup({
    rootComponent: exampleComponent,
    selector: "#HTMLLiveExample"
  });
})();
