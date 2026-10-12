// docs/src/setup.ts
import { createApp, h } from "vue";
function setup(options) {
  const { rootComponent, selector } = options;
  const app = createApp({
    render() {
      return h(rootComponent);
    }
  });
  app.mount(selector);
}

// virtual-entry:virtual:docs/markdown/code-preview/vue-options.vue:vue-options-248dc2.js
import { defineComponent } from "vue";
import { toDisplayString as _toDisplayString, createElementVNode as _createElementVNode, createTextVNode as _createTextVNode, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue";
var exampleComponent = defineComponent({
  data() {
    return {
      name: "World"
    };
  }
});
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return _openBlock(), _createElementBlock("p", null, [
    _cache[0] || (_cache[0] = _createTextVNode(" Hello ")),
    _createElementVNode(
      "em",
      null,
      _toDisplayString(_ctx.name) + "!",
      1
      /* TEXT */
    )
  ]);
}
exampleComponent.render = render;
exampleComponent.__scopeId = "data-v-248dc2";
setup({
  rootComponent: exampleComponent,
  selector: "#example-248dc2"
});
export {
  render
};
