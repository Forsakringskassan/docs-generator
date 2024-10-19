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

// virtual-entry:./packages/vue/src/components/FExpandableParagraph/examples/FExpandableParagraphExample.vue
import { defineComponent } from "vue";
import { FExpandableParagraph } from "@fkui/vue";
import { createTextVNode as _createTextVNode, createElementVNode as _createElementVNode, resolveComponent as _resolveComponent, withCtx as _withCtx, openBlock as _openBlock, createBlock as _createBlock } from "vue";
var exampleComponent = defineComponent({
  name: "FExpandableParagraphExample",
  components: { FExpandableParagraph },
  data() {
    return {
      expanded: false,
      type: Boolean
    };
  },
  methods: {
    onToggle() {
      this.expanded = !this.expanded;
    }
  }
});
var _hoisted_1 = /* @__PURE__ */ _createElementVNode(
  "span",
  null,
  " Inneh\xE5ll ",
  -1
  /* HOISTED */
);
var _hoisted_2 = /* @__PURE__ */ _createElementVNode(
  "p",
  null,
  [
    /* @__PURE__ */ _createElementVNode("a", {
      class: "anchor",
      href: "",
      target: "_blank"
    }, " L\xE4nk till annan sida ")
  ],
  -1
  /* HOISTED */
);
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_f_expandable_paragraph = _resolveComponent("f-expandable-paragraph");
  return _openBlock(), _createBlock(_component_f_expandable_paragraph, {
    expanded: _ctx.expanded,
    "header-tag": "span",
    onToggle: _ctx.onToggle
  }, {
    title: _withCtx(() => [
      _createTextVNode(" Titel (span) ")
    ]),
    default: _withCtx(() => [
      _hoisted_1,
      _hoisted_2
    ]),
    _: 1
    /* STABLE */
  }, 8, ["expanded", "onToggle"]);
}
exampleComponent.render = render;
setup({
  rootComponent: exampleComponent,
  selector: "#FExpandableParagraphExample"
});
export {
  render
};
