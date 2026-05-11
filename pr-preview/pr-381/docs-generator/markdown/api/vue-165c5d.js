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

// virtual-entry:virtual:docs/markdown/api/vue.md:vue-165c5d.js
import { toDisplayString as _toDisplayString, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue";
var exampleComponent = {};
function render(_ctx, _cache) {
  return _openBlock(), _createElementBlock(
    "p",
    null,
    _toDisplayString(
      /** something something... */
      _ctx.$t("translation.key.bar", "bar default text", {
        /** A thingamajig */
        foo: 1,
        /** A doodad */
        bar: "baz"
      })
    ),
    1
    /* TEXT */
  );
}
exampleComponent.render = render;
setup({
  rootComponent: exampleComponent,
  selector: "#example-165c5d"
});
export {
  render
};
