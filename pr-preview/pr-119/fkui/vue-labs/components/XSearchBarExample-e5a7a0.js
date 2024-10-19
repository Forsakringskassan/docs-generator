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
  app.use(ErrorPlugin);
  app.use(ValidationPlugin);
  app.use(TestPlugin);
  app.use(TranslationPlugin);
  app.mount(selector);
  setRunningContext(app);
}

// virtual-entry:./src/components/XSearchBar/examples/XSearchBarExample.vue
import { FValidationForm } from "@fkui/vue";

// dist/esm/index.esm.js
import { isEmpty, stripWhitespace, TranslationService, isSet, ValidationService } from "@fkui/logic";
import { defineComponent, inject, resolveComponent, openBlock, createBlock, withCtx, renderSlot, createElementVNode, createVNode, createTextVNode } from "vue";
import { FTextField, TranslationMixin, FIcon, FSearchTextField } from "@fkui/vue";
var HOURS_MINUTES_REGEXP = /^(?<hours>[0-9]+)?(:(?<minutes>[0-5][0-9]))?$/;
var HOURS_MINUTES_WITHOUT_COLON_REGEXP = /^(?<hours>[0-9]{2})(?<minutes>[0-5][0-9])$/;
function findMatch(regexps, value) {
  for (const regexp of regexps) {
    const match = value.match(regexp);
    if (match) {
      return match;
    }
  }
  return null;
}
function padInitialZeros(value, maxLength = 2) {
  var _value;
  value = (_value = value) !== null && _value !== void 0 ? _value : "";
  return value.padStart(maxLength, "0");
}
function hoursMinutesStringToMinutes(valueString, extraForgiving = false) {
  if (isEmpty(valueString.trim())) {
    return void 0;
  }
  const [hours, minutes] = splitHoursMinutes(valueString, extraForgiving).map((value) => parseInt(value, 10));
  const totalMinutes = hours * 60 + minutes;
  return !isNaN(totalMinutes) ? totalMinutes : void 0;
}
function minutesToHoursMinutesString(value) {
  let valueString = "";
  const safeValue = value !== null && value !== void 0 ? value : NaN;
  if (!isNaN(safeValue)) {
    const {
      hours,
      minutes
    } = minutesToObject(safeValue);
    valueString = [hours, minutes].map((value2) => String(value2).padStart(2, "0")).join(":");
  }
  return stripWhitespace(valueString);
}
function splitHoursMinutes(valueString, extraForgiving = false) {
  var _a, _b;
  const regexps = extraForgiving ? [HOURS_MINUTES_WITHOUT_COLON_REGEXP, HOURS_MINUTES_REGEXP] : [HOURS_MINUTES_REGEXP];
  const match = findMatch(regexps, stripWhitespace(valueString));
  if (!match) {
    return ["", ""];
  }
  const hours = padInitialZeros((_a = match == null ? void 0 : match.groups) == null ? void 0 : _a.hours);
  const minutes = padInitialZeros((_b = match == null ? void 0 : match.groups) == null ? void 0 : _b.minutes);
  return [hours, minutes];
}
function minutesToObject(...values) {
  const minutes = values.filter((value) => isSet(value) && !isNaN(value)).reduce((sum, value) => sum + value, 0);
  return {
    hours: Math.floor(minutes / 60),
    minutes: minutes % 60
  };
}
function formatNumberToTime(value) {
  if (typeof value !== "number" || isNaN(value)) {
    return void 0;
  }
  return minutesToHoursMinutesString(value);
}
function parseTimeToNumberUsingConfig(value, extraForgiving) {
  var _hoursMinutesStringTo;
  if (typeof value !== "string") {
    return void 0;
  }
  const parsedValue = (_hoursMinutesStringTo = hoursMinutesStringToMinutes(value, extraForgiving)) !== null && _hoursMinutesStringTo !== void 0 ? _hoursMinutesStringTo : NaN;
  return !isNaN(parsedValue) ? parsedValue : void 0;
}
function parseTimeToNumber(value) {
  return parseTimeToNumberUsingConfig(value, false);
}
var HoursMinutesValidatorUtils = class _HoursMinutesValidatorUtils {
  static validate(value, config, name, compare) {
    if (value === "") {
      return true;
    }
    const limit = config[name];
    if (!isSet(limit)) {
      return false;
    }
    const parseFunction = _HoursMinutesValidatorUtils.getParserFromConfig(config);
    const limitAsNumber = parseFunction(String(config[name]));
    if (!isSet(limitAsNumber)) {
      throw new Error(`config.${name} must be a number`);
    }
    const valueAsNumber = parseFunction(value);
    if (!isSet(valueAsNumber)) {
      return false;
    }
    return compare(valueAsNumber, limitAsNumber);
  }
  static getParserFromConfig(config) {
    var _a;
    if (!isSet(config) || !Array.isArray(config.parser) || !isSet((_a = config.parser) == null ? void 0 : _a[0]) || typeof config.parser[0] !== "function") {
      return parseTimeToNumber;
    }
    return config.parser[0];
  }
};
var hoursMinutesValidator = {
  name: "hoursMinutes",
  validation(value, _element, config) {
    return isEmpty(value) || isSet(HoursMinutesValidatorUtils.getParserFromConfig(config)(value));
  }
};
var greaterThanTimeValidator = {
  name: "greaterThanTime",
  validation(value, _element, config) {
    return HoursMinutesValidatorUtils.validate(value, config, "limit", (value2, limit) => {
      return value2 > limit;
    });
  }
};
var lessThanTimeValidator = {
  name: "lessThanTime",
  validation(value, _element, config) {
    return HoursMinutesValidatorUtils.validate(value, config, "limit", (value2, limit) => {
      return value2 < limit;
    });
  }
};
var maxTimeValidator = {
  name: "maxTime",
  validation(value, _element, config) {
    return HoursMinutesValidatorUtils.validate(value, config, this.name, (value2, limit) => {
      return value2 <= limit;
    });
  }
};
var minTimeValidator = {
  name: "minTime",
  validation(value, _element, config) {
    return HoursMinutesValidatorUtils.validate(value, config, this.name, (value2, limit) => {
      return value2 >= limit;
    });
  }
};
var validators = [hoursMinutesValidator, greaterThanTimeValidator, lessThanTimeValidator, maxTimeValidator, minTimeValidator];
for (const validator of validators) {
  ValidationService.registerValidator(validator);
}
var _sfc_main$1 = defineComponent({
  name: "XTimeTextField",
  extends: FTextField,
  mixins: [TranslationMixin],
  props: {
    formatter: {
      type: Function,
      required: false,
      default: formatNumberToTime
    },
    parser: {
      type: Function,
      required: false,
      default: parseTimeToNumber
    }
  },
  setup() {
    return {
      textFieldTableMode: inject("textFieldTableMode", false)
    };
  },
  mounted() {
    const inputElement = this.$el.querySelector("input");
    if (!isSet(inputElement)) {
      throw new Error(`Could not find input element in XTimeTextField with id ${this.$el.id}`);
    }
    ValidationService.addValidatorsToElement(inputElement, {
      maxLength: {
        length: 10
      },
      hoursMinutes: {}
    }, true);
    inputElement.setAttribute("inputmode", "numeric");
    ValidationService.validateElement(inputElement);
  }
});
var _sfc_main = defineComponent({
  name: "XSearchBar",
  components: {
    FIcon,
    FSearchTextField
  },
  props: {
    modelValue: {
      type: String,
      required: true
    },
    maxLength: {
      type: Number,
      default: 20
    }
  },
  emits: ["update:modelValue", "changedValue"],
  computed: {
    value: {
      get() {
        return this.modelValue;
      },
      set(value) {
        if (this.value !== value) {
          this.$emit("changedValue", [this.value, value]);
        }
        this.$emit("update:modelValue", value);
      }
    }
  }
});
var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
var _hoisted_1 = {
  class: "button button--primary search-bar-button",
  type: "submit",
  "data-test": "search-bar-submit"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_f_icon = resolveComponent("f-icon");
  const _component_f_search_text_field = resolveComponent("f-search-text-field");
  return openBlock(), createBlock(_component_f_search_text_field, {
    modelValue: _ctx.value,
    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.value = $event),
    class: "x-search-bar",
    maxlength: _ctx.maxLength
  }, {
    default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
    tooltip: withCtx(() => [renderSlot(_ctx.$slots, "tooltip")]),
    "input-right": withCtx(() => [createElementVNode("button", _hoisted_1, [createVNode(_component_f_icon, {
      name: "search",
      library: "f"
    }), createTextVNode(), createElementVNode("span", null, [renderSlot(_ctx.$slots, "button-text", {}, () => [createTextVNode(" S\xF6k ")])])])]),
    _: 3
    /* FORWARDED */
  }, 8, ["modelValue", "maxlength"]);
}
var XSearchBar = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);

// virtual-entry:./src/components/XSearchBar/examples/XSearchBarExample.vue
import { defineComponent as defineComponent2 } from "vue";
import { createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, withCtx as _withCtx, createVNode as _createVNode, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue";
var exampleComponent = defineComponent2({
  name: "XSearchBarExample",
  components: {
    XSearchBar,
    FValidationForm
  },
  data() {
    return {
      value: ""
    };
  },
  methods: {
    submit() {
      alert(`Submit ${this.value}`);
    }
  }
});
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_x_search_bar = _resolveComponent("x-search-bar");
  const _component_f_validation_form = _resolveComponent("f-validation-form");
  return _openBlock(), _createElementBlock("div", null, [
    _createVNode(_component_f_validation_form, { onSubmit: _ctx.submit }, {
      default: _withCtx(() => [
        _createVNode(_component_x_search_bar, {
          modelValue: _ctx.value,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.value = $event)
        }, {
          default: _withCtx(() => [
            _createTextVNode(" S\xF6kf\xE4lt ")
          ]),
          _: 1
          /* STABLE */
        }, 8, ["modelValue"])
      ]),
      _: 1
      /* STABLE */
    }, 8, ["onSubmit"])
  ]);
}
exampleComponent.render = render;
setup({
  rootComponent: exampleComponent,
  selector: "#XSearchBarExample"
});
export {
  render
};
