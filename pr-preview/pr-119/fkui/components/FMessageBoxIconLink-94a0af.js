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

// virtual-entry:./packages/vue/src/components/FMessageBox/examples/FMessageBoxIconLink.vue
import { defineComponent } from "vue";
import { FMessageBox, FIcon } from "@fkui/vue";
import { normalizeClass as _normalizeClass, createElementVNode as _createElementVNode, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, createVNode as _createVNode, withCtx as _withCtx, openBlock as _openBlock, createBlock as _createBlock } from "vue";
var exampleComponent = defineComponent({
  name: "FMessageBoxIconLink",
  components: { FMessageBox, FIcon }
});
var _hoisted_1 = /* @__PURE__ */ _createElementVNode(
  "a",
  {
    class: "anchor",
    href: "javascript:",
    target: "_blank"
  },
  [
    /* @__PURE__ */ _createTextVNode(" L\xE4nk "),
    /* @__PURE__ */ _createElementVNode("span", { class: "sr-only" }, " \xF6ppnas i nytt f\xF6nster ")
  ],
  -1
  /* HOISTED */
);
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_f_icon = _resolveComponent("f-icon");
  const _component_f_message_box = _resolveComponent("f-message-box");
  return _openBlock(), _createBlock(_component_f_message_box, { type: "info" }, {
    default: _withCtx(({ headingSlotClass }) => [
      _createElementVNode(
        "h2",
        {
          class: _normalizeClass(headingSlotClass)
        },
        "Meddelanderuta med l\xE4nk och ikon i meddelande",
        2
        /* CLASS */
      ),
      _createElementVNode("p", null, [
        _hoisted_1,
        _createVNode(_component_f_icon, { name: "new-window" })
      ])
    ]),
    _: 1
    /* STABLE */
  });
}
exampleComponent.render = render;
setup({
  rootComponent: exampleComponent,
  selector: "#FMessageBoxIconLink"
});
export {
  render
};