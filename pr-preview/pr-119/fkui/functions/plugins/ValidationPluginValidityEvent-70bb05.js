// docs/src/setup.ts
import { createApp, h } from "vue";
import {
  ErrorPlugin,
  FErrorHandlingApp,
  TestPlugin,
  TranslationPlugin,
  ValidationPlugin,
  setRunningContext
} from "@fkui/vue";
function setup(options) {
  const { rootComponent, selector } = options;
  const app = createApp({
    render() {
      return h(FErrorHandlingApp, { defaultComponent: rootComponent });
    }
  });
  setRunningContext(app);
  app.use(ErrorPlugin, {
    captureWarnings: true,
    logToConsole: true
  });
  app.use(ValidationPlugin);
  app.use(TestPlugin);
  app.use(TranslationPlugin);
  app.mount(selector);
}

// virtual-entry:./packages/vue/src/plugins/validation/examples/ValidationPluginValidityEvent.vue
import { defineComponent } from "vue";
import { FTextField } from "@fkui/vue";
import { createElementVNode as _createElementVNode, toDisplayString as _toDisplayString, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, resolveDirective as _resolveDirective, withCtx as _withCtx, openBlock as _openBlock, createBlock as _createBlock, withDirectives as _withDirectives, createElementBlock as _createElementBlock } from "vue";
var exampleComponent = defineComponent({
  name: "ValidationPluginValidityEvent",
  components: { FTextField },
  data() {
    return { validityEvent: "", nameModel: "" };
  }
});
var _hoisted_1 = /* @__PURE__ */ _createElementVNode(
  "strong",
  null,
  "ValidityEvent",
  -1
  /* HOISTED */
);
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_f_text_field = _resolveComponent("f-text-field");
  const _directive_validation = _resolveDirective("validation");
  return _openBlock(), _createElementBlock("div", null, [
    _hoisted_1,
    _createElementVNode(
      "pre",
      null,
      _toDisplayString(_ctx.validityEvent),
      1
      /* TEXT */
    ),
    _withDirectives((_openBlock(), _createBlock(_component_f_text_field, {
      id: "name-of-child",
      modelValue: _ctx.nameModel,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.nameModel = $event),
      onValidity: _cache[1] || (_cache[1] = ($event) => _ctx.validityEvent = $event.detail)
    }, {
      default: _withCtx(() => [
        _createTextVNode(" Name of child ")
      ]),
      _: 1
      /* STABLE */
    }, 8, ["modelValue"])), [
      [
        _directive_validation,
        {
          maxLength: { length: 10 },
          minLength: { length: 2 }
        },
        void 0,
        {
          required: true,
          maxLength: true,
          minLength: true
        }
      ]
    ])
  ]);
}
exampleComponent.render = render;
setup({
  rootComponent: exampleComponent,
  selector: "#ValidationPluginValidityEvent"
});
export {
  render
};