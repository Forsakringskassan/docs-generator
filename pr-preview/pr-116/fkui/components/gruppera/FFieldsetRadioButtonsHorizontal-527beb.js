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

  // virtual-entry:./packages/vue/src/components/FFieldset/examples/FFieldsetRadioButtonsHorizontal.vue
  var import_vue3 = __require("vue");
  var import_vue4 = __require("@fkui/vue");
  var import_vue5 = __require("vue");
  var exampleComponent = (0, import_vue3.defineComponent)({
    name: "FFieldsetRadioButtons",
    components: { FFieldset: import_vue4.FFieldset, FRadioField: import_vue4.FRadioField },
    data() {
      return {
        model: void 0
      };
    }
  });
  function render(_ctx, _cache) {
    const _component_f_radio_field = (0, import_vue5.resolveComponent)("f-radio-field");
    const _component_f_fieldset = (0, import_vue5.resolveComponent)("f-fieldset");
    return (0, import_vue5.openBlock)(), (0, import_vue5.createBlock)(_component_f_fieldset, {
      name: "group-name-radio-horizontal",
      horizontal: ""
    }, {
      label: (0, import_vue5.withCtx)(() => [
        (0, import_vue5.createTextVNode)(" Ligger radioknapparna horisontellt? ")
      ]),
      default: (0, import_vue5.withCtx)(() => [
        (0, import_vue5.createTextVNode)(),
        (0, import_vue5.createVNode)(_component_f_radio_field, {
          id: "horisontellt-ja",
          modelValue: _ctx.model,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.model = $event),
          value: true
        }, {
          default: (0, import_vue5.withCtx)(() => [
            (0, import_vue5.createTextVNode)(" Ja ")
          ]),
          _: 1
          /* STABLE */
        }, 8, ["modelValue"]),
        (0, import_vue5.createTextVNode)(),
        (0, import_vue5.createVNode)(_component_f_radio_field, {
          id: "horisontellt-nej",
          modelValue: _ctx.model,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => _ctx.model = $event),
          value: false
        }, {
          default: (0, import_vue5.withCtx)(() => [
            (0, import_vue5.createTextVNode)(" Nej ")
          ]),
          _: 1
          /* STABLE */
        }, 8, ["modelValue"])
      ]),
      _: 1
      /* STABLE */
    });
  }
  exampleComponent.render = render;
  setup({
    rootComponent: exampleComponent,
    selector: "#FFieldsetRadioButtonsHorizontal"
  });
})();