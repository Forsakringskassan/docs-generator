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

// virtual-entry:./packages/vue/src/components/FCrudDataset/examples/FCrudDatasetCustomTextExample.vue
import { defineComponent } from "vue";
import {
  FCrudDataset,
  FCrudButton,
  FList,
  FStaticField,
  FTextField,
  FTextareaField
} from "@fkui/vue";

// packages/vue/src/components/FCrudDataset/examples/fruit-data.ts
var fruits = [
  {
    id: "1",
    name: "\xC4pple",
    origin: "Sverige",
    description: "Rund, ofta r\xF6d eller gr\xF6n frukt med s\xF6t eller syrlig smak."
  },
  {
    id: "2",
    name: "Banan",
    origin: "Colombia",
    description: "L\xE5ng, gul frukt med mjukt och s\xF6tt fruktk\xF6tt."
  },
  {
    id: "3",
    name: "Vattenmelon",
    origin: "Spanien",
    description: "Stor, rund frukt med gr\xF6nt skal och saftigt, r\xF6tt fruktk\xF6tt."
  },
  {
    id: "4",
    name: "Grapefrukt",
    origin: "Turkiet",
    description: "Stor, rund citrusfrukt med tjockt skal och saftig, syrlig smak."
  }
];

// virtual-entry:./packages/vue/src/components/FCrudDataset/examples/FCrudDatasetCustomTextExample.vue
import { toDisplayString as _toDisplayString, createElementVNode as _createElementVNode, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, createVNode as _createVNode, withCtx as _withCtx, resolveDirective as _resolveDirective, openBlock as _openBlock, createBlock as _createBlock, withDirectives as _withDirectives } from "vue";
var exampleComponent = defineComponent({
  name: "ExampleApp",
  components: {
    FCrudDataset,
    FCrudButton,
    FList,
    FStaticField,
    FTextField,
    FTextareaField
  },
  data() {
    return {
      fruits
    };
  },
  methods: {
    // Förpopulera ett objekt med värden
    beforeCreate() {
      const fruit = {
        id: String(this.getMaxId() + 1),
        name: "",
        origin: "",
        description: ""
      };
      return fruit;
    },
    getMaxId() {
      return this.fruits.reduce((max, item) => {
        return Math.max(max, parseInt(item.id, 10));
      }, 0);
    },
    saveModel(row) {
      console.log("Post model to backend", row);
    }
  }
});
var _hoisted_1 = { class: "row" };
var _hoisted_2 = { class: "col col--lg-7 col--md-6" };
var _hoisted_3 = /* @__PURE__ */ _createElementVNode(
  "br",
  null,
  null,
  -1
  /* HOISTED */
);
var _hoisted_4 = /* @__PURE__ */ _createElementVNode(
  "br",
  null,
  null,
  -1
  /* HOISTED */
);
var _hoisted_5 = { class: "col col--lg-5 col--md-6" };
var _hoisted_6 = { class: "row row--align-end" };
var _hoisted_7 = { class: "col" };
var _hoisted_8 = { class: "col" };
var _hoisted_9 = /* @__PURE__ */ _createElementVNode(
  "span",
  { class: "sr-only" },
  " frukt ",
  -1
  /* HOISTED */
);
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_f_crud_button = _resolveComponent("f-crud-button");
  const _component_f_list = _resolveComponent("f-list");
  const _component_f_text_field = _resolveComponent("f-text-field");
  const _component_f_textarea_field = _resolveComponent("f-textarea-field");
  const _component_f_static_field = _resolveComponent("f-static-field");
  const _component_f_crud_dataset = _resolveComponent("f-crud-dataset");
  const _directive_validation = _resolveDirective("validation");
  return _openBlock(), _createBlock(_component_f_crud_dataset, {
    modelValue: _ctx.fruits,
    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.fruits = $event),
    "before-create": _ctx.beforeCreate,
    "add-new-modal-header": "L\xE4gg till ny frukt",
    "modify-modal-header": "\xC4ndra land",
    "delete-modal-header": "Vill du ta bort frukten?",
    onCreated: _ctx.saveModel,
    onUpdated: _ctx.saveModel,
    onDeleted: _ctx.saveModel
  }, {
    default: _withCtx(() => [
      _createVNode(_component_f_list, {
        items: _ctx.fruits,
        "element-id": "example",
        "key-attribute": "id"
      }, {
        default: _withCtx(({ item }) => [
          _createElementVNode("div", _hoisted_1, [
            _createElementVNode("div", _hoisted_2, [
              _createElementVNode(
                "h3",
                null,
                _toDisplayString(item.name),
                1
                /* TEXT */
              ),
              _createElementVNode("p", null, [
                _createTextVNode(" Land: "),
                _createElementVNode(
                  "em",
                  null,
                  _toDisplayString(item.origin),
                  1
                  /* TEXT */
                ),
                _hoisted_3,
                _createTextVNode(" Beskrivning: "),
                _createElementVNode(
                  "em",
                  null,
                  _toDisplayString(item.description),
                  1
                  /* TEXT */
                ),
                _hoisted_4
              ])
            ]),
            _createElementVNode("div", _hoisted_5, [
              _createElementVNode("div", _hoisted_6, [
                _createElementVNode("div", _hoisted_7, [
                  _createVNode(_component_f_crud_button, {
                    action: "modify",
                    item,
                    icon: "",
                    label: ""
                  }, null, 8, ["item"])
                ]),
                _createElementVNode("div", _hoisted_8, [
                  _createVNode(_component_f_crud_button, {
                    action: "delete",
                    item,
                    icon: "",
                    label: ""
                  }, null, 8, ["item"])
                ])
              ])
            ])
          ])
        ]),
        screenreader: _withCtx(({ item }) => [
          _createTextVNode(
            " Frukt ID " + _toDisplayString(item.id),
            1
            /* TEXT */
          )
        ]),
        _: 1
        /* STABLE */
      }, 8, ["items"])
    ]),
    "add-button": _withCtx(() => [
      _createTextVNode(" L\xE4gg till ny "),
      _hoisted_9
    ]),
    add: _withCtx(({ item }) => [
      _withDirectives((_openBlock(), _createBlock(_component_f_text_field, {
        modelValue: item.name,
        "onUpdate:modelValue": ($event) => item.name = $event,
        type: "text"
      }, {
        default: _withCtx(() => [
          _createTextVNode(" Namn ")
        ]),
        _: 2
        /* DYNAMIC */
      }, 1032, ["modelValue", "onUpdate:modelValue"])), [
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
        modelValue: item.origin,
        "onUpdate:modelValue": ($event) => item.origin = $event,
        type: "text"
      }, {
        default: _withCtx(() => [
          _createTextVNode(" Land ")
        ]),
        _: 2
        /* DYNAMIC */
      }, 1032, ["modelValue", "onUpdate:modelValue"])), [
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
      _withDirectives((_openBlock(), _createBlock(_component_f_textarea_field, {
        modelValue: item.description,
        "onUpdate:modelValue": ($event) => item.description = $event
      }, {
        default: _withCtx(() => [
          _createTextVNode(" Beskrivning ")
        ]),
        _: 2
        /* DYNAMIC */
      }, 1032, ["modelValue", "onUpdate:modelValue"])), [
        [
          _directive_validation,
          void 0,
          void 0,
          { required: true }
        ]
      ])
    ]),
    modify: _withCtx(({ item }) => [
      _createVNode(_component_f_static_field, {
        modelValue: item.name,
        "onUpdate:modelValue": ($event) => item.name = $event,
        type: "text"
      }, {
        label: _withCtx(() => [
          _createTextVNode(" Namn ")
        ]),
        default: _withCtx(() => [
          _createTextVNode(
            _toDisplayString(item.name),
            1
            /* TEXT */
          )
        ]),
        _: 2
        /* DYNAMIC */
      }, 1032, ["modelValue", "onUpdate:modelValue"]),
      _withDirectives((_openBlock(), _createBlock(_component_f_textarea_field, {
        modelValue: item.origin,
        "onUpdate:modelValue": ($event) => item.origin = $event,
        type: "text"
      }, {
        default: _withCtx(() => [
          _createTextVNode(" Land ")
        ]),
        _: 2
        /* DYNAMIC */
      }, 1032, ["modelValue", "onUpdate:modelValue"])), [
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
    delete: _withCtx(({ item }) => [
      _createTextVNode(
        ' Vill du verkligen ta bort frukten "' + _toDisplayString(item.name) + '" med ID ' + _toDisplayString(item.id),
        1
        /* TEXT */
      )
    ]),
    _: 1
    /* STABLE */
  }, 8, ["modelValue", "before-create", "onCreated", "onUpdated", "onDeleted"]);
}
exampleComponent.render = render;
setup({
  rootComponent: exampleComponent,
  selector: "#FCrudDatasetCustomTextExample"
});
export {
  render
};