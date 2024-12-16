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

// virtual-entry:./packages/vue/src/components/FForm/examples/FFormExample.vue
import { defineComponent as defineComponent2 } from "vue";
import {
  FCheckboxField,
  FEmailTextField,
  FForm,
  FFormStep as FFormStep2,
  FFormStepButton as FFormStepButton2,
  FIcon,
  FOrganisationsnummerTextField,
  FPhoneTextField,
  FFieldset,
  FRadioField,
  FSelectField,
  FStaticField,
  FTextField as FTextField2,
  FTextareaField as FTextareaField2,
  FTooltip
} from "@fkui/vue";

// sfc-script:/home/runner/work/docs-generator/docs-generator/fkui/packages/vue/src/components/FForm/examples/ExampleKostnad.vue?type=script
import { defineComponent } from "vue";
import {
  FFormStep,
  FFormStepButton,
  FNumericTextField,
  FTextField,
  FTextareaField
} from "@fkui/vue";
var ExampleKostnad_default = defineComponent({
  name: "ExampleKostnad",
  components: {
    FFormStep,
    FFormStepButton,
    FNumericTextField,
    FTextField,
    FTextareaField
  },
  props: {
    kostnad: {
      type: Object,
      required: true
    },
    formStepId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      formData: { kostnad: "", belopp: "", beskrivning: "" },
      exampleOptions: {
        errorMessageTitleForm: "Innan du g\xE5r vidare...",
        errorMessageForm: "Du har n\xE5gra fel, gl\xF6m inte att titta i f\xF6ljande steg:",
        errorMessageFormStep: "",
        displayError: true,
        numberOfSteps: 2,
        dataMissing: "Information saknas."
      }
    };
  },
  created() {
    this.formData = this.kostnad;
  }
});

// sfc-template:/home/runner/work/docs-generator/docs-generator/fkui/packages/vue/src/components/FForm/examples/ExampleKostnad.vue?type=template
import { toDisplayString as _toDisplayString, normalizeClass as _normalizeClass, createElementVNode as _createElementVNode, openBlock as _openBlock, createElementBlock as _createElementBlock, createCommentVNode as _createCommentVNode, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, resolveDirective as _resolveDirective, withCtx as _withCtx, createBlock as _createBlock, withDirectives as _withDirectives, createVNode as _createVNode, createSlots as _createSlots } from "vue";
var _hoisted_1 = {
  key: 0,
  class: "sr-only"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_f_text_field = _resolveComponent("f-text-field");
  const _component_f_numeric_text_field = _resolveComponent("f-numeric-text-field");
  const _component_f_textarea_field = _resolveComponent("f-textarea-field");
  const _component_f_form_step_button = _resolveComponent("f-form-step-button");
  const _component_f_form_step = _resolveComponent("f-form-step");
  const _directive_validation = _resolveDirective("validation");
  return _openBlock(), _createElementBlock("div", null, [
    _createVNode(_component_f_form_step, {
      id: `formstep-${_ctx.formStepId}`
    }, _createSlots({
      header: _withCtx((header) => [
        _createElementVNode(
          "h2",
          {
            class: _normalizeClass(header.slotClass)
          },
          _toDisplayString(_ctx.formStepId + 2) + ". Kostnad",
          3
          /* TEXT, CLASS */
        ),
        header.isValid ? (_openBlock(), _createElementBlock("span", _hoisted_1, " Steget \xE4r korrekt ifyllt. ")) : _createCommentVNode("v-if", true)
      ]),
      default: _withCtx((scope) => [
        _withDirectives((_openBlock(), _createBlock(_component_f_text_field, {
          modelValue: _ctx.formData.kostnad,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.formData.kostnad = $event)
        }, {
          default: _withCtx(() => _cache[3] || (_cache[3] = [
            _createTextVNode(" Kostnad ")
          ])),
          _: 1
          /* STABLE */
        }, 8, ["modelValue"])), [
          [
            _directive_validation,
            {
              maxLength: { length: 100 }
            },
            void 0,
            {
              required: true,
              maxLength: true
            }
          ]
        ]),
        _withDirectives((_openBlock(), _createBlock(_component_f_numeric_text_field, {
          modelValue: _ctx.formData.belopp,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => _ctx.formData.belopp = $event)
        }, {
          default: _withCtx(() => _cache[4] || (_cache[4] = [
            _createTextVNode(" Belopp ")
          ])),
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
        _withDirectives((_openBlock(), _createBlock(_component_f_textarea_field, {
          modelValue: _ctx.formData.beskrivning,
          "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => _ctx.formData.beskrivning = $event)
        }, {
          default: _withCtx(() => _cache[5] || (_cache[5] = [
            _createTextVNode(" Hur har du r\xE4knat ")
          ])),
          _: 1
          /* STABLE */
        }, 8, ["modelValue"])), [
          [
            _directive_validation,
            void 0,
            void 0,
            { whitelist: true }
          ]
        ]),
        _createVNode(_component_f_form_step_button, {
          "is-open": (
            // @ts-ignore
            scope.isOpen
          ),
          "is-any-field-touched": (
            // @ts-ignore
            scope.isAnyFieldTouched
          ),
          onClick: ($event) => (
            // @ts-ignore
            scope.toggleIsOpen()
          )
        }, null, 8, ["is-open", "is-any-field-touched", "onClick"])
      ]),
      _: 2
      /* DYNAMIC */
    }, [
      _ctx.exampleOptions.errorMessageFormStep ? {
        name: "error-message",
        fn: _withCtx(() => [
          _createElementVNode(
            "p",
            null,
            _toDisplayString(_ctx.exampleOptions.errorMessageFormStep),
            1
            /* TEXT */
          )
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["id"])
  ]);
}

// packages/vue/src/components/FForm/examples/ExampleKostnad.vue
ExampleKostnad_default.render = render;
ExampleKostnad_default.__file = "packages/vue/src/components/FForm/examples/ExampleKostnad.vue";
var ExampleKostnad_default2 = ExampleKostnad_default;

// virtual-entry:./packages/vue/src/components/FForm/examples/FFormExample.vue
import { createElementVNode as _createElementVNode2, createTextVNode as _createTextVNode2, resolveComponent as _resolveComponent2, resolveDirective as _resolveDirective2, withCtx as _withCtx2, openBlock as _openBlock2, createBlock as _createBlock2, withDirectives as _withDirectives2, createVNode as _createVNode2, toDisplayString as _toDisplayString2, normalizeClass as _normalizeClass2, createElementBlock as _createElementBlock2, createCommentVNode as _createCommentVNode2, renderList as _renderList, Fragment as _Fragment, vShow as _vShow, createSlots as _createSlots2 } from "vue";
var EXAMPLE_OPTIONS_KEY = "FKUI_VUE_FORM_OPTIONS_EXAMPLE";
var FORM_DATA_KEY = "FKUI_VUE_FORM_DATA_EXAMPLE";
var exampleComponent = defineComponent2({
  name: "FFormExample",
  components: {
    FCheckboxField,
    FForm,
    FFormStep: FFormStep2,
    FFormStepButton: FFormStepButton2,
    FFieldset,
    FIcon,
    FRadioField,
    FSelectField,
    FStaticField,
    FTextareaField: FTextareaField2,
    FTextField: FTextField2,
    FEmailTextField,
    FOrganisationsnummerTextField,
    FPhoneTextField,
    ExampleKostnad: ExampleKostnad_default2,
    FTooltip
  },
  data() {
    return {
      costs: [],
      exampleOptions: {
        errorMessageTitleForm: "Innan du g\xE5r vidare...",
        errorMessageForm: "Du har n\xE5gra fel, gl\xF6m inte att titta i f\xF6ljande steg:",
        errorMessageFormStep: "",
        displayError: true,
        errorScroll: "center",
        numberOfSteps: 2,
        dataMissing: "Information saknas."
      },
      renderData: {
        fruits: [
          { value: "BANAN", text: "Banan \u{1F34C}" },
          { value: "\xC4PPLE", text: "\xC4pple \u{1F34F}" },
          { value: "MANDARIN", text: "Mandarin \u{1F34A}" },
          { value: "ANANAS", text: "Ananas \u{1F34D}" },
          { value: "VATTENMELON", text: "Vattenmelon \u{1F349}" },
          { value: "ANDRA_FRUKTER", text: "Andra frukter" }
        ],
        sweets: [
          { value: "CHOKLAD", text: "Choklad \u{1F36B}" },
          { value: "MUNK", text: "Munk \u{1F369}" },
          { value: "MJUKGLASS", text: "Mjukglass \u{1F366}" },
          { value: "KAKA", text: "Kaka \u{1F36A}" },
          { value: "L\xD6SGODIS", text: "L\xF6sgodis \u{1F36C}" },
          { value: "ANDRA_S\xD6TSAKER", text: "Andra s\xF6tsaker" }
        ]
      },
      formData: {
        firstName: "",
        lastName: "",
        email: "",
        orgnummer: "",
        phone: "",
        age: "",
        martialStatus: "",
        martialStatusOther: "",
        fruitsPerWeek: "",
        sweetsPerWeek: "",
        consumedFruits: [],
        consumedSweets: [],
        consumptionDescription: "",
        hasSigned: false
      }
    };
  },
  computed: {
    containerTitle() {
      return `${this.costs.length + 2}. Konsumtion`;
    },
    martialStatusText() {
      const martialStatuses = {
        SINGEL: "Singel",
        SAMBO: "Sambo",
        GIFT: "Gift",
        ANNAT: `Annat, ${this.formData.martialStatusOther}`,
        VILL_INTE_SVARA: "Vill inte svara"
      };
      return martialStatuses[this.formData.martialStatus];
    },
    fruitsPerWeekText() {
      const suffix = this.formData.fruitsPerWeek === 1 ? "g\xE5ng" : "g\xE5nger";
      return this.formData.fruitsPerWeek ? `${this.formData.fruitsPerWeek} ${suffix}` : void 0;
    },
    sweetsPerWeekText() {
      const suffix = this.formData.sweetsPerWeek === 1 ? "g\xE5ng" : "g\xE5nger";
      return this.formData.sweetsPerWeek ? `${this.formData.sweetsPerWeek} ${suffix}` : void 0;
    },
    consumedFruitsText() {
      return this.formData.consumedFruits.length > 0 ? this.renderData.fruits.filter((fruit) => this.formData.consumedFruits.includes(fruit.value)).map((fruit) => fruit.text).join(", ") : void 0;
    },
    consumedSweetsText() {
      return this.formData.consumedSweets.length > 0 ? this.renderData.sweets.filter((sweet) => this.formData.consumedSweets.includes(sweet.value)).map((sweet) => sweet.text).join(", ") : void 0;
    }
  },
  watch: {
    exampleOptions: {
      deep: true,
      handler() {
        localStorage.setItem(EXAMPLE_OPTIONS_KEY, JSON.stringify(this.exampleOptions));
      }
    },
    formData: {
      deep: true,
      handler() {
        localStorage.setItem(FORM_DATA_KEY, JSON.stringify(this.formData));
      }
    }
  },
  created() {
    const exampleOptions = localStorage.getItem(EXAMPLE_OPTIONS_KEY);
    if (exampleOptions) {
      Object.assign(this.exampleOptions, JSON.parse(exampleOptions));
    }
    const formData = localStorage.getItem(FORM_DATA_KEY);
    if (formData) {
      Object.assign(this.formData, JSON.parse(formData));
    }
  },
  methods: {
    laggTillContainer() {
      this.costs.push({
        kostnad: "",
        belopp: void 0,
        beskrivning: ""
      });
    },
    onChangeResetMartialStatusOther() {
      if (this.formData.martialStatus !== "ANNAT") {
        this.formData.martialStatusOther = "";
      }
    },
    onSubmit() {
      alert("Du skickade in formul\xE4ret. Vars\xE5god och ta en \u{1F36A}!");
    },
    onClickClearFormData() {
      this.formData = {
        firstName: "",
        lastName: "",
        age: "",
        martialStatus: "",
        martialStatusOther: "",
        fruitsPerWeek: "",
        sweetsPerWeek: "",
        consumedFruits: [],
        consumedSweets: [],
        consumptionDescription: "",
        hasSigned: false
      };
      window.location.reload();
    }
  }
});
var _hoisted_12 = { class: "row" };
var _hoisted_2 = { class: "col col--md-6" };
var _hoisted_3 = { class: "col col--md-6" };
var _hoisted_4 = { class: "row" };
var _hoisted_5 = { class: "col col--md-6" };
var _hoisted_6 = { class: "col col--md-6" };
var _hoisted_7 = { id: "form-error-message" };
var _hoisted_8 = {
  key: 0,
  class: "sr-only"
};
var _hoisted_9 = ["value"];
var _hoisted_10 = { class: "row" };
var _hoisted_11 = { class: "col col--md-6" };
var _hoisted_122 = { class: "row" };
var _hoisted_13 = { class: "col col--md-6" };
var _hoisted_14 = { class: "row" };
var _hoisted_15 = { class: "col col--md-6" };
var _hoisted_16 = { class: "row" };
var _hoisted_17 = { class: "col col--md-6" };
var _hoisted_18 = { class: "row" };
var _hoisted_19 = { class: "col col--md-6" };
var _hoisted_20 = { class: "row" };
var _hoisted_21 = { class: "col col--md-6" };
var _hoisted_22 = {
  key: 0,
  class: "sr-only"
};
var _hoisted_23 = { class: "row" };
var _hoisted_24 = { class: "col col--md-6" };
var _hoisted_25 = ["value"];
var _hoisted_26 = { class: "row" };
var _hoisted_27 = { class: "col col--md-6" };
var _hoisted_28 = ["value"];
var _hoisted_29 = { class: "button-group" };
function render2(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_f_text_field = _resolveComponent2("f-text-field");
  const _component_f_checkbox_field = _resolveComponent2("f-checkbox-field");
  const _component_f_fieldset = _resolveComponent2("f-fieldset");
  const _component_f_radio_field = _resolveComponent2("f-radio-field");
  const _component_f_email_text_field = _resolveComponent2("f-email-text-field");
  const _component_f_organisationsnummer_text_field = _resolveComponent2("f-organisationsnummer-text-field");
  const _component_f_phone_text_field = _resolveComponent2("f-phone-text-field");
  const _component_f_select_field = _resolveComponent2("f-select-field");
  const _component_f_tooltip = _resolveComponent2("f-tooltip");
  const _component_f_static_field = _resolveComponent2("f-static-field");
  const _component_f_form_step_button = _resolveComponent2("f-form-step-button");
  const _component_f_form_step = _resolveComponent2("f-form-step");
  const _component_example_kostnad = _resolveComponent2("example-kostnad");
  const _component_f_icon = _resolveComponent2("f-icon");
  const _component_f_textarea_field = _resolveComponent2("f-textarea-field");
  const _component_f_form = _resolveComponent2("f-form");
  const _directive_validation = _resolveDirective2("validation");
  return _openBlock2(), _createElementBlock2("div", null, [
    _cache[78] || (_cache[78] = _createElementVNode2(
      "h2",
      null,
      "Exempel-alternativ",
      -1
      /* HOISTED */
    )),
    _cache[79] || (_cache[79] = _createElementVNode2(
      "p",
      null,
      "Gl\xF6m inte att ladda om sidan om du \xE4ndrar alternativen.",
      -1
      /* HOISTED */
    )),
    _cache[80] || (_cache[80] = _createElementVNode2(
      "h3",
      null,
      "Formul\xE4r-texter:",
      -1
      /* HOISTED */
    )),
    _createElementVNode2("div", _hoisted_12, [
      _createElementVNode2("div", _hoisted_2, [
        _withDirectives2((_openBlock2(), _createBlock2(_component_f_text_field, {
          modelValue: _ctx.exampleOptions.errorMessageTitleForm,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.exampleOptions.errorMessageTitleForm = $event)
        }, {
          default: _withCtx2(() => _cache[29] || (_cache[29] = [
            _createTextVNode2(" Titel f\xF6r samlingsfel i Formul\xE4r: ")
          ])),
          _: 1
          /* STABLE */
        }, 8, ["modelValue"])), [
          [
            _directive_validation,
            { maxLength: { length: 100 } },
            void 0,
            { maxLength: true }
          ]
        ])
      ]),
      _createElementVNode2("div", _hoisted_3, [
        _withDirectives2((_openBlock2(), _createBlock2(_component_f_text_field, {
          modelValue: _ctx.exampleOptions.errorMessageForm,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => _ctx.exampleOptions.errorMessageForm = $event)
        }, {
          default: _withCtx2(() => _cache[30] || (_cache[30] = [
            _createTextVNode2(" Ledtext f\xF6r samlingsfel i Formul\xE4r: ")
          ])),
          _: 1
          /* STABLE */
        }, 8, ["modelValue"])), [
          [
            _directive_validation,
            { maxLength: { length: 100 } },
            void 0,
            { maxLength: true }
          ]
        ])
      ])
    ]),
    _createElementVNode2("div", _hoisted_4, [
      _createElementVNode2("div", _hoisted_5, [
        _withDirectives2((_openBlock2(), _createBlock2(_component_f_text_field, {
          modelValue: _ctx.exampleOptions.errorMessageFormStep,
          "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => _ctx.exampleOptions.errorMessageFormStep = $event)
        }, {
          default: _withCtx2(() => _cache[31] || (_cache[31] = [
            _createTextVNode2(" Ledtext f\xF6r fellista i Formul\xE4rsteg: ")
          ])),
          _: 1
          /* STABLE */
        }, 8, ["modelValue"])), [
          [
            _directive_validation,
            { maxLength: { length: 100 } },
            void 0,
            { maxLength: true }
          ]
        ])
      ]),
      _createElementVNode2("div", _hoisted_6, [
        _withDirectives2((_openBlock2(), _createBlock2(_component_f_text_field, {
          modelValue: _ctx.exampleOptions.dataMissing,
          "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => _ctx.exampleOptions.dataMissing = $event)
        }, {
          default: _withCtx2(() => _cache[32] || (_cache[32] = [
            _createTextVNode2(" Text f\xF6r n\xE4r uppgifter/data saknas: ")
          ])),
          _: 1
          /* STABLE */
        }, 8, ["modelValue"])), [
          [
            _directive_validation,
            { maxLength: { length: 100 } },
            void 0,
            { maxLength: true }
          ]
        ])
      ])
    ]),
    _cache[81] || (_cache[81] = _createElementVNode2(
      "h3",
      null,
      "Formul\xE4r-alternativ:",
      -1
      /* HOISTED */
    )),
    _createVNode2(_component_f_fieldset, { name: "form-options-checkbox-group" }, {
      label: _withCtx2(() => _cache[33] || (_cache[33] = [
        _createTextVNode2(" Felmeddelandevisning ")
      ])),
      default: _withCtx2(() => [
        _createVNode2(_component_f_checkbox_field, {
          modelValue: _ctx.exampleOptions.displayError,
          "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => _ctx.exampleOptions.displayError = $event),
          value: true
        }, {
          default: _withCtx2(() => _cache[34] || (_cache[34] = [
            _createTextVNode2(" Visa samlingsfel ")
          ])),
          _: 1
          /* STABLE */
        }, 8, ["modelValue"])
      ]),
      _: 1
      /* STABLE */
    }),
    _createVNode2(_component_f_fieldset, {
      name: "form-error-scroll-radio-group",
      horizontal: ""
    }, {
      label: _withCtx2(() => _cache[35] || (_cache[35] = [
        _createTextVNode2(" Fokusscroll vid valideringsfel: ")
      ])),
      default: _withCtx2(() => [
        _createVNode2(_component_f_radio_field, {
          modelValue: _ctx.exampleOptions.errorScroll,
          "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => _ctx.exampleOptions.errorScroll = $event),
          value: "center"
        }, {
          default: _withCtx2(() => _cache[36] || (_cache[36] = [
            _createTextVNode2(" Center ")
          ])),
          _: 1
          /* STABLE */
        }, 8, ["modelValue"]),
        _createVNode2(_component_f_radio_field, {
          modelValue: _ctx.exampleOptions.errorScroll,
          "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => _ctx.exampleOptions.errorScroll = $event),
          value: "top"
        }, {
          default: _withCtx2(() => _cache[37] || (_cache[37] = [
            _createTextVNode2(" Top ")
          ])),
          _: 1
          /* STABLE */
        }, 8, ["modelValue"])
      ]),
      _: 1
      /* STABLE */
    }),
    _createVNode2(_component_f_fieldset, {
      name: "form-number-of-steps-radio-group",
      horizontal: ""
    }, {
      label: _withCtx2(() => _cache[38] || (_cache[38] = [
        _createTextVNode2(" Antal steg i exempel: ")
      ])),
      default: _withCtx2(() => [
        _createVNode2(_component_f_radio_field, {
          modelValue: _ctx.exampleOptions.numberOfSteps,
          "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => _ctx.exampleOptions.numberOfSteps = $event),
          value: 1
        }, {
          default: _withCtx2(() => _cache[39] || (_cache[39] = [
            _createTextVNode2(" 1 ")
          ])),
          _: 1
          /* STABLE */
        }, 8, ["modelValue"]),
        _createVNode2(_component_f_radio_field, {
          modelValue: _ctx.exampleOptions.numberOfSteps,
          "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => _ctx.exampleOptions.numberOfSteps = $event),
          value: 2
        }, {
          default: _withCtx2(() => _cache[40] || (_cache[40] = [
            _createTextVNode2(" 2 ")
          ])),
          _: 1
          /* STABLE */
        }, 8, ["modelValue"])
      ]),
      _: 1
      /* STABLE */
    }),
    _cache[82] || (_cache[82] = _createElementVNode2(
      "hr",
      null,
      null,
      -1
      /* HOISTED */
    )),
    _cache[83] || (_cache[83] = _createElementVNode2(
      "h2",
      null,
      "\u{1F370} Frukt och s\xF6tsaksbidraget",
      -1
      /* HOISTED */
    )),
    _createVNode2(_component_f_form, {
      id: "fruits-and-sweets-form",
      "display-error": _ctx.exampleOptions.displayError,
      "error-scroll": _ctx.exampleOptions.errorScroll,
      onSubmit: _ctx.onSubmit
    }, {
      "error-message": _withCtx2(({ slotClass }) => [
        _createElementVNode2(
          "h2",
          {
            class: _normalizeClass2(slotClass)
          },
          _toDisplayString2(_ctx.exampleOptions.errorMessageTitleForm),
          3
          /* TEXT, CLASS */
        ),
        _createElementVNode2(
          "p",
          _hoisted_7,
          _toDisplayString2(_ctx.exampleOptions.errorMessageForm),
          1
          /* TEXT */
        )
      ]),
      default: _withCtx2(() => [
        _ctx.exampleOptions.numberOfSteps > 0 ? (_openBlock2(), _createBlock2(
          _component_f_form_step,
          {
            key: 0,
            id: "information-form-step"
          },
          _createSlots2({
            header: _withCtx2(({ slotClass, isValid }) => [
              _createElementVNode2(
                "h2",
                {
                  class: _normalizeClass2(slotClass)
                },
                "1. Uppgifter",
                2
                /* CLASS */
              ),
              isValid ? (_openBlock2(), _createElementBlock2("span", _hoisted_8, " Steget \xE4r korrekt ifyllt. ")) : _createCommentVNode2("v-if", true)
            ]),
            default: _withCtx2(({ toggleIsOpen, isOpen, isAnyFieldTouched }) => [
              _cache[62] || (_cache[62] = _createElementVNode2(
                "p",
                null,
                " H\xE4r fyller du i dina uppgifter som kommer anv\xE4ndas som hj\xE4lp inf\xF6r det slutgiltiga beslutet. Uppgifterna h\xE4r \xE4r generella och anv\xE4nds f\xF6r att f\xE5 en uppfattning av dig som s\xF6kande. ",
                -1
                /* HOISTED */
              )),
              _withDirectives2(_createElementVNode2(
                "div",
                null,
                [
                  _withDirectives2((_openBlock2(), _createBlock2(_component_f_text_field, {
                    modelValue: _ctx.formData.firstName,
                    "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => _ctx.formData.firstName = $event)
                  }, {
                    default: _withCtx2(() => _cache[41] || (_cache[41] = [
                      _createTextVNode2(" F\xF6rnamn ")
                    ])),
                    _: 1
                    /* STABLE */
                  }, 8, ["modelValue"])), [
                    [
                      _directive_validation,
                      {
                        minLength: { length: 1 },
                        maxLength: { length: 40 }
                      },
                      void 0,
                      {
                        required: true,
                        minLength: true,
                        maxLength: true
                      }
                    ]
                  ]),
                  _withDirectives2((_openBlock2(), _createBlock2(_component_f_text_field, {
                    modelValue: _ctx.formData.lastName,
                    "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => _ctx.formData.lastName = $event)
                  }, {
                    default: _withCtx2(() => _cache[42] || (_cache[42] = [
                      _createTextVNode2(" Efternamn ")
                    ])),
                    _: 1
                    /* STABLE */
                  }, 8, ["modelValue"])), [
                    [
                      _directive_validation,
                      {
                        minLength: { length: 1 },
                        maxLength: { length: 100 }
                      },
                      void 0,
                      {
                        required: true,
                        minLength: true,
                        maxLength: true
                      }
                    ]
                  ]),
                  _withDirectives2(_createVNode2(_component_f_email_text_field, {
                    modelValue: _ctx.formData.email,
                    "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => _ctx.formData.email = $event)
                  }, null, 8, ["modelValue"]), [
                    [
                      _directive_validation,
                      void 0,
                      void 0,
                      { required: true }
                    ]
                  ]),
                  _withDirectives2(_createVNode2(_component_f_organisationsnummer_text_field, {
                    modelValue: _ctx.formData.orgnummer,
                    "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => _ctx.formData.orgnummer = $event)
                  }, null, 8, ["modelValue"]), [
                    [
                      _directive_validation,
                      void 0,
                      void 0,
                      { required: true }
                    ]
                  ]),
                  _withDirectives2(_createVNode2(_component_f_phone_text_field, {
                    modelValue: _ctx.formData.phone,
                    "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => _ctx.formData.phone = $event)
                  }, null, 8, ["modelValue"]), [
                    [
                      _directive_validation,
                      void 0,
                      void 0,
                      { required: true }
                    ]
                  ]),
                  _withDirectives2((_openBlock2(), _createBlock2(_component_f_select_field, {
                    modelValue: _ctx.formData.age,
                    "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => _ctx.formData.age = $event)
                  }, {
                    label: _withCtx2(() => _cache[43] || (_cache[43] = [
                      _createTextVNode2(" \xC5lder ")
                    ])),
                    default: _withCtx2(() => [
                      _cache[44] || (_cache[44] = _createElementVNode2(
                        "option",
                        {
                          disabled: "",
                          hidden: "",
                          value: ""
                        },
                        "V\xE4lj \xE5lder...",
                        -1
                        /* HOISTED */
                      )),
                      (_openBlock2(), _createElementBlock2(
                        _Fragment,
                        null,
                        _renderList(200, (age) => {
                          return _createElementVNode2("option", {
                            key: age,
                            value: age
                          }, _toDisplayString2(age), 9, _hoisted_9);
                        }),
                        64
                        /* STABLE_FRAGMENT */
                      ))
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
                  _withDirectives2((_openBlock2(), _createBlock2(_component_f_fieldset, { name: "martial-status-radio-group" }, {
                    label: _withCtx2(() => _cache[45] || (_cache[45] = [
                      _createTextVNode2(" Civiltillst\xE5nd ")
                    ])),
                    tooltip: _withCtx2(() => [
                      _createVNode2(_component_f_tooltip, { "screen-reader-text": "L\xE4s mer om civiltillst\xE5nd" }, {
                        header: _withCtx2(() => _cache[46] || (_cache[46] = [
                          _createTextVNode2(" Civiltillst\xE5nd ")
                        ])),
                        body: _withCtx2(() => _cache[47] || (_cache[47] = [
                          _createTextVNode2(" Avser vilket registrerat civiltillst\xE5nd som finns i Skatteverkets uppgifter. ")
                        ])),
                        _: 1
                        /* STABLE */
                      })
                    ]),
                    default: _withCtx2(({ indentClass }) => [
                      _createVNode2(_component_f_radio_field, {
                        modelValue: _ctx.formData.martialStatus,
                        "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => _ctx.formData.martialStatus = $event),
                        value: "SINGEL"
                      }, {
                        default: _withCtx2(() => _cache[48] || (_cache[48] = [
                          _createTextVNode2(" Singel ")
                        ])),
                        _: 1
                        /* STABLE */
                      }, 8, ["modelValue"]),
                      _createVNode2(_component_f_radio_field, {
                        modelValue: _ctx.formData.martialStatus,
                        "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => _ctx.formData.martialStatus = $event),
                        value: "SAMBO"
                      }, {
                        default: _withCtx2(() => _cache[49] || (_cache[49] = [
                          _createTextVNode2(" Sambo ")
                        ])),
                        _: 1
                        /* STABLE */
                      }, 8, ["modelValue"]),
                      _createVNode2(_component_f_radio_field, {
                        modelValue: _ctx.formData.martialStatus,
                        "onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => _ctx.formData.martialStatus = $event),
                        value: "GIFT"
                      }, {
                        default: _withCtx2(() => _cache[50] || (_cache[50] = [
                          _createTextVNode2(" Gift ")
                        ])),
                        _: 1
                        /* STABLE */
                      }, 8, ["modelValue"]),
                      _createVNode2(_component_f_radio_field, {
                        modelValue: _ctx.formData.martialStatus,
                        "onUpdate:modelValue": _cache[18] || (_cache[18] = ($event) => _ctx.formData.martialStatus = $event),
                        value: "ANNAT"
                      }, {
                        default: _withCtx2(() => _cache[51] || (_cache[51] = [
                          _createTextVNode2(" Annat ")
                        ])),
                        _: 1
                        /* STABLE */
                      }, 8, ["modelValue"]),
                      _ctx.formData.martialStatus === "ANNAT" ? (_openBlock2(), _createBlock2(_component_f_fieldset, {
                        key: 0,
                        class: _normalizeClass2(indentClass),
                        name: "martial-status-other-radio-group",
                        onChange: _ctx.onChangeResetMartialStatusOther
                      }, {
                        label: _withCtx2(() => _cache[52] || (_cache[52] = [])),
                        default: _withCtx2(() => [
                          _withDirectives2((_openBlock2(), _createBlock2(_component_f_text_field, {
                            modelValue: _ctx.formData.martialStatusOther,
                            "onUpdate:modelValue": _cache[19] || (_cache[19] = ($event) => _ctx.formData.martialStatusOther = $event)
                          }, {
                            description: _withCtx2(({ descriptionClass }) => [
                              _createElementVNode2(
                                "span",
                                {
                                  class: _normalizeClass2(descriptionClass)
                                },
                                ' Fyll i vad "Annat" betyder f\xF6r dig. ',
                                2
                                /* CLASS */
                              )
                            ]),
                            default: _withCtx2(() => [
                              _cache[53] || (_cache[53] = _createTextVNode2(" Annat "))
                            ]),
                            _: 1
                            /* STABLE */
                          }, 8, ["modelValue"])), [
                            [
                              _directive_validation,
                              {
                                minLength: { length: 1 },
                                maxLength: { length: 100 },
                                required: {
                                  enabled: _ctx.formData.martialStatus === "ANNAT"
                                }
                              },
                              void 0,
                              {
                                required: true,
                                minLength: true,
                                maxLength: true
                              }
                            ]
                          ])
                        ]),
                        _: 2
                        /* DYNAMIC */
                      }, 1032, ["class", "onChange"])) : _createCommentVNode2("v-if", true),
                      _createVNode2(_component_f_radio_field, {
                        modelValue: _ctx.formData.martialStatus,
                        "onUpdate:modelValue": _cache[20] || (_cache[20] = ($event) => _ctx.formData.martialStatus = $event),
                        value: "VILL_INTE_SVARA"
                      }, {
                        default: _withCtx2(() => _cache[54] || (_cache[54] = [
                          _createTextVNode2(" Vill inte svara ")
                        ])),
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
                  ])
                ],
                512
                /* NEED_PATCH */
              ), [
                [_vShow, isOpen]
              ]),
              _withDirectives2(_createElementVNode2(
                "div",
                null,
                [
                  _createElementVNode2("div", _hoisted_10, [
                    _createElementVNode2("div", _hoisted_11, [
                      _createVNode2(_component_f_static_field, null, {
                        label: _withCtx2(() => _cache[55] || (_cache[55] = [
                          _createTextVNode2(" F\xF6rnamn ")
                        ])),
                        default: _withCtx2(() => [
                          _createTextVNode2(
                            " " + _toDisplayString2(_ctx.formData.firstName || _ctx.exampleOptions.dataMissing),
                            1
                            /* TEXT */
                          )
                        ]),
                        _: 1
                        /* STABLE */
                      })
                    ])
                  ]),
                  _createElementVNode2("div", _hoisted_122, [
                    _createElementVNode2("div", _hoisted_13, [
                      _createVNode2(_component_f_static_field, null, {
                        label: _withCtx2(() => _cache[56] || (_cache[56] = [
                          _createTextVNode2(" Efternamn ")
                        ])),
                        default: _withCtx2(() => [
                          _createTextVNode2(
                            " " + _toDisplayString2(_ctx.formData.lastName || _ctx.exampleOptions.dataMissing),
                            1
                            /* TEXT */
                          )
                        ]),
                        _: 1
                        /* STABLE */
                      })
                    ])
                  ]),
                  _createElementVNode2("div", _hoisted_14, [
                    _createElementVNode2("div", _hoisted_15, [
                      _createVNode2(_component_f_static_field, null, {
                        label: _withCtx2(() => _cache[57] || (_cache[57] = [
                          _createTextVNode2(" Mejladress ")
                        ])),
                        default: _withCtx2(() => [
                          _createTextVNode2(
                            " " + _toDisplayString2(_ctx.formData.email || _ctx.exampleOptions.dataMissing),
                            1
                            /* TEXT */
                          )
                        ]),
                        _: 1
                        /* STABLE */
                      })
                    ])
                  ]),
                  _createElementVNode2("div", _hoisted_16, [
                    _createElementVNode2("div", _hoisted_17, [
                      _createVNode2(_component_f_static_field, null, {
                        label: _withCtx2(() => _cache[58] || (_cache[58] = [
                          _createTextVNode2(" Organisationsnummer ")
                        ])),
                        default: _withCtx2(() => [
                          _createTextVNode2(
                            " " + _toDisplayString2(_ctx.formData.orgnummer || _ctx.exampleOptions.dataMissing),
                            1
                            /* TEXT */
                          )
                        ]),
                        _: 1
                        /* STABLE */
                      })
                    ])
                  ]),
                  _createElementVNode2("div", _hoisted_18, [
                    _createElementVNode2("div", _hoisted_19, [
                      _createVNode2(_component_f_static_field, null, {
                        label: _withCtx2(() => _cache[59] || (_cache[59] = [
                          _createTextVNode2(" Telefonnummer ")
                        ])),
                        default: _withCtx2(() => [
                          _createTextVNode2(
                            " " + _toDisplayString2(_ctx.formData.phone || _ctx.exampleOptions.dataMissing),
                            1
                            /* TEXT */
                          )
                        ]),
                        _: 1
                        /* STABLE */
                      })
                    ])
                  ]),
                  _createElementVNode2("div", _hoisted_20, [
                    _createElementVNode2("div", _hoisted_21, [
                      _createVNode2(_component_f_static_field, null, {
                        label: _withCtx2(() => _cache[60] || (_cache[60] = [
                          _createTextVNode2(" \xC5lder ")
                        ])),
                        default: _withCtx2(() => [
                          _createTextVNode2(
                            " " + _toDisplayString2(_ctx.formData.age || _ctx.exampleOptions.dataMissing),
                            1
                            /* TEXT */
                          )
                        ]),
                        _: 1
                        /* STABLE */
                      })
                    ])
                  ]),
                  _createVNode2(_component_f_static_field, null, {
                    label: _withCtx2(() => _cache[61] || (_cache[61] = [
                      _createTextVNode2(" Civiltillst\xE5nd ")
                    ])),
                    default: _withCtx2(() => [
                      _createTextVNode2(
                        " " + _toDisplayString2(_ctx.martialStatusText || _ctx.exampleOptions.dataMissing),
                        1
                        /* TEXT */
                      )
                    ]),
                    _: 1
                    /* STABLE */
                  })
                ],
                512
                /* NEED_PATCH */
              ), [
                [_vShow, !isOpen]
              ]),
              _createVNode2(_component_f_form_step_button, {
                "is-open": isOpen,
                "is-any-field-touched": isAnyFieldTouched,
                onClick: toggleIsOpen
              }, null, 8, ["is-open", "is-any-field-touched", "onClick"])
            ]),
            _: 2
            /* DYNAMIC */
          }, [
            _ctx.exampleOptions.errorMessageFormStep ? {
              name: "error-message",
              fn: _withCtx2(() => [
                _createElementVNode2(
                  "p",
                  null,
                  _toDisplayString2(_ctx.exampleOptions.errorMessageFormStep),
                  1
                  /* TEXT */
                )
              ]),
              key: "0"
            } : void 0
          ]),
          1024
          /* DYNAMIC_SLOTS */
        )) : _createCommentVNode2("v-if", true),
        (_openBlock2(true), _createElementBlock2(
          _Fragment,
          null,
          _renderList(_ctx.costs, (cost, index) => {
            return _openBlock2(), _createBlock2(_component_example_kostnad, {
              key: index,
              "form-step-id": index,
              kostnad: cost
            }, null, 8, ["form-step-id", "kostnad"]);
          }),
          128
          /* KEYED_FRAGMENT */
        )),
        _createElementVNode2("button", {
          type: "button",
          class: "button button-group__item button--discrete",
          onClick: _cache[21] || (_cache[21] = (...args) => _ctx.laggTillContainer && _ctx.laggTillContainer(...args))
        }, [
          _createVNode2(_component_f_icon, {
            name: "plus",
            class: "button__icon"
          }),
          _cache[63] || (_cache[63] = _createTextVNode2(" L\xE4gg till container "))
        ]),
        _ctx.exampleOptions.numberOfSteps > 1 ? (_openBlock2(), _createBlock2(
          _component_f_form_step,
          {
            key: 1,
            id: "consumption-form-step",
            "has-arrow": false,
            "is-last-step": ""
          },
          _createSlots2({
            header: _withCtx2(({ slotClass, isValid }) => [
              _createElementVNode2(
                "h2",
                {
                  class: _normalizeClass2(slotClass)
                },
                _toDisplayString2(_ctx.containerTitle),
                3
                /* TEXT, CLASS */
              ),
              isValid ? (_openBlock2(), _createElementBlock2("span", _hoisted_22, " Steget \xE4r korrekt ifyllt. ")) : _createCommentVNode2("v-if", true)
            ]),
            default: _withCtx2(({ toggleIsOpen, isOpen, isAnyFieldTouched }) => [
              _cache[74] || (_cache[74] = _createElementVNode2(
                "p",
                null,
                ' H\xE4r fyller du i och g\xF6r val om vad f\xF6r frukter och s\xF6tsaker du brukar konsumera. Med "brukar" s\xE5 syftar vi p\xE5 vad du konsumerar under vardagar och helger n\xE4r du som vanligt jobbar, studerar eller g\xF6r n\xE5gon annan syssels\xE4ttning p\xE5 mer \xE4n 50 procent. Exkludera vad du konsumerar under ledighet. ',
                -1
                /* HOISTED */
              )),
              _withDirectives2(_createElementVNode2(
                "div",
                null,
                [
                  _createElementVNode2("div", _hoisted_23, [
                    _createElementVNode2("div", _hoisted_24, [
                      _withDirectives2((_openBlock2(), _createBlock2(_component_f_select_field, {
                        modelValue: _ctx.formData.fruitsPerWeek,
                        "onUpdate:modelValue": _cache[22] || (_cache[22] = ($event) => _ctx.formData.fruitsPerWeek = $event)
                      }, {
                        label: _withCtx2(() => _cache[64] || (_cache[64] = [
                          _createTextVNode2(" Frukt ")
                        ])),
                        description: _withCtx2(({ descriptionClass }) => [
                          _createElementVNode2(
                            "span",
                            {
                              class: _normalizeClass2(descriptionClass)
                            },
                            " Fyll i antal g\xE5nger du konsumerar frukt under en vecka. ",
                            2
                            /* CLASS */
                          )
                        ]),
                        default: _withCtx2(() => [
                          (_openBlock2(), _createElementBlock2(
                            _Fragment,
                            null,
                            _renderList(100, (number) => {
                              return _createElementVNode2("option", {
                                key: number,
                                value: number
                              }, _toDisplayString2(number) + " " + _toDisplayString2(number === 1 ? "g\xE5ng" : "g\xE5nger"), 9, _hoisted_25);
                            }),
                            64
                            /* STABLE_FRAGMENT */
                          ))
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
                      ])
                    ])
                  ]),
                  _createElementVNode2("div", _hoisted_26, [
                    _createElementVNode2("div", _hoisted_27, [
                      _withDirectives2((_openBlock2(), _createBlock2(_component_f_select_field, {
                        modelValue: _ctx.formData.sweetsPerWeek,
                        "onUpdate:modelValue": _cache[23] || (_cache[23] = ($event) => _ctx.formData.sweetsPerWeek = $event)
                      }, {
                        label: _withCtx2(() => _cache[65] || (_cache[65] = [
                          _createTextVNode2(" S\xF6tsaker ")
                        ])),
                        description: _withCtx2(({ descriptionClass }) => [
                          _createElementVNode2(
                            "span",
                            {
                              class: _normalizeClass2(descriptionClass)
                            },
                            " Fyll i antal g\xE5nger du konsumerar s\xF6tsaker under en vecka. ",
                            2
                            /* CLASS */
                          )
                        ]),
                        default: _withCtx2(() => [
                          (_openBlock2(), _createElementBlock2(
                            _Fragment,
                            null,
                            _renderList(100, (number) => {
                              return _createElementVNode2("option", {
                                key: number,
                                value: number
                              }, _toDisplayString2(number) + " " + _toDisplayString2(number === 1 ? "g\xE5ng" : "g\xE5nger"), 9, _hoisted_28);
                            }),
                            64
                            /* STABLE_FRAGMENT */
                          ))
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
                      ])
                    ])
                  ]),
                  _withDirectives2((_openBlock2(), _createBlock2(_component_f_fieldset, { name: "consumed-fruits-radio-group" }, {
                    label: _withCtx2(() => _cache[66] || (_cache[66] = [
                      _createTextVNode2(" Vilka frukter brukar du konsumera? ")
                    ])),
                    default: _withCtx2(() => [
                      (_openBlock2(true), _createElementBlock2(
                        _Fragment,
                        null,
                        _renderList(_ctx.renderData.fruits, (fruit) => {
                          return _openBlock2(), _createBlock2(_component_f_checkbox_field, {
                            key: fruit.value,
                            modelValue: _ctx.formData.consumedFruits,
                            "onUpdate:modelValue": _cache[24] || (_cache[24] = ($event) => _ctx.formData.consumedFruits = $event),
                            value: fruit.value
                          }, {
                            default: _withCtx2(() => [
                              _createTextVNode2(
                                _toDisplayString2(fruit.text),
                                1
                                /* TEXT */
                              )
                            ]),
                            _: 2
                            /* DYNAMIC */
                          }, 1032, ["modelValue", "value"]);
                        }),
                        128
                        /* KEYED_FRAGMENT */
                      ))
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
                  _withDirectives2((_openBlock2(), _createBlock2(_component_f_fieldset, { name: "consumed-sweets-radio-group" }, {
                    label: _withCtx2(() => _cache[67] || (_cache[67] = [
                      _createTextVNode2(" Vilka s\xF6tsaker brukar du konsumera? ")
                    ])),
                    default: _withCtx2(() => [
                      (_openBlock2(true), _createElementBlock2(
                        _Fragment,
                        null,
                        _renderList(_ctx.renderData.sweets, (sweet) => {
                          return _openBlock2(), _createBlock2(_component_f_checkbox_field, {
                            key: sweet.value,
                            modelValue: _ctx.formData.consumedSweets,
                            "onUpdate:modelValue": _cache[25] || (_cache[25] = ($event) => _ctx.formData.consumedSweets = $event),
                            value: sweet.value
                          }, {
                            default: _withCtx2(() => [
                              _createTextVNode2(
                                _toDisplayString2(sweet.text),
                                1
                                /* TEXT */
                              )
                            ]),
                            _: 2
                            /* DYNAMIC */
                          }, 1032, ["modelValue", "value"]);
                        }),
                        128
                        /* KEYED_FRAGMENT */
                      ))
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
                  _createVNode2(_component_f_textarea_field, {
                    modelValue: _ctx.formData.consumptionDescription,
                    "onUpdate:modelValue": _cache[26] || (_cache[26] = ($event) => _ctx.formData.consumptionDescription = $event),
                    maxlength: 400,
                    "soft-limit": 150
                  }, {
                    description: _withCtx2(({ descriptionClass, discreteDescriptionClass }) => [
                      _createElementVNode2(
                        "span",
                        {
                          class: _normalizeClass2(descriptionClass)
                        },
                        " Fyll i hur du uppfattar din konsumption av frukter och s\xF6tsaker. Det kan till exempel vara hur den f\xF6rgyller din vardag eller hur det st\xE4ller till med problem, f\xF6rhoppningsvis det f\xF6rstn\xE4mnda. ",
                        2
                        /* CLASS */
                      ),
                      _createElementVNode2(
                        "span",
                        {
                          class: _normalizeClass2(discreteDescriptionClass)
                        },
                        "(Max 400 tecken)",
                        2
                        /* CLASS */
                      )
                    ]),
                    default: _withCtx2(() => [
                      _cache[68] || (_cache[68] = _createTextVNode2(" Beskrivning av konsumption (frivilligt) "))
                    ]),
                    _: 1
                    /* STABLE */
                  }, 8, ["modelValue"])
                ],
                512
                /* NEED_PATCH */
              ), [
                [_vShow, isOpen]
              ]),
              _withDirectives2(_createElementVNode2(
                "div",
                null,
                [
                  _createVNode2(_component_f_static_field, null, {
                    label: _withCtx2(() => _cache[69] || (_cache[69] = [
                      _createTextVNode2(" Frukt konsumption ")
                    ])),
                    default: _withCtx2(() => [
                      _createTextVNode2(
                        " " + _toDisplayString2(_ctx.fruitsPerWeekText || _ctx.exampleOptions.dataMissing),
                        1
                        /* TEXT */
                      )
                    ]),
                    _: 1
                    /* STABLE */
                  }),
                  _createVNode2(_component_f_static_field, null, {
                    label: _withCtx2(() => _cache[70] || (_cache[70] = [
                      _createTextVNode2(" S\xF6tsak konsumption ")
                    ])),
                    default: _withCtx2(() => [
                      _createTextVNode2(
                        " " + _toDisplayString2(_ctx.sweetsPerWeekText || _ctx.exampleOptions.dataMissing),
                        1
                        /* TEXT */
                      )
                    ]),
                    _: 1
                    /* STABLE */
                  }),
                  _createVNode2(_component_f_static_field, null, {
                    label: _withCtx2(() => _cache[71] || (_cache[71] = [
                      _createTextVNode2(" Vilka frukter brukar du konsumera? ")
                    ])),
                    default: _withCtx2(() => [
                      _createTextVNode2(
                        " " + _toDisplayString2(_ctx.consumedFruitsText || _ctx.exampleOptions.dataMissing),
                        1
                        /* TEXT */
                      )
                    ]),
                    _: 1
                    /* STABLE */
                  }),
                  _createVNode2(_component_f_static_field, null, {
                    label: _withCtx2(() => _cache[72] || (_cache[72] = [
                      _createTextVNode2(" Vilka s\xF6tsaker brukar du konsumera? ")
                    ])),
                    default: _withCtx2(() => [
                      _createTextVNode2(
                        " " + _toDisplayString2(_ctx.consumedSweetsText || _ctx.exampleOptions.dataMissing),
                        1
                        /* TEXT */
                      )
                    ]),
                    _: 1
                    /* STABLE */
                  }),
                  _createVNode2(_component_f_static_field, null, {
                    label: _withCtx2(() => _cache[73] || (_cache[73] = [
                      _createTextVNode2(" Beskrivning av komsuption ")
                    ])),
                    default: _withCtx2(() => [
                      _createTextVNode2(
                        " " + _toDisplayString2(_ctx.formData.consumptionDescription || _ctx.exampleOptions.dataMissing),
                        1
                        /* TEXT */
                      )
                    ]),
                    _: 1
                    /* STABLE */
                  })
                ],
                512
                /* NEED_PATCH */
              ), [
                [_vShow, !isOpen]
              ]),
              _createVNode2(_component_f_form_step_button, {
                "is-open": isOpen,
                "is-any-field-touched": isAnyFieldTouched,
                "additional-screenreader-text": "steg f\xF6r konsumption",
                onClick: toggleIsOpen
              }, null, 8, ["is-open", "is-any-field-touched", "onClick"])
            ]),
            _: 2
            /* DYNAMIC */
          }, [
            _ctx.exampleOptions.errorMessageFormStep ? {
              name: "error-message",
              fn: _withCtx2(() => [
                _createElementVNode2(
                  "p",
                  null,
                  _toDisplayString2(_ctx.exampleOptions.errorMessageFormStep),
                  1
                  /* TEXT */
                )
              ]),
              key: "0"
            } : void 0
          ]),
          1024
          /* DYNAMIC_SLOTS */
        )) : _createCommentVNode2("v-if", true),
        _withDirectives2((_openBlock2(), _createBlock2(_component_f_fieldset, { name: "signing-checkbox-group" }, {
          label: _withCtx2(() => _cache[75] || (_cache[75] = [
            _createElementVNode2(
              "h3",
              null,
              "Underskrift",
              -1
              /* HOISTED */
            )
          ])),
          default: _withCtx2(() => [
            _createVNode2(_component_f_checkbox_field, {
              modelValue: _ctx.formData.hasSigned,
              "onUpdate:modelValue": _cache[27] || (_cache[27] = ($event) => _ctx.formData.hasSigned = $event),
              value: true
            }, {
              default: _withCtx2(() => _cache[76] || (_cache[76] = [
                _createTextVNode2(" Jag bekr\xE4ftar p\xE5 heder och samvete att alla uppgifter jag l\xE4mnat st\xE4mmer och \xE4r korrekt ifyllda. ")
              ])),
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
        _createElementVNode2("div", _hoisted_29, [
          _cache[77] || (_cache[77] = _createElementVNode2(
            "button",
            {
              class: "button-group__item button button--primary",
              type: "submit"
            },
            " Signera ",
            -1
            /* HOISTED */
          )),
          _createElementVNode2("button", {
            class: "button-group__item button button--secondary",
            type: "button",
            onClick: _cache[28] || (_cache[28] = (...args) => _ctx.onClickClearFormData && _ctx.onClickClearFormData(...args))
          }, " Rensa formul\xE4rdata ")
        ])
      ]),
      _: 1
      /* STABLE */
    }, 8, ["display-error", "error-scroll", "onSubmit"])
  ]);
}
exampleComponent.render = render2;
setup({
  rootComponent: exampleComponent,
  selector: "#FFormExample"
});
export {
  render2 as render
};
