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

// virtual-entry:./packages/vue/src/components/FIcon/examples/FIconLibrary.vue
import { defineComponent } from "vue";
import { FIcon } from "@fkui/vue";
import { resolveComponent as _resolveComponent, openBlock as _openBlock, createBlock as _createBlock } from "vue";
var exampleComponent = defineComponent({
  name: "FIconLibrary",
  components: { FIcon }
});
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_f_icon = _resolveComponent("f-icon");
  return _openBlock(), _createBlock(_component_f_icon, {
    name: "bell",
    library: "f"
  });
}
exampleComponent.render = render;
setup({
  rootComponent: exampleComponent,
  selector: "#FIconLibrary"
});
export {
  render
};