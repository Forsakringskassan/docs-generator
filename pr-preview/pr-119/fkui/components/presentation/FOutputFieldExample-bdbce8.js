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

// virtual-entry:./packages/vue/src/components/FOutputField/examples/FOutputFieldExample.vue
import { defineComponent } from "vue";
import { FOutputField, FTextField, FTooltip } from "@fkui/vue";
import { createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, resolveDirective as _resolveDirective, withCtx as _withCtx, openBlock as _openBlock, createBlock as _createBlock, withDirectives as _withDirectives, createVNode as _createVNode, toDisplayString as _toDisplayString, createElementBlock as _createElementBlock } from "vue";
var exampleComponent = defineComponent({
  name: "FOutputFieldExample",
  components: { FOutputField, FTextField, FTooltip },
  data() {
    return { number1: "1", number2: "2" };
  }
});
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_f_text_field = _resolveComponent("f-text-field");
  const _component_f_tooltip = _resolveComponent("f-tooltip");
  const _component_f_output_field = _resolveComponent("f-output-field");
  const _directive_validation = _resolveDirective("validation");
  return _openBlock(), _createElementBlock("div", null, [
    _withDirectives((_openBlock(), _createBlock(_component_f_text_field, {
      id: "one",
      modelValue: _ctx.number1,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.number1 = $event)
    }, {
      default: _withCtx(() => [
        _createTextVNode(" Nummer 1 ")
      ]),
      _: 1
      /* STABLE */
    }, 8, ["modelValue"])), [
      [
        _directive_validation,
        { maxLength: { length: 100 } },
        void 0,
        { maxLength: true }
      ]
    ]),
    _withDirectives((_openBlock(), _createBlock(_component_f_text_field, {
      id: "two",
      modelValue: _ctx.number2,
      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => _ctx.number2 = $event)
    }, {
      default: _withCtx(() => [
        _createTextVNode(" Nummer 2 ")
      ]),
      _: 1
      /* STABLE */
    }, 8, ["modelValue"])), [
      [
        _directive_validation,
        { maxLength: { length: 100 } },
        void 0,
        { maxLength: true }
      ]
    ]),
    _createVNode(_component_f_output_field, {
      id: "calculated",
      for: "one two"
    }, {
      label: _withCtx(() => [
        _createTextVNode(" Summa ")
      ]),
      tooltip: _withCtx(() => [
        _createVNode(_component_f_tooltip, { "screen-reader-text": "L\xE4s mer om avancerat f\xE4lt" }, {
          header: _withCtx(() => [
            _createTextVNode(" Mer om summa-f\xE4ltet ")
          ]),
          body: _withCtx(() => [
            _createTextVNode(" Detta f\xE4ltet \xE4r en summa av nummer 1 och nummer 2. ")
          ]),
          _: 1
          /* STABLE */
        })
      ]),
      default: _withCtx(() => [
        _createTextVNode(
          " " + _toDisplayString(parseInt(_ctx.number1) + parseInt(_ctx.number2)),
          1
          /* TEXT */
        )
      ]),
      _: 1
      /* STABLE */
    })
  ]);
}
exampleComponent.render = render;
setup({
  rootComponent: exampleComponent,
  selector: "#FOutputFieldExample"
});
export {
  render
};