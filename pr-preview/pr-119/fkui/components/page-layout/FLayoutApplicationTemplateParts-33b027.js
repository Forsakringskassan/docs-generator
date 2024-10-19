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

// virtual-entry:./docs/components/page-layout/examples/FLayoutApplicationTemplateParts.vue
import { defineComponent } from "vue";
import { FLayoutApplicationTemplate } from "@fkui/vue";
import { createElementVNode as _createElementVNode, resolveComponent as _resolveComponent, withCtx as _withCtx, openBlock as _openBlock, createBlock as _createBlock } from "vue";
var exampleComponent = defineComponent({
  name: "FLayoutApplicationTemplateExample",
  components: { FLayoutApplicationTemplate }
});
var _hoisted_1 = /* @__PURE__ */ _createElementVNode(
  "div",
  { class: "example-header" },
  "[sidhuvud]",
  -1
  /* HOISTED */
);
var _hoisted_2 = /* @__PURE__ */ _createElementVNode(
  "div",
  { class: "example-topnav" },
  "[toppnavigering]",
  -1
  /* HOISTED */
);
var _hoisted_3 = /* @__PURE__ */ _createElementVNode(
  "div",
  { class: "example-content" },
  "[prim\xE4ryta]",
  -1
  /* HOISTED */
);
var _hoisted_4 = /* @__PURE__ */ _createElementVNode(
  "div",
  { class: "example-footer" },
  "[sidfot]",
  -1
  /* HOISTED */
);
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_f_layout_application_template = _resolveComponent("f-layout-application-template");
  return _openBlock(), _createBlock(_component_f_layout_application_template, null, {
    header: _withCtx(() => [
      _hoisted_1
    ]),
    "top-navigation": _withCtx(() => [
      _hoisted_2
    ]),
    footer: _withCtx(() => [
      _hoisted_4
    ]),
    default: _withCtx(() => [
      _hoisted_3
    ]),
    _: 1
    /* STABLE */
  });
}
exampleComponent.render = render;
setup({
  rootComponent: exampleComponent,
  selector: "#FLayoutApplicationTemplateParts"
});
export {
  render
};
