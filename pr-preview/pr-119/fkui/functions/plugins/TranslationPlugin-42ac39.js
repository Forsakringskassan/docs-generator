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

// virtual-entry:./docs/functions/plugins/TranslationPlugin.md
import { defineComponent } from "vue";
import { TranslationMixin } from "@fkui/vue";
import { toDisplayString as _toDisplayString, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue";
var exampleComponent = defineComponent({
  mixins: [TranslationMixin]
});
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return _openBlock(), _createElementBlock(
    "p",
    null,
    _toDisplayString(_ctx.$t("fkui.example.key", "Standardtext")),
    1
    /* TEXT */
  );
}
exampleComponent.render = render;
setup({
  rootComponent: exampleComponent,
  selector: "#TranslationPlugin"
});
export {
  render
};