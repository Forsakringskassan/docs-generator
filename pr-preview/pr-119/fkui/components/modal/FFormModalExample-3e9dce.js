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

// virtual-entry:./packages/vue/src/components/FModal/examples/FFormModalExample.vue
import { defineComponent } from "vue";
import { FFormModal, FTextField } from "@fkui/vue";
import { createTextVNode as _createTextVNode, createElementVNode as _createElementVNode, resolveComponent as _resolveComponent, resolveDirective as _resolveDirective, withCtx as _withCtx, openBlock as _openBlock, createBlock as _createBlock, withDirectives as _withDirectives, createVNode as _createVNode, Fragment as _Fragment, createElementBlock as _createElementBlock } from "vue";
var exampleComponent = defineComponent({
  name: "FFormModalExample",
  components: { FFormModal, FTextField },
  data() {
    return {
      isOpen: false
    };
  },
  methods: {
    closeModal() {
      this.isOpen = false;
    }
  }
});
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_f_text_field = _resolveComponent("f-text-field");
  const _component_f_form_modal = _resolveComponent("f-form-modal");
  const _directive_validation = _resolveDirective("validation");
  return _openBlock(), _createElementBlock(
    _Fragment,
    null,
    [
      _createVNode(_component_f_form_modal, {
        "is-open": _ctx.isOpen,
        onCancel: _cache[0] || (_cache[0] = ($event) => _ctx.closeModal()),
        onClose: _cache[1] || (_cache[1] = ($event) => _ctx.closeModal()),
        onSubmit: _cache[2] || (_cache[2] = ($event) => _ctx.closeModal())
      }, {
        header: _withCtx(() => _cache[4] || (_cache[4] = [
          _createTextVNode(" Rubrik ")
        ])),
        default: _withCtx(() => _cache[5] || (_cache[5] = [
          _createElementVNode(
            "p",
            null,
            "Ingress",
            -1
            /* HOISTED */
          )
        ])),
        "input-text-fields": _withCtx(() => [
          _withDirectives((_openBlock(), _createBlock(_component_f_text_field, null, {
            default: _withCtx(() => _cache[6] || (_cache[6] = [
              _createTextVNode(" Etikett ")
            ])),
            _: 1
            /* STABLE */
          })), [
            [
              _directive_validation,
              {
                maxLength: { length: 32 }
              },
              void 0,
              {
                required: true,
                maxLength: true
              }
            ]
          ])
        ]),
        _: 1
        /* STABLE */
      }, 8, ["is-open"]),
      _createElementVNode("button", {
        type: "button",
        class: "button button--secondary",
        onClick: _cache[3] || (_cache[3] = ($event) => _ctx.isOpen = true)
      }, " \xD6ppna modal ")
    ],
    64
    /* STABLE_FRAGMENT */
  );
}
exampleComponent.render = render;
setup({
  rootComponent: exampleComponent,
  selector: "#FFormModalExample"
});
export {
  render
};
