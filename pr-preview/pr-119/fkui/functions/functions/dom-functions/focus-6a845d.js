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

// virtual-entry:./docs/functions/functions/dom-functions/focus.md
import { defineComponent } from "vue";
import { focus } from "@fkui/vue";
import { createElementVNode as _createElementVNode, resolveComponent as _resolveComponent, createVNode as _createVNode, Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue";
var MyButton = defineComponent({
  template: (
    /* HTML */
    `
        <p>I have a button</p>
        <button ref="foo" type="button">My button</button>
    `
  ),
  computed: {
    focusTarget() {
      return this.$refs.foo;
    }
  }
});
var exampleComponent = defineComponent({
  components: { MyButton },
  computed: {
    focusTarget() {
      return this.$refs.myButton;
    }
  },
  mounted() {
    focus(this);
  }
});
var _hoisted_1 = /* @__PURE__ */ _createElementVNode(
  "h1",
  null,
  "Important Section",
  -1
  /* HOISTED */
);
var _hoisted_2 = /* @__PURE__ */ _createElementVNode(
  "p",
  null,
  "Some interesting content.",
  -1
  /* HOISTED */
);
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_my_button = _resolveComponent("my-button");
  return _openBlock(), _createElementBlock(
    _Fragment,
    null,
    [
      _hoisted_1,
      _hoisted_2,
      _createVNode(
        _component_my_button,
        { ref: "myButton" },
        null,
        512
        /* NEED_PATCH */
      )
    ],
    64
    /* STABLE_FRAGMENT */
  );
}
exampleComponent.render = render;
setup({
  rootComponent: exampleComponent,
  selector: "#focus"
});
export {
  render
};