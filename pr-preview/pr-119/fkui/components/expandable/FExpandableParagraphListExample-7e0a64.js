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

// virtual-entry:./packages/vue/src/components/FExpandableParagraph/examples/FExpandableParagraphListExample.vue
import { defineComponent } from "vue";
import { FExpandableParagraph } from "@fkui/vue";
import { createTextVNode as _createTextVNode, createElementVNode as _createElementVNode, resolveComponent as _resolveComponent, withCtx as _withCtx, createVNode as _createVNode, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue";
var exampleComponent = defineComponent({
  name: "FExpandableParagraphMultipleExample",
  components: { FExpandableParagraph },
  data() {
    return {
      expanded1: false,
      expanded2: false,
      expanded3: false
    };
  },
  methods: {
    onToggle1() {
      this.expanded1 = !this.expanded1;
    },
    onToggle2() {
      this.expanded2 = !this.expanded2;
    },
    onToggle3() {
      this.expanded3 = !this.expanded3;
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
  "span",
  null,
  " Inneh\xE5ll ",
  -1
  /* HOISTED */
);
var _hoisted_3 = /* @__PURE__ */ _createElementVNode(
  "span",
  null,
  " Inneh\xE5ll ",
  -1
  /* HOISTED */
);
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_f_expandable_paragraph = _resolveComponent("f-expandable-paragraph");
  return _openBlock(), _createElementBlock("div", null, [
    _createVNode(_component_f_expandable_paragraph, {
      expanded: _ctx.expanded1,
      "header-tag": "h2",
      list: true,
      onToggle: _ctx.onToggle1
    }, {
      title: _withCtx(() => [
        _createTextVNode(" Titel (h2) ")
      ]),
      related: _withCtx(() => [
        _createTextVNode(" 2020-06-25 ")
      ]),
      default: _withCtx(() => [
        _hoisted_1
      ]),
      _: 1
      /* STABLE */
    }, 8, ["expanded", "onToggle"]),
    _createVNode(_component_f_expandable_paragraph, {
      expanded: _ctx.expanded2,
      "header-tag": "h3",
      "header-visual-tag": "h6",
      list: true,
      onToggle: _ctx.onToggle2
    }, {
      title: _withCtx(() => [
        _createTextVNode(" Titel (h3) (visuell h6) ")
      ]),
      related: _withCtx(() => [
        _createTextVNode(" 2020-06-25 ")
      ]),
      default: _withCtx(() => [
        _hoisted_2
      ]),
      _: 1
      /* STABLE */
    }, 8, ["expanded", "onToggle"]),
    _createVNode(_component_f_expandable_paragraph, {
      expanded: _ctx.expanded3,
      "header-tag": "h6",
      "header-visual-tag": "h2",
      list: true,
      onToggle: _ctx.onToggle3
    }, {
      title: _withCtx(() => [
        _createTextVNode(" Titel (h6) (visuell h2) ")
      ]),
      related: _withCtx(() => [
        _createTextVNode(" 2020-06-25 ")
      ]),
      default: _withCtx(() => [
        _hoisted_3
      ]),
      _: 1
      /* STABLE */
    }, 8, ["expanded", "onToggle"])
  ]);
}
exampleComponent.render = render;
setup({
  rootComponent: exampleComponent,
  selector: "#FExpandableParagraphListExample"
});
export {
  render
};
