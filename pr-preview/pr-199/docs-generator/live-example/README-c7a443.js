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

// virtual-entry:virtual:node_modules/@forsakringskassan/docs-live-example/README.md:README-c7a443.js
import { defineComponent } from "vue";
import { LiveExample } from "@forsakringskassan/docs-live-example";
import { resolveComponent as _resolveComponent, openBlock as _openBlock, createBlock as _createBlock } from "vue";
var exampleComponent = defineComponent({
  name: "AwesomeComponentLiveExample",
  components: { LiveExample },
  data() {
    return {};
  },
  computed: {
    livedata() {
      return {
        /* data used by generated code */
      };
    },
    components() {
      return {
        /* components used by generated code */
      };
    },
    template() {
      return (
        /* HTML */
        ` <div>Hello World!</div> `
      );
    }
  }
});
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_live_example = _resolveComponent("live-example");
  return _openBlock(), _createBlock(_component_live_example, {
    components: _ctx.components,
    template: _ctx.template,
    livedata: _ctx.livedata
  }, null, 8, ["components", "template", "livedata"]);
}
exampleComponent.render = render;
setup({
  rootComponent: exampleComponent,
  selector: "#example-c7a443"
});
export {
  render
};
