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

// virtual-entry:./packages/vue/src/components/FPageHeader/examples/FPageHeaderDefault.vue
import { defineComponent } from "vue";
import { FPageHeader } from "@fkui/vue";
import { createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, withCtx as _withCtx, openBlock as _openBlock, createBlock as _createBlock } from "vue";
var exampleComponent = defineComponent({
  name: "FPageHeaderDefault",
  components: { FPageHeader }
});
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_f_page_header = _resolveComponent("f-page-header");
  return _openBlock(), _createBlock(_component_f_page_header, null, {
    right: _withCtx(() => [
      _createTextVNode(" Namn Namnsson ")
    ]),
    default: _withCtx(() => [
      _createTextVNode(" Exempelapplikation ")
    ]),
    _: 1
    /* STABLE */
  });
}
exampleComponent.render = render;
setup({
  rootComponent: exampleComponent,
  selector: "#FPageHeaderDefault"
});
export {
  render
};