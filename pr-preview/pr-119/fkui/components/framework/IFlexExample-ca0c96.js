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

// virtual-entry:./packages/vue/src/internal-components/IFlex/examples/IFlexExample.vue
import { defineComponent } from "vue";
import { IFlex, IFlexItem, FIcon } from "@fkui/vue";
import { resolveComponent as _resolveComponent, createVNode as _createVNode, withCtx as _withCtx, createElementVNode as _createElementVNode, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue";
var exampleComponent = defineComponent({
  name: "IFlexExample",
  components: { FIcon, IFlex, IFlexItem }
});
var _hoisted_1 = /* @__PURE__ */ _createElementVNode(
  "h2",
  null,
  "Rubrik med ikon",
  -1
  /* HOISTED */
);
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_f_icon = _resolveComponent("f-icon");
  const _component_i_flex_item = _resolveComponent("i-flex-item");
  const _component_i_flex = _resolveComponent("i-flex");
  return _openBlock(), _createElementBlock("div", null, [
    _createVNode(_component_i_flex, { gap: "1x" }, {
      default: _withCtx(() => [
        _createVNode(_component_i_flex_item, {
          shrink: "",
          align: "center"
        }, {
          default: _withCtx(() => [
            _createVNode(_component_f_icon, {
              name: "bell",
              library: "f"
            })
          ]),
          _: 1
          /* STABLE */
        }),
        _createVNode(_component_i_flex_item, { grow: "" }, {
          default: _withCtx(() => [
            _hoisted_1
          ]),
          _: 1
          /* STABLE */
        })
      ]),
      _: 1
      /* STABLE */
    })
  ]);
}
exampleComponent.render = render;
setup({
  rootComponent: exampleComponent,
  selector: "#IFlexExample"
});
export {
  render
};