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

// virtual-entry:./packages/vue/src/components/FLabel/examples/FLabelLiveExample.vue
import { defineComponent } from "vue";
import { FLabel, FFieldset, FCheckboxField, FTooltip } from "@fkui/vue";
import { LiveExample } from "@forsakringskassan/docs-live-example";
import { createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, withCtx as _withCtx, createVNode as _createVNode, openBlock as _openBlock, createBlock as _createBlock } from "vue";
var exampleComponent = defineComponent({
  name: "FTextFieldLiveExample",
  components: { LiveExample, FFieldset, FCheckboxField },
  data() {
    return {
      tooltipVisible: false,
      descriptionVisible: false,
      discreteDescriptionVisible: false,
      errorMessageVisible: false
    };
  },
  computed: {
    livedata() {
      return { model: "" };
    },
    components() {
      return {
        FLabel,
        FTooltip
      };
    },
    description() {
      const description = this.descriptionVisible ? `<span :class="descriptionClass">Hj\xE4lptext</span>` : "";
      const discreteDescription = this.discreteDescriptionVisible ? `<span :class="discreteDescriptionClass">Formatbeskrivning</span>` : "";
      const template = (
        /* HTML */
        `
                <template #description="{ descriptionClass, discreteDescriptionClass }">
                    ${description} ${discreteDescription}
                </template>
            `
      );
      return this.descriptionVisible || this.discreteDescriptionVisible ? template : "";
    },
    tooltip() {
      const template = (
        /* HTML */
        `
                <template #tooltip>
                    <f-tooltip screen-reader-text="L\xE4s mer h\xE4r">
                        <template #header> Header </template>
                        <template #body> Body </template>
                    </f-tooltip>
                </template>
            `
      );
      return this.tooltipVisible ? template : "";
    },
    errorMessage() {
      const template = (
        /* HTML */
        ` <template #error-message> Felmeddelande </template> `
      );
      return this.errorMessageVisible ? template : "";
    },
    template() {
      return (
        /* HTML */
        `
                <f-label for="input-field">
                    Etikett ${this.description} ${this.tooltip} ${this.errorMessage}
                </f-label>
                <input id="input-field" type="text" class="text-field__input" />
            `
      );
    }
  },
  methods: {}
});
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_f_checkbox_field = _resolveComponent("f-checkbox-field");
  const _component_f_fieldset = _resolveComponent("f-fieldset");
  const _component_live_example = _resolveComponent("live-example");
  return _openBlock(), _createBlock(_component_live_example, {
    components: _ctx.components,
    template: _ctx.template,
    livedata: _ctx.livedata
  }, {
    default: _withCtx(() => [
      _createVNode(_component_f_fieldset, { name: "etikett" }, {
        label: _withCtx(() => [
          _createTextVNode(" Egenskaper ")
        ]),
        default: _withCtx(() => [
          _createVNode(_component_f_checkbox_field, {
            modelValue: _ctx.descriptionVisible,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.descriptionVisible = $event),
            value: true
          }, {
            default: _withCtx(() => [
              _createTextVNode(" Hj\xE4lptext ")
            ]),
            _: 1
            /* STABLE */
          }, 8, ["modelValue"]),
          _createVNode(_component_f_checkbox_field, {
            modelValue: _ctx.discreteDescriptionVisible,
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => _ctx.discreteDescriptionVisible = $event),
            value: true
          }, {
            default: _withCtx(() => [
              _createTextVNode(" Formatbeskrivning ")
            ]),
            _: 1
            /* STABLE */
          }, 8, ["modelValue"]),
          _createVNode(_component_f_checkbox_field, {
            modelValue: _ctx.tooltipVisible,
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => _ctx.tooltipVisible = $event),
            value: true
          }, {
            default: _withCtx(() => [
              _createTextVNode(" Tooltip ")
            ]),
            _: 1
            /* STABLE */
          }, 8, ["modelValue"]),
          _createVNode(_component_f_checkbox_field, {
            modelValue: _ctx.errorMessageVisible,
            "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => _ctx.errorMessageVisible = $event),
            value: true
          }, {
            default: _withCtx(() => [
              _createTextVNode(" Felmeddelande ")
            ]),
            _: 1
            /* STABLE */
          }, 8, ["modelValue"])
        ]),
        _: 1
        /* STABLE */
      })
    ]),
    _: 1
    /* STABLE */
  }, 8, ["components", "template", "livedata"]);
}
exampleComponent.render = render;
setup({
  rootComponent: exampleComponent,
  selector: "#FLabelLiveExample"
});
export {
  render
};