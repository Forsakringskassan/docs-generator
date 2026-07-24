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

// virtual-entry:virtual:docs/markdown/code-preview/vue.md:vue-58a640.js
import { toDisplayString as _toDisplayString, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue";
var name = "World";
var exampleComponent = {
  __name: "vue",
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = { name };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return _openBlock(), _createElementBlock("p", null, "Hello " + _toDisplayString($setup.name) + "!");
}
exampleComponent.render = render;
setup({
  rootComponent: exampleComponent,
  selector: "#example-58a640"
});
export {
  render
};
