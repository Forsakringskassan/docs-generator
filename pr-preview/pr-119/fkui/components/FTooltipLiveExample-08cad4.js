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

// virtual-entry:./packages/vue/src/components/FTooltip/examples/FTooltipLiveExample.vue
import { defineComponent } from "vue";
import { FTooltip, FCheckboxField } from "@fkui/vue";
import { LiveExample } from "@forsakringskassan/docs-live-example";
import { createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, withCtx as _withCtx, createVNode as _createVNode, openBlock as _openBlock, createBlock as _createBlock } from "vue";
var exampleComponent = defineComponent({
  name: "FTooltipLiveExample",
  components: { LiveExample, FCheckboxField },
  data() {
    return {
      hasHeader: false
    };
  },
  computed: {
    components() {
      return {
        FTooltip
      };
    },
    header() {
      return this.hasHeader ? "<template #header> L\xE4r dig mer om [..] </template>" : "";
    },
    template() {
      return (
        /* HTML */
        `
                <div class="tooltip-before">
                    <label class="label tooltip-before__label"> Etikett </label>
                </div>
                <f-tooltip screen-reader-text="Denna text syns bara f\xF6r sk\xE4rml\xE4sare">
                    ${this.header}
                    <template #body> Lorem ipsum dolor sit amet. </template>
                </f-tooltip>
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
        modelValue: _ctx.hasHeader,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.hasHeader = $event),
        value: true
      }, {
        default: _withCtx(() => [
          _createTextVNode(" Rubrik i tooltip")
        ]),
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
  selector: "#FTooltipLiveExample"
});
export {
  render
};
