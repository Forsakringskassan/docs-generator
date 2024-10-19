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

// virtual-entry:./packages/vue/src/components/FModal/examples/FFormModalExampleCustomButtons.vue
import { defineComponent as defineComponent2 } from "vue";

// sfc-script:/home/runner/work/docs-generator/docs-generator/fkui/packages/vue/src/components/FModal/examples/ExampleModal.vue?type=script
import { defineComponent } from "vue";
import { FFormModal, FTextField } from "@fkui/vue";
var ExampleModal_default = defineComponent({
  name: "ExampleModal",
  components: { FFormModal, FTextField },
  props: {
    isOpen: {
      type: Boolean,
      default: false,
      required: false
    },
    size: {
      default: "",
      type: String
    },
    testId: {
      type: String,
      default: "",
      required: false
    },
    beforeSubmit: {
      type: Function,
      required: false,
      default: void 0
    },
    frukt: {
      type: String,
      required: false,
      default: ""
    },
    buttons: {
      type: Array,
      required: false,
      default() {
      }
    }
  },
  emits: ["cancel", "close", "submit"],
  data() {
    return {
      value: {
        field1: this.frukt,
        field2: ""
      }
    };
  },
  methods: {
    onSubmit(event) {
      this.$emit("submit", event);
    },
    onCancel(event) {
      this.$emit("cancel", event);
    },
    onClose(event) {
      this.$emit("close", event);
    }
  }
});

// sfc-template:/home/runner/work/docs-generator/docs-generator/fkui/packages/vue/src/components/FModal/examples/ExampleModal.vue?type=template
import { createTextVNode as _createTextVNode, createElementVNode as _createElementVNode, resolveComponent as _resolveComponent, resolveDirective as _resolveDirective, withCtx as _withCtx, openBlock as _openBlock, createBlock as _createBlock, withDirectives as _withDirectives } from "vue";
var _hoisted_1 = /* @__PURE__ */ _createElementVNode(
  "p",
  null,
  " Fruktsallad \xE4r en dessert best\xE5ende av minst tre sorters blandade frukter som \xE4r t\xE4rnade eller skivade och ofta skalade och urk\xE4rnade. En tallrik med fruktsallad best\xE5ende av p\xE4ron, satsuma, kiwi, passionsfrukt, granat\xE4ppelk\xE4rnor, samt grekisk yoghurt blandat med flytande honung, kardemumma och vaniljsocker. ",
  -1
  /* HOISTED */
);
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_f_text_field = _resolveComponent("f-text-field");
  const _component_f_form_modal = _resolveComponent("f-form-modal");
  const _directive_test = _resolveDirective("test");
  const _directive_validation = _resolveDirective("validation");
  return _openBlock(), _createBlock(_component_f_form_modal, {
    size: _ctx.size,
    "data-test": _ctx.testId,
    "use-error-list": false,
    "is-open": _ctx.isOpen,
    value: _ctx.value,
    "before-submit": _ctx.beforeSubmit,
    buttons: _ctx.buttons ? _ctx.buttons : void 0,
    onSubmit: _ctx.onSubmit,
    onCancel: _ctx.onCancel,
    onClose: _ctx.onClose
  }, {
    header: _withCtx(() => [
      _createTextVNode(" Fruktsallad ")
    ]),
    "error-message": _withCtx(() => [
      _createTextVNode(" Oj, du har gl\xF6mt fylla i n\xE5got. G\xE5 till: ")
    ]),
    "input-text-fields": _withCtx(() => [
      _withDirectives((_openBlock(), _createBlock(_component_f_text_field, {
        modelValue: _ctx.value.field1,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.value.field1 = $event)
      }, {
        default: _withCtx(() => [
          _createTextVNode(" Favoritfrukt ")
        ]),
        _: 1
        /* STABLE */
      }, 8, ["modelValue"])), [
        [_directive_test, "field1"],
        [
          _directive_validation,
          { maxLength: { length: 32 } },
          void 0,
          {
            required: true,
            maxLength: true
          }
        ]
      ]),
      _withDirectives((_openBlock(), _createBlock(_component_f_text_field, {
        modelValue: _ctx.value.field2,
        "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => _ctx.value.field2 = $event)
      }, {
        default: _withCtx(() => [
          _createTextVNode(" Smak ")
        ]),
        _: 1
        /* STABLE */
      }, 8, ["modelValue"])), [
        [_directive_test, "field2"],
        [
          _directive_validation,
          { maxLength: { length: 32 } },
          void 0,
          {
            required: true,
            maxLength: true
          }
        ]
      ])
    ]),
    default: _withCtx(() => [
      _hoisted_1
    ]),
    _: 1
    /* STABLE */
  }, 8, ["size", "data-test", "is-open", "value", "before-submit", "buttons", "onSubmit", "onCancel", "onClose"]);
}

// packages/vue/src/components/FModal/examples/ExampleModal.vue
ExampleModal_default.render = render;
ExampleModal_default.__file = "packages/vue/src/components/FModal/examples/ExampleModal.vue";
var ExampleModal_default2 = ExampleModal_default;

// virtual-entry:./packages/vue/src/components/FModal/examples/FFormModalExampleCustomButtons.vue
import { createElementVNode as _createElementVNode2, resolveComponent as _resolveComponent2, createVNode as _createVNode, toDisplayString as _toDisplayString, openBlock as _openBlock2, createElementBlock as _createElementBlock, createCommentVNode as _createCommentVNode } from "vue";
var exampleComponent = defineComponent2({
  name: "FFormModalExampleCustomButtons",
  components: { ExampleModal: ExampleModal_default2 },
  props: {},
  data: () => {
    return {
      isOpen: false,
      field1: "",
      field2: "",
      buttons: [{ label: "St\xE4ng", screenreader: "formul\xE4ret", event: "dismiss" }]
    };
  },
  methods: {
    onClick() {
      this.isOpen = true;
    },
    onClose() {
      this.isOpen = false;
    },
    onSubmit(event) {
      this.field1 = event.data.field1;
      this.field2 = event.data.field2;
      window.alert("onSubmit");
    },
    onCancel() {
      this.resetFields();
      window.alert("onCancel");
    },
    resetFields() {
      this.field1 = "";
      this.field2 = "";
    }
  }
});
var _hoisted_12 = { class: "f-form-modal-custom-buttons" };
var _hoisted_2 = { class: "f-form-modal-example" };
var _hoisted_3 = { key: 0 };
var _hoisted_4 = /* @__PURE__ */ _createElementVNode2(
  "pre",
  null,
  "Modalen st\xE4ngdes med resultatet:",
  -1
  /* HOISTED */
);
function render2(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_example_modal = _resolveComponent2("example-modal");
  return _openBlock2(), _createElementBlock("div", _hoisted_12, [
    _createElementVNode2("button", {
      type: "button",
      class: "button button--secondary",
      onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onClick && _ctx.onClick(...args))
    }, "\xD6ppna Modal"),
    _createElementVNode2("div", _hoisted_2, [
      _createVNode(_component_example_modal, {
        "is-open": _ctx.isOpen,
        buttons: _ctx.buttons,
        onSubmit: _ctx.onSubmit,
        onCancel: _ctx.onCancel,
        onClose: _ctx.onClose
      }, null, 8, ["is-open", "buttons", "onSubmit", "onCancel", "onClose"])
    ]),
    _ctx.field1 || _ctx.field2 ? (_openBlock2(), _createElementBlock("div", _hoisted_3, [
      _hoisted_4,
      _createElementVNode2(
        "pre",
        null,
        "F\xF6rnamn: " + _toDisplayString(_ctx.field1) + ", Efternamn: " + _toDisplayString(_ctx.field2),
        1
        /* TEXT */
      )
    ])) : _createCommentVNode("v-if", true)
  ]);
}
exampleComponent.render = render2;
setup({
  rootComponent: exampleComponent,
  selector: "#FFormModalExampleCustomButtons"
});
export {
  render2 as render
};
