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

// virtual-entry:./packages/vue/src/components/FCard/examples/FCardExample.vue
import { defineComponent } from "vue";
import { FCard, FIcon } from "@fkui/vue";
import { normalizeClass as _normalizeClass, createElementVNode as _createElementVNode, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, createVNode as _createVNode, withCtx as _withCtx, openBlock as _openBlock, createBlock as _createBlock } from "vue";
var exampleComponent = defineComponent({
  name: "FCardExample",
  components: { FCard, FIcon }
});
var _hoisted_1 = /* @__PURE__ */ _createElementVNode(
  "p",
  null,
  "Arbetsgivare",
  -1
  /* HOISTED */
);
var _hoisted_2 = /* @__PURE__ */ _createElementVNode(
  "p",
  null,
  [
    /* @__PURE__ */ _createTextVNode(" Gatan 1 "),
    /* @__PURE__ */ _createElementVNode("br"),
    /* @__PURE__ */ _createTextVNode(" 123 45 Staden "),
    /* @__PURE__ */ _createElementVNode("br"),
    /* @__PURE__ */ _createTextVNode(" Sverige ")
  ],
  -1
  /* HOISTED */
);
var _hoisted_3 = /* @__PURE__ */ _createElementVNode(
  "p",
  null,
  [
    /* @__PURE__ */ _createElementVNode("label", { class: "label" }, " Telefonnummer "),
    /* @__PURE__ */ _createElementVNode("span", null, " 0109999999 ")
  ],
  -1
  /* HOISTED */
);
var _hoisted_4 = { class: "button-group" };
var _hoisted_5 = {
  class: "button button-group__item button--tertiary button--medium button--align-text",
  type: "button"
};
var _hoisted_6 = /* @__PURE__ */ _createElementVNode(
  "span",
  null,
  " Ta bort ",
  -1
  /* HOISTED */
);
var _hoisted_7 = {
  class: "button button-group__item button--tertiary button--medium button--align-text",
  type: "button"
};
var _hoisted_8 = /* @__PURE__ */ _createElementVNode(
  "span",
  null,
  " \xC4ndra ",
  -1
  /* HOISTED */
);
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_f_icon = _resolveComponent("f-icon");
  const _component_f_card = _resolveComponent("f-card");
  return _openBlock(), _createBlock(_component_f_card, null, {
    header: _withCtx(({ headingSlotClass }) => [
      _createElementVNode(
        "h3",
        {
          class: _normalizeClass(headingSlotClass)
        },
        "Arbete",
        2
        /* CLASS */
      )
    ]),
    default: _withCtx(() => [
      _hoisted_1,
      _hoisted_2,
      _hoisted_3
    ]),
    footer: _withCtx(() => [
      _createElementVNode("div", _hoisted_4, [
        _createElementVNode("button", _hoisted_5, [
          _createVNode(_component_f_icon, { name: "trashcan" }),
          _hoisted_6
        ]),
        _createElementVNode("button", _hoisted_7, [
          _createVNode(_component_f_icon, { name: "pen" }),
          _hoisted_8
        ])
      ])
    ]),
    _: 1
    /* STABLE */
  });
}
exampleComponent.render = render;
setup({
  rootComponent: exampleComponent,
  selector: "#FCardExample"
});
export {
  render
};
