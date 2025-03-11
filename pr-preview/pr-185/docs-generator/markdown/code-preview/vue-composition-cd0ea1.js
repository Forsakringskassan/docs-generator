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

// virtual-entry:./docs/markdown/code-preview/vue-composition.vue
import { ref } from "vue";
import { toDisplayString as _toDisplayString, createElementVNode as _createElementVNode, createTextVNode as _createTextVNode, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue";
var exampleComponent = {
  __name: "vue-composition",
  setup(__props, { expose: __expose }) {
    __expose();
    const name = ref("World");
    const __returned__ = { name, ref };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return _openBlock(), _createElementBlock("p", null, [
    _cache[0] || (_cache[0] = _createTextVNode(" Hello ")),
    _createElementVNode(
      "em",
      null,
      _toDisplayString($setup.name) + "!",
      1
      /* TEXT */
    )
  ]);
}
exampleComponent.render = render;
exampleComponent.__scopeId = "data-v-cd0ea1";
setup({
  rootComponent: exampleComponent,
  selector: "#vue-composition"
});
export {
  render
};
