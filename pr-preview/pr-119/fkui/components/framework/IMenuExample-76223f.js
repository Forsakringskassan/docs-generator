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

// virtual-entry:./packages/vue/src/internal-components/IMenu/examples/IMenuExample.vue
import { defineComponent } from "vue";
import { IMenu } from "@fkui/vue";
import { toDisplayString as _toDisplayString, createElementVNode as _createElementVNode, resolveComponent as _resolveComponent, createVNode as _createVNode, createTextVNode as _createTextVNode, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue";
var exampleComponent = defineComponent({
  namne: "IMenuExample",
  components: { IMenu },
  data() {
    return {
      items: [
        { label: "Det", key: "MENU_1", href: "/qwe" },
        { label: "var", key: "MENU_2" },
        { label: "en", key: "MENU_3" },
        { label: "finliten", key: "MENU_4" },
        { label: "meny", key: "MENU_5" },
        { label: "som \xE4r", key: "MENU_6" },
        { label: "r\xE4tt l\xE5ng", key: "MENU_7" },
        { label: "och inneh\xE5llet", key: "MENU_8" },
        { label: "kommer", key: "MENU_9" },
        { label: "wrappas", key: "MENU_10" },
        { label: "Med href", key: "MENU_HREF", href: "/" },
        {
          label: "Testar target",
          key: "MENU_EXTERN",
          href: "http://www.google.com",
          target: "_blank"
        },
        { label: "Ikon exempel", key: "MENU_MORE", iconRight: "arrow-down" }
      ],
      model: "",
      overflow: ""
    };
  }
});
var _hoisted_1 = /* @__PURE__ */ _createElementVNode(
  "h3",
  null,
  "Vertical",
  -1
  /* HOISTED */
);
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_i_menu = _resolveComponent("i-menu");
  return _openBlock(), _createElementBlock("div", null, [
    _createElementVNode(
      "pre",
      null,
      "Highlight: " + _toDisplayString(_ctx.model),
      1
      /* TEXT */
    ),
    _createVNode(_component_i_menu, {
      modelValue: _ctx.model,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.model = $event),
      items: _ctx.items,
      "enable-keyboard-navigation": true,
      onOverflow: _cache[1] || (_cache[1] = ($event) => _ctx.overflow = $event)
    }, null, 8, ["modelValue", "items"]),
    _createTextVNode(
      " Overflow: " + _toDisplayString(_ctx.overflow) + " ",
      1
      /* TEXT */
    ),
    _createElementVNode("button", {
      type: "button",
      onClick: _cache[2] || (_cache[2] = ($event) => _ctx.items = _ctx.items.slice(4))
    }, "Click cut"),
    _hoisted_1,
    _createVNode(_component_i_menu, {
      modelValue: _ctx.model,
      "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => _ctx.model = $event),
      items: _ctx.items,
      vertical: ""
    }, null, 8, ["modelValue", "items"])
  ]);
}
exampleComponent.render = render;
setup({
  rootComponent: exampleComponent,
  selector: "#IMenuExample"
});
export {
  render
};
