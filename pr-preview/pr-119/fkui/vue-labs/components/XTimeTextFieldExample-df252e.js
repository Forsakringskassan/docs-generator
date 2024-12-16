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
function minutesToUserFriendlyString(value) {
  const [hours, minutes] = splitHoursMinutes(minutesToHoursMinutesString(value)).map(Number);
  return TranslationService.provider.translate("ARBE.RW.generell.etikett.timmarochminuter", "{{hours}} timmar och {{minutes}} minuter", {
    hours,
    minutes
  });
}
function minutesToHoursFloat(...values) {
  const minutes = values.filter((value) => isSet(value) && !isNaN(value)).reduce((sum, value) => sum + value, 0);
  return minutes / 60;
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

// virtual-entry:./src/components/XTimeTextField/examples/XTimeTextFieldExample.vue
import { defineComponent as defineComponent2 } from "vue";
import { normalizeClass as _normalizeClass, createElementVNode as _createElementVNode, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, resolveDirective as _resolveDirective, withCtx as _withCtx, openBlock as _openBlock, createBlock as _createBlock, withDirectives as _withDirectives, toDisplayString as _toDisplayString, createElementBlock as _createElementBlock } from "vue";
var exampleComponent = defineComponent2({
  name: "XTimeComponentExample",
  components: {
    XTimeTextField: _sfc_main$1
  },
  data() {
    return {
      time: void 0
    };
  },
  computed: {
    userFriendlyValue() {
      return minutesToUserFriendlyString(this.time);
    },
    timeInHours() {
      return minutesToHoursFloat(this.time);
    },
    timeAsObject() {
      return JSON.stringify(minutesToObject(this.time));
    }
  }
});
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_x_time_text_field = _resolveComponent("x-time-text-field");
  const _directive_validation = _resolveDirective("validation");
  return _openBlock(), _createElementBlock("div", null, [
    _withDirectives((_openBlock(), _createBlock(_component_x_time_text_field, {
      modelValue: _ctx.time,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.time = $event)
    }, {
      description: _withCtx(({ discreteDescriptionClass }) => [
        _createElementVNode(
          "span",
          {
            class: _normalizeClass(discreteDescriptionClass)
          },
          "(tt:mm)",
          2
          /* CLASS */
        )
      ]),
      default: _withCtx(() => [
        _cache[1] || (_cache[1] = _createTextVNode(" Ange arbetstid "))
      ]),
      _: 1
      /* STABLE */
    }, 8, ["modelValue"])), [
      [
        _directive_validation,
        {
          hoursMinutes: { errorMessage: "Du har skrivit in ett felaktigt tidformat" }
        },
        void 0,
        {
          required: true,
          hoursMinutes: true
        }
      ]
    ]),
    _createElementVNode("p", null, [
      _createTextVNode(
        " V\xE4rde: " + _toDisplayString(_ctx.time) + ".",
        1
        /* TEXT */
      ),
      _cache[2] || (_cache[2] = _createElementVNode(
        "br",
        null,
        null,
        -1
        /* HOISTED */
      )),
      _createTextVNode(
        " Renskrivet v\xE4rde: " + _toDisplayString(_ctx.userFriendlyValue) + ".",
        1
        /* TEXT */
      ),
      _cache[3] || (_cache[3] = _createElementVNode(
        "br",
        null,
        null,
        -1
        /* HOISTED */
      )),
      _createTextVNode(
        " V\xE4rde i timmar: " + _toDisplayString(_ctx.timeInHours) + ".",
        1
        /* TEXT */
      ),
      _cache[4] || (_cache[4] = _createElementVNode(
        "br",
        null,
        null,
        -1
        /* HOISTED */
      )),
      _createTextVNode(
        " V\xE4rde i objektnotation: " + _toDisplayString(_ctx.timeAsObject) + ". ",
        1
        /* TEXT */
      )
    ])
  ]);
}
exampleComponent.render = render;
setup({
  rootComponent: exampleComponent,
  selector: "#XTimeTextFieldExample"
});
export {
  render
};
