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

// virtual-entry:./docs/styles/examples/CompareDensity.vue
import { defineComponent } from "vue";
import {
  FTextField,
  FTextareaField,
  FSelectField,
  FDatepickerField,
  FFieldset,
  FCheckboxField,
  FRadioField,
  FDataTable,
  FTableColumn,
  FList,
  FCard,
  FBadge,
  FExpandableParagraph,
  FExpandablePanel,
  FMessageBox,
  FTooltip,
  FIcon,
  FStaticField
} from "@fkui/vue";
import { createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, withCtx as _withCtx, createVNode as _createVNode, createElementVNode as _createElementVNode, renderList as _renderList, Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock, resolveDirective as _resolveDirective, createBlock as _createBlock, withDirectives as _withDirectives, normalizeClass as _normalizeClass } from "vue";
var exampleComponent = defineComponent({
  components: {
    FTextField,
    FTextareaField,
    FSelectField,
    FDatepickerField,
    FFieldset,
    FCheckboxField,
    FRadioField,
    FDataTable,
    FTableColumn,
    FList,
    FCard,
    FBadge,
    FExpandableParagraph,
    FExpandablePanel,
    FMessageBox,
    FTooltip,
    FIcon,
    FStaticField
  },
  data() {
    return {
      components: [],
      densityLeft: "density-default",
      densityRight: "density-dense",
      textField: "Text",
      textAreaField: [1, 2, 3, 4].map((it) => `Rad ${it}`).join("\n"),
      selectField: "Text",
      datepickerField: "2024-01-01",
      checkboxField: [],
      radioField: "",
      dataTableRows: ["1", "2", "3"].map((id) => ({ id })),
      dataTableColumns: ["1", "2", "3"].map((id) => ({ id })),
      listItems: ["1", "2", "3"].map((id) => ({ id })),
      listSelectedItems: []
    };
  },
  computed: {
    densities() {
      return [this.densityLeft, this.densityRight].map((it) => ({ class: it }));
    }
  }
});
var _hoisted_1 = { class: "container-fluid" };
var _hoisted_2 = { class: "row" };
var _hoisted_3 = { class: "col col--sm-6" };
var _hoisted_4 = { class: "col col--sm-6" };
var _hoisted_5 = { class: "row" };
var _hoisted_6 = /* @__PURE__ */ _createElementVNode(
  "div",
  { class: "tooltip-before" },
  [
    /* @__PURE__ */ _createElementVNode("label", { class: "label tooltip-before__label" }, " Tooltip ")
  ],
  -1
  /* HOISTED */
);
var _hoisted_7 = /* @__PURE__ */ _createElementVNode(
  "option",
  { value: "Text" },
  "Text",
  -1
  /* HOISTED */
);
var _hoisted_8 = /* @__PURE__ */ _createElementVNode(
  "option",
  { value: "Text2" },
  "Text 2",
  -1
  /* HOISTED */
);
var _hoisted_9 = /* @__PURE__ */ _createElementVNode(
  "option",
  { value: "Text3" },
  "Text 3",
  -1
  /* HOISTED */
);
var _hoisted_10 = { class: "button-group" };
var _hoisted_11 = {
  class: "button button-group__item button--tertiary button--medium button--align-text",
  type: "button"
};
var _hoisted_12 = /* @__PURE__ */ _createElementVNode(
  "span",
  null,
  " \xC4ndra ",
  -1
  /* HOISTED */
);
var _hoisted_13 = {
  class: "button button-group__item button--tertiary button--medium button--align-text",
  type: "button"
};
var _hoisted_14 = /* @__PURE__ */ _createElementVNode(
  "span",
  null,
  " Ta bort ",
  -1
  /* HOISTED */
);
var _hoisted_15 = { class: "button-group" };
var _hoisted_16 = /* @__PURE__ */ _createElementVNode(
  "button",
  {
    class: "button button--primary button--medium button-group__item",
    type: "button"
  },
  " Medium ",
  -1
  /* HOISTED */
);
var _hoisted_17 = /* @__PURE__ */ _createElementVNode(
  "button",
  {
    class: "button button--secondary button--medium button-group__item",
    type: "button"
  },
  " Medium ",
  -1
  /* HOISTED */
);
var _hoisted_18 = {
  class: "button button--tertiary button--medium button-group__item",
  type: "button"
};
var _hoisted_19 = { class: "button-group" };
var _hoisted_20 = /* @__PURE__ */ _createElementVNode(
  "button",
  {
    class: "button button--primary button--large button-group__item",
    type: "button"
  },
  " Large ",
  -1
  /* HOISTED */
);
var _hoisted_21 = /* @__PURE__ */ _createElementVNode(
  "button",
  {
    class: "button button--secondary button--large button-group__item",
    type: "button"
  },
  " Large ",
  -1
  /* HOISTED */
);
var _hoisted_22 = {
  class: "button button--tertiary button--large button-group__item",
  type: "button"
};
var _hoisted_23 = /* @__PURE__ */ _createElementVNode(
  "p",
  null,
  "Br\xF6dtext",
  -1
  /* HOISTED */
);
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_f_radio_field = _resolveComponent("f-radio-field");
  const _component_f_fieldset = _resolveComponent("f-fieldset");
  const _component_f_text_field = _resolveComponent("f-text-field");
  const _component_f_tooltip = _resolveComponent("f-tooltip");
  const _component_f_static_field = _resolveComponent("f-static-field");
  const _component_f_textarea_field = _resolveComponent("f-textarea-field");
  const _component_f_select_field = _resolveComponent("f-select-field");
  const _component_f_datepicker_field = _resolveComponent("f-datepicker-field");
  const _component_f_checkbox_field = _resolveComponent("f-checkbox-field");
  const _component_f_table_column = _resolveComponent("f-table-column");
  const _component_f_data_table = _resolveComponent("f-data-table");
  const _component_f_list = _resolveComponent("f-list");
  const _component_f_icon = _resolveComponent("f-icon");
  const _component_f_card = _resolveComponent("f-card");
  const _component_f_badge = _resolveComponent("f-badge");
  const _component_f_expandable_paragraph = _resolveComponent("f-expandable-paragraph");
  const _component_f_expandable_panel = _resolveComponent("f-expandable-panel");
  const _component_f_message_box = _resolveComponent("f-message-box");
  const _directive_validation = _resolveDirective("validation");
  return _openBlock(), _createElementBlock("div", _hoisted_1, [
    _createElementVNode("div", _hoisted_2, [
      _createElementVNode("div", _hoisted_3, [
        _createVNode(_component_f_fieldset, {
          name: "density-left",
          chip: "",
          horizontal: ""
        }, {
          label: _withCtx(() => [
            _createTextVNode(" V\xE4nster ")
          ]),
          default: _withCtx(() => [
            _createVNode(_component_f_radio_field, {
              modelValue: _ctx.densityLeft,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.densityLeft = $event),
              value: "density-default"
            }, {
              default: _withCtx(() => [
                _createTextVNode(" Standard ")
              ]),
              _: 1
              /* STABLE */
            }, 8, ["modelValue"]),
            _createVNode(_component_f_radio_field, {
              modelValue: _ctx.densityLeft,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => _ctx.densityLeft = $event),
              value: "density-dense"
            }, {
              default: _withCtx(() => [
                _createTextVNode(" Kompakt ")
              ]),
              _: 1
              /* STABLE */
            }, 8, ["modelValue"]),
            _createVNode(_component_f_radio_field, {
              modelValue: _ctx.densityLeft,
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => _ctx.densityLeft = $event),
              value: "density-densest"
            }, {
              default: _withCtx(() => [
                _createTextVNode(" Extra kompakt ")
              ]),
              _: 1
              /* STABLE */
            }, 8, ["modelValue"])
          ]),
          _: 1
          /* STABLE */
        })
      ]),
      _createElementVNode("div", _hoisted_4, [
        _createVNode(_component_f_fieldset, {
          name: "density-right",
          chip: "",
          horizontal: ""
        }, {
          label: _withCtx(() => [
            _createTextVNode(" H\xF6ger ")
          ]),
          default: _withCtx(() => [
            _createVNode(_component_f_radio_field, {
              modelValue: _ctx.densityRight,
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => _ctx.densityRight = $event),
              value: "density-default"
            }, {
              default: _withCtx(() => [
                _createTextVNode(" Standard ")
              ]),
              _: 1
              /* STABLE */
            }, 8, ["modelValue"]),
            _createVNode(_component_f_radio_field, {
              modelValue: _ctx.densityRight,
              "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => _ctx.densityRight = $event),
              value: "density-dense"
            }, {
              default: _withCtx(() => [
                _createTextVNode(" Kompakt ")
              ]),
              _: 1
              /* STABLE */
            }, 8, ["modelValue"]),
            _createVNode(_component_f_radio_field, {
              modelValue: _ctx.densityRight,
              "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => _ctx.densityRight = $event),
              value: "density-densest"
            }, {
              default: _withCtx(() => [
                _createTextVNode(" Extra kompakt ")
              ]),
              _: 1
              /* STABLE */
            }, 8, ["modelValue"])
          ]),
          _: 1
          /* STABLE */
        })
      ])
    ]),
    _createElementVNode("div", _hoisted_5, [
      (_openBlock(true), _createElementBlock(
        _Fragment,
        null,
        _renderList(_ctx.densities, (density) => {
          return _openBlock(), _createElementBlock(
            "div",
            {
              key: density.class,
              class: _normalizeClass(["col col--sm-6", density.class])
            },
            [
              _withDirectives((_openBlock(), _createBlock(_component_f_text_field, {
                modelValue: _ctx.textField,
                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => _ctx.textField = $event),
                maxlength: "100"
              }, {
                default: _withCtx(() => [
                  _createTextVNode(" Inmatningsf\xE4lt ")
                ]),
                _: 1
                /* STABLE */
              }, 8, ["modelValue"])), [
                [
                  _directive_validation,
                  void 0,
                  void 0,
                  { required: true }
                ]
              ]),
              _createVNode(_component_f_static_field, null, {
                label: _withCtx(() => [
                  _createTextVNode(" Presentationsf\xE4lt - statiskt ")
                ]),
                tooltip: _withCtx(() => [
                  _createVNode(_component_f_tooltip, { "screen-reader-text": "Sk\xE4rml\xE4sartext" }, {
                    header: _withCtx(() => [
                      _createTextVNode(" Rubrik ")
                    ]),
                    body: _withCtx(() => [
                      _createTextVNode(" Br\xF6dtext ")
                    ]),
                    _: 1
                    /* STABLE */
                  })
                ]),
                default: _withCtx(() => [
                  _createTextVNode(" Text ")
                ]),
                _: 1
                /* STABLE */
              }),
              _hoisted_6,
              _withDirectives((_openBlock(), _createBlock(_component_f_textarea_field, {
                modelValue: _ctx.textAreaField,
                "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => _ctx.textAreaField = $event),
                maxlength: 100
              }, {
                default: _withCtx(() => [
                  _createTextVNode(" Flerradigt inmatningsf\xE4lt ")
                ]),
                _: 1
                /* STABLE */
              }, 8, ["modelValue"])), [
                [
                  _directive_validation,
                  void 0,
                  void 0,
                  { required: true }
                ]
              ]),
              _createVNode(_component_f_select_field, {
                modelValue: _ctx.selectField,
                "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => _ctx.selectField = $event)
              }, {
                label: _withCtx(() => [
                  _createTextVNode(" Dropplista ")
                ]),
                default: _withCtx(() => [
                  _hoisted_7,
                  _hoisted_8,
                  _hoisted_9
                ]),
                _: 1
                /* STABLE */
              }, 8, ["modelValue"]),
              _withDirectives((_openBlock(), _createBlock(_component_f_datepicker_field, {
                modelValue: _ctx.datepickerField,
                "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => _ctx.datepickerField = $event),
                maxlength: "100"
              }, {
                default: _withCtx(() => [
                  _createTextVNode(" Datumv\xE4ljare ")
                ]),
                _: 1
                /* STABLE */
              }, 8, ["modelValue"])), [
                [
                  _directive_validation,
                  void 0,
                  void 0,
                  { required: true }
                ]
              ]),
              _withDirectives((_openBlock(), _createBlock(_component_f_fieldset, null, {
                label: _withCtx(() => [
                  _createTextVNode(" Kryssrutegrupp ")
                ]),
                default: _withCtx(() => [
                  _createVNode(_component_f_checkbox_field, {
                    modelValue: _ctx.checkboxField,
                    "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => _ctx.checkboxField = $event),
                    value: "Kryssruta1"
                  }, {
                    default: _withCtx(() => [
                      _createTextVNode(" Kryssruta ")
                    ]),
                    _: 1
                    /* STABLE */
                  }, 8, ["modelValue"]),
                  _createVNode(_component_f_checkbox_field, {
                    modelValue: _ctx.checkboxField,
                    "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => _ctx.checkboxField = $event),
                    value: "Kryssruta2"
                  }, {
                    default: _withCtx(() => [
                      _createTextVNode(" Kryssruta ")
                    ]),
                    _: 1
                    /* STABLE */
                  }, 8, ["modelValue"]),
                  _createVNode(_component_f_checkbox_field, {
                    modelValue: _ctx.checkboxField,
                    "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => _ctx.checkboxField = $event),
                    value: "Kryssruta3"
                  }, {
                    default: _withCtx(() => [
                      _createTextVNode(" Kryssruta ")
                    ]),
                    _: 1
                    /* STABLE */
                  }, 8, ["modelValue"]),
                  _createVNode(_component_f_checkbox_field, {
                    modelValue: _ctx.checkboxField,
                    "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => _ctx.checkboxField = $event),
                    value: "Kryssruta4"
                  }, {
                    default: _withCtx(() => [
                      _createTextVNode(" Kryssruta ")
                    ]),
                    _: 1
                    /* STABLE */
                  }, 8, ["modelValue"])
                ]),
                _: 1
                /* STABLE */
              })), [
                [
                  _directive_validation,
                  void 0,
                  void 0,
                  { required: true }
                ]
              ]),
              _withDirectives((_openBlock(), _createBlock(_component_f_fieldset, {
                name: `radio-${density.class}`
              }, {
                label: _withCtx(() => [
                  _createTextVNode(" Radioknappsgrupp ")
                ]),
                default: _withCtx(() => [
                  _createVNode(_component_f_radio_field, {
                    modelValue: _ctx.radioField,
                    "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => _ctx.radioField = $event),
                    value: "Radio1"
                  }, {
                    default: _withCtx(() => [
                      _createTextVNode(" Text ")
                    ]),
                    _: 1
                    /* STABLE */
                  }, 8, ["modelValue"]),
                  _createVNode(_component_f_radio_field, {
                    modelValue: _ctx.radioField,
                    "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => _ctx.radioField = $event),
                    value: "Radio2"
                  }, {
                    default: _withCtx(() => [
                      _createTextVNode(" Text ")
                    ]),
                    _: 1
                    /* STABLE */
                  }, 8, ["modelValue"]),
                  _createVNode(_component_f_radio_field, {
                    modelValue: _ctx.radioField,
                    "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => _ctx.radioField = $event),
                    value: "Radio3"
                  }, {
                    default: _withCtx(() => [
                      _createTextVNode(" Text ")
                    ]),
                    _: 1
                    /* STABLE */
                  }, 8, ["modelValue"]),
                  _createVNode(_component_f_radio_field, {
                    modelValue: _ctx.radioField,
                    "onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => _ctx.radioField = $event),
                    value: "Radio4"
                  }, {
                    default: _withCtx(() => [
                      _createTextVNode(" Text ")
                    ]),
                    _: 1
                    /* STABLE */
                  }, 8, ["modelValue"])
                ]),
                _: 2
                /* DYNAMIC */
              }, 1032, ["name"])), [
                [
                  _directive_validation,
                  void 0,
                  void 0,
                  { required: true }
                ]
              ]),
              _createVNode(_component_f_data_table, {
                rows: _ctx.dataTableRows,
                striped: "",
                "key-attribute": "id"
              }, {
                caption: _withCtx(() => [
                  _createTextVNode(" Tabell ")
                ]),
                default: _withCtx(() => [
                  (_openBlock(true), _createElementBlock(
                    _Fragment,
                    null,
                    _renderList(_ctx.dataTableColumns, (column) => {
                      return _openBlock(), _createBlock(_component_f_table_column, {
                        key: column.id,
                        name: column.id,
                        title: "Kolumnrubrik",
                        type: "text"
                      }, {
                        default: _withCtx(() => [
                          _createTextVNode(" Text ")
                        ]),
                        _: 2
                        /* DYNAMIC */
                      }, 1032, ["name"]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ]),
                _: 1
                /* STABLE */
              }, 8, ["rows"]),
              _createVNode(_component_f_list, {
                modelValue: _ctx.listSelectedItems,
                "onUpdate:modelValue": _cache[18] || (_cache[18] = ($event) => _ctx.listSelectedItems = $event),
                "key-attribute": "id",
                items: _ctx.listItems
              }, {
                default: _withCtx(() => [
                  _createTextVNode(" Lista ")
                ]),
                _: 1
                /* STABLE */
              }, 8, ["modelValue", "items"]),
              _createVNode(_component_f_card, null, {
                header: _withCtx(({ headingSlotClass }) => [
                  _createElementVNode(
                    "h3",
                    {
                      class: _normalizeClass(headingSlotClass)
                    },
                    "Kort",
                    2
                    /* CLASS */
                  )
                ]),
                default: _withCtx(() => [
                  _createTextVNode(" Inneh\xE5ll ")
                ]),
                footer: _withCtx(() => [
                  _createElementVNode("div", _hoisted_10, [
                    _createElementVNode("button", _hoisted_11, [
                      _createVNode(_component_f_icon, { name: "pen" }),
                      _hoisted_12
                    ]),
                    _createElementVNode("button", _hoisted_13, [
                      _createVNode(_component_f_icon, { name: "trashcan" }),
                      _hoisted_14
                    ])
                  ])
                ]),
                _: 1
                /* STABLE */
              }),
              _createElementVNode("div", _hoisted_15, [
                _hoisted_16,
                _hoisted_17,
                _createElementVNode("button", _hoisted_18, [
                  _createVNode(_component_f_icon, {
                    name: "paper-clip",
                    class: "button__icon"
                  }),
                  _createTextVNode(" Medium ")
                ])
              ]),
              _createElementVNode("div", _hoisted_19, [
                _hoisted_20,
                _hoisted_21,
                _createElementVNode("button", _hoisted_22, [
                  _createVNode(_component_f_icon, {
                    name: "paper-clip",
                    class: "button__icon"
                  }),
                  _createTextVNode(" Large ")
                ])
              ]),
              _createVNode(_component_f_badge, null, {
                default: _withCtx(() => [
                  _createTextVNode(" Bricka ")
                ]),
                _: 1
                /* STABLE */
              }),
              _createVNode(_component_f_badge, { status: "info" }, {
                default: _withCtx(() => [
                  _createTextVNode(" Bricka ")
                ]),
                _: 1
                /* STABLE */
              }),
              _createVNode(_component_f_expandable_paragraph, { expanded: true }, {
                title: _withCtx(() => [
                  _createTextVNode(" Expanderbart stycke ")
                ]),
                default: _withCtx(() => [
                  _createTextVNode(" Inneh\xE5ll ")
                ]),
                _: 1
                /* STABLE */
              }),
              _createVNode(_component_f_expandable_panel, { expanded: true }, {
                title: _withCtx(() => [
                  _createTextVNode(" Expanderbar panel ")
                ]),
                default: _withCtx(() => [
                  _createTextVNode(" Inneh\xE5ll ")
                ]),
                _: 1
                /* STABLE */
              }),
              _createVNode(_component_f_message_box, { type: "info" }, {
                default: _withCtx(({ headingSlotClass }) => [
                  _createElementVNode(
                    "h2",
                    {
                      class: _normalizeClass(headingSlotClass)
                    },
                    "Meddelanderuta",
                    2
                    /* CLASS */
                  ),
                  _hoisted_23
                ]),
                _: 1
                /* STABLE */
              })
            ],
            2
            /* CLASS */
          );
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ])
  ]);
}
exampleComponent.render = render;
setup({
  rootComponent: exampleComponent,
  selector: "#CompareDensity"
});
export {
  render
};
