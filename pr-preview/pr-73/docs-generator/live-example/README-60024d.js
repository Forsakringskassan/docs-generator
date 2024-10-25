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

  // virtual-entry:./node_modules/@forsakringskassan/docs-live-example/README.md
  var import_vue2 = __require("vue");
  var import_docs_live_example = __require("@forsakringskassan/docs-live-example");
  var import_vue3 = __require("vue");
  var exampleComponent = (0, import_vue2.defineComponent)({
    name: "AwesomeComponentLiveExample",
    components: { LiveExample: import_docs_live_example.LiveExample },
    data() {
      return {
        tagName: "div",
        placeholderText: false
      };
    },
    computed: {
      template() {
        const { tagName, placeholderText } = this;
        const message = placeholderText ? "Lorem ipsum dolor sit amet" : "Hello World!";
        return (0, import_docs_live_example.createElement)(tagName, message);
      }
    }
  });
  function render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_live_example = (0, import_vue3.resolveComponent)("live-example");
    return (0, import_vue3.openBlock)(), (0, import_vue3.createBlock)(_component_live_example, { template: _ctx.template }, {
      default: (0, import_vue3.withCtx)(() => [
        (0, import_vue3.createElementVNode)("div", null, [
          _cache[3] || (_cache[3] = (0, import_vue3.createElementVNode)(
            "label",
            { for: "config-element" },
            " Element ",
            -1
            /* HOISTED */
          )),
          (0, import_vue3.withDirectives)((0, import_vue3.createElementVNode)(
            "select",
            {
              id: "config-element",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.tagName = $event)
            },
            _cache[2] || (_cache[2] = [
              (0, import_vue3.createElementVNode)(
                "option",
                { value: "div" },
                "div",
                -1
                /* HOISTED */
              ),
              (0, import_vue3.createElementVNode)(
                "option",
                { value: "p" },
                "p",
                -1
                /* HOISTED */
              ),
              (0, import_vue3.createElementVNode)(
                "option",
                { value: "em" },
                "em",
                -1
                /* HOISTED */
              )
            ]),
            512
            /* NEED_PATCH */
          ), [
            [import_vue3.vModelSelect, _ctx.tagName]
          ])
        ]),
        (0, import_vue3.createElementVNode)("div", null, [
          (0, import_vue3.createElementVNode)("label", null, [
            (0, import_vue3.withDirectives)((0, import_vue3.createElementVNode)(
              "input",
              {
                type: "checkbox",
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => _ctx.placeholderText = $event),
                value: true
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [import_vue3.vModelCheckbox, _ctx.placeholderText]
            ]),
            _cache[4] || (_cache[4] = (0, import_vue3.createTextVNode)(" Use placeholder text "))
          ])
        ])
      ]),
      _: 1
      /* STABLE */
    }, 8, ["template"]);
  }
  exampleComponent.render = render;
  setup({
    rootComponent: exampleComponent,
    selector: "#README"
  });
})();
