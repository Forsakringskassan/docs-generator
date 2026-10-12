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

// virtual-entry:virtual:docs/markdown/files/my-file.vue:my-file-860fc6.js
import { ref } from "vue";
import { toDisplayString as _toDisplayString, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue";
var exampleComponent = {
  __name: "my-file",
  setup(__props, { expose: __expose }) {
    __expose();
    const name = ref("world");
    const __returned__ = { name, ref };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return _openBlock(), _createElementBlock(
    "div",
    null,
    "Hello " + _toDisplayString($setup.name) + "!",
    1
    /* TEXT */
  );
}
exampleComponent.render = render;
setup({
  rootComponent: exampleComponent,
  selector: "#example-860fc6"
});
export {
  render
};
