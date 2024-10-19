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

// virtual-entry:./packages/vue/src/components/FModal/examples/FConfirmModalExample.vue
import { defineComponent } from "vue";
import { FConfirmModal } from "@fkui/vue";
import { createElementVNode as _createElementVNode, toDisplayString as _toDisplayString, openBlock as _openBlock, createElementBlock as _createElementBlock, createCommentVNode as _createCommentVNode, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, withCtx as _withCtx, createVNode as _createVNode } from "vue";
var exampleComponent = defineComponent({
  name: "FConfirmModalExample",
  components: { FConfirmModal },
  inheritAttrs: true,
  data() {
    return {
      action: "",
      result: "",
      isOpen: false,
      buttons: [
        { label: "Ja, g\xF6r detta", event: "confirm", type: "primary" },
        { label: "Nej, g\xF6r inte detta", event: "dismiss", type: "secondary" }
      ]
    };
  },
  methods: {
    onClick() {
      this.isOpen = true;
      this.result = "";
    },
    confirm() {
      this.result = "bekr\xE4ftade";
      this.isOpen = false;
    },
    dismiss() {
      this.result = "avb\xF6jde";
      this.isOpen = false;
    },
    close(reason) {
      this.action = reason;
      this.isOpen = false;
    }
  }
});
var _hoisted_1 = { class: "f-confirm-modal" };
var _hoisted_2 = { key: 0 };
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_f_confirm_modal = _resolveComponent("f-confirm-modal");
  return _openBlock(), _createElementBlock("div", _hoisted_1, [
    _createElementVNode("button", {
      type: "button",
      class: "button button--secondary",
      onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onClick && _ctx.onClick(...args))
    }, "\xD6ppna Modal"),
    _ctx.result ? (_openBlock(), _createElementBlock(
      "pre",
      _hoisted_2,
      " Resultat: " + _toDisplayString(_ctx.result) + " ",
      1
      /* TEXT */
    )) : _createCommentVNode("v-if", true),
    _createElementVNode("div", null, [
      _createVNode(_component_f_confirm_modal, {
        "is-open": _ctx.isOpen,
        buttons: _ctx.buttons,
        onConfirm: _ctx.confirm,
        onDismiss: _ctx.dismiss,
        onClose: _ctx.close
      }, {
        heading: _withCtx(() => [
          _createTextVNode(" Tr\xE4utensilierna ")
        ]),
        content: _withCtx(() => [
          _createTextVNode(" Tr\xE4utensilierna i ett tryckeri \xE4ro ingalunda en oviktig faktor, f\xF6r trevnadens, ordningens och ekonomiens uppr\xE4tth\xE5llande, och dock \xE4r det icke s\xE4llan som sorgliga erfarenheter g\xF6ras p\xE5 grund af det of\xF6rst\xE5nd med hvilket kaster, formbr\xE4den och regaler tillverkas och f\xF6rs\xE4ljas Kaster som \xE4ro d\xE5ligt hopkomna och af otillr\xE4ckligt. ")
        ]),
        _: 1
        /* STABLE */
      }, 8, ["is-open", "buttons", "onConfirm", "onDismiss", "onClose"])
    ])
  ]);
}
exampleComponent.render = render;
setup({
  rootComponent: exampleComponent,
  selector: "#FConfirmModalExample"
});
export {
  render
};
