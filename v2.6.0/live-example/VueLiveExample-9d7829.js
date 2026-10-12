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

  // virtual-entry:./docs/live-example/VueLiveExample.vue
  var import_vue2 = __require("vue");
  var import_docs_live_example = __require("@forsakringskassan/docs-live-example");
  var import_vue3 = __require("vue");
  var exampleComponent = (0, import_vue2.defineComponent)({
    name: "VueLiveExample",
    components: { LiveExample: import_docs_live_example.LiveExample },
    data() {
      return {
        name: "predefined"
      };
    },
    computed: {
      livedata() {
        const useCustomName = this.name === "custom";
        return {
          name: "World",
          useCustomName
        };
      },
      template() {
        return (
          /* HTML */
          `
                <p>Hello {{ name }}!</p>
                <template v-if="useCustomName">
                    <label>Name: <input type="text" v-model="name" /></label>
                </template>
            `
        );
      }
    }
  });
  function render(_ctx, _cache) {
    const _component_live_example = (0, import_vue3.resolveComponent)("live-example");
    return (0, import_vue3.openBlock)(), (0, import_vue3.createBlock)(_component_live_example, {
      language: "vue",
      template: _ctx.template,
      livedata: _ctx.livedata
    }, {
      default: (0, import_vue3.withCtx)(() => [
        _cache[2] || (_cache[2] = (0, import_vue3.createElementVNode)(
          "label",
          {
            class: "docs-block",
            for: "vue-name"
          },
          " Name ",
          -1
          /* HOISTED */
        )),
        _cache[3] || (_cache[3] = (0, import_vue3.createTextVNode)()),
        (0, import_vue3.withDirectives)((0, import_vue3.createElementVNode)(
          "select",
          {
            id: "vue-name",
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.name = $event),
            class: "docs-block",
            name: "vue-name"
          },
          _cache[1] || (_cache[1] = [
            (0, import_vue3.createElementVNode)(
              "option",
              { value: "predefined" },
              "Predefined",
              -1
              /* HOISTED */
            ),
            (0, import_vue3.createTextVNode)(),
            (0, import_vue3.createElementVNode)(
              "option",
              { value: "custom" },
              "Custom",
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
    }, 8, ["template", "livedata"]);
  }
  exampleComponent.render = render;
  setup({
    rootComponent: exampleComponent,
    selector: "#VueLiveExample"
  });
})();
