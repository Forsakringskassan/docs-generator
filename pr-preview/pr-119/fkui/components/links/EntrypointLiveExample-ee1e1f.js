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

// virtual-entry:./packages/vue/src/design-component-tests/entrypoint/examples/EntrypointLiveExample.vue
import { defineComponent } from "vue";
import { FCheckboxField, FIcon } from "@fkui/vue";
import { LiveExample } from "@forsakringskassan/docs-live-example";
import { createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, withCtx as _withCtx, createVNode as _createVNode, openBlock as _openBlock, createBlock as _createBlock } from "vue";
var exampleComponent = defineComponent({
  name: "EntrypointLiveExample",
  components: { LiveExample, FCheckboxField },
  data() {
    return {
      isFullWidth: false
    };
  },
  computed: {
    components() {
      return { FIcon };
    },
    fullwidth() {
      return this.isFullWidth ? "entrypoint--full-width" : "";
    },
    template() {
      return (
        /* HTML */
        `
                <a class="entrypoint ${this.fullwidth}" href="javascript:">
                    Ans\xF6k om hundbidrag
                    <span class="sr-only"> Till tj\xE4nsten ans\xF6k om hundbidrag</span>
                    <f-icon name="arrow-right" class="entrypoint__icon"></f-icon>
                </a>
            `
      );
    }
  }
});
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_f_checkbox_field = _resolveComponent("f-checkbox-field");
  const _component_live_example = _resolveComponent("live-example");
  return _openBlock(), _createBlock(_component_live_example, {
    components: _ctx.components,
    template: _ctx.template
  }, {
    default: _withCtx(() => [
      _createVNode(_component_f_checkbox_field, {
        modelValue: _ctx.isFullWidth,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.isFullWidth = $event),
        value: true
      }, {
        default: _withCtx(() => _cache[1] || (_cache[1] = [
          _createTextVNode(" Fullbredd ")
        ])),
        _: 1
        /* STABLE */
      }, 8, ["modelValue"])
    ]),
    _: 1
    /* STABLE */
  }, 8, ["components", "template"]);
}
exampleComponent.render = render;
setup({
  rootComponent: exampleComponent,
  selector: "#EntrypointLiveExample"
});
export {
  render
};
