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

// virtual-entry:virtual:docs/e2e/examples.md:examples-79c352.js
var exampleComponent = {};
function render(_ctx, _cache) {
  return "bar";
}
exampleComponent.render = render;
setup({
  rootComponent: exampleComponent,
  selector: "#example-79c352"
});
export {
  render
};
