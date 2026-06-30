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

// virtual-entry:virtual:docs/e2e/ExamplesImportedBar.vue:ExamplesImportedBar-17239e.js
var exampleComponent = {};
function render(_ctx, _cache) {
  return "bar";
}
exampleComponent.render = render;
setup({
  rootComponent: exampleComponent,
  selector: "#example-17239e"
});
export {
  render
};
