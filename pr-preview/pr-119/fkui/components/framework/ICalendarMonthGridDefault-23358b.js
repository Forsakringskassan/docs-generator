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

// virtual-entry:./packages/vue/src/internal-components/calendar/examples/ICalendarMonthGridDefault.vue
import { defineComponent, shallowRef } from "vue";
import { ICalendarMonthGrid } from "@fkui/vue";
import { FDate } from "@fkui/date";
import { resolveComponent as _resolveComponent, openBlock as _openBlock, createBlock as _createBlock } from "vue";
var exampleComponent = defineComponent({
  name: "ICalendarMonthDefaultExample",
  components: { ICalendarMonthGrid },
  data() {
    return {
      month: shallowRef(FDate.fromIso("2022-10-01"))
    };
  }
});
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_i_calendar_month_grid = _resolveComponent("i-calendar-month-grid");
  return _openBlock(), _createBlock(_component_i_calendar_month_grid, { value: _ctx.month }, null, 8, ["value"]);
}
exampleComponent.render = render;
setup({
  rootComponent: exampleComponent,
  selector: "#ICalendarMonthGridDefault"
});
export {
  render
};