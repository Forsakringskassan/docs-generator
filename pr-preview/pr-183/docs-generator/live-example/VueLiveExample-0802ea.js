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

// virtual-entry:./docs/live-example/VueLiveExample.vue
import { defineComponent } from "vue";
import { LiveExample } from "@forsakringskassan/docs-live-example";
import { createElementVNode as _createElementVNode, vModelSelect as _vModelSelect, withDirectives as _withDirectives, resolveComponent as _resolveComponent, withCtx as _withCtx, openBlock as _openBlock, createBlock as _createBlock } from "vue";
var exampleComponent = defineComponent({
  name: "VueLiveExample",
  components: { LiveExample },
  data() {
    return {
      name: "predefined"
    };
  },
  computed: {
    livedata() {
      const useCustomName = this.name === "custom";
      return {
        name: "World",
        useCustomName
      };
    },
    template() {
      return (
        /* HTML */
        `
                <p>Hello {{ name }}!</p>
                <template v-if="useCustomName">
                    <label>Name: <input type="text" v-model="name" /></label>
                </template>
            `
      );
    }
  }
});
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_live_example = _resolveComponent("live-example");
  return _openBlock(), _createBlock(_component_live_example, {
    language: "vue",
    template: _ctx.template,
    livedata: _ctx.livedata
  }, {
    default: _withCtx(() => [
      _cache[2] || (_cache[2] = _createElementVNode(
        "label",
        {
          class: "docs-block",
          for: "vue-name"
        },
        " Name ",
        -1
        /* HOISTED */
      )),
      _withDirectives(_createElementVNode(
        "select",
        {
          id: "vue-name",
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.name = $event),
          class: "docs-block",
          name: "vue-name"
        },
        _cache[1] || (_cache[1] = [
          _createElementVNode(
            "option",
            { value: "predefined" },
            "Predefined",
            -1
            /* HOISTED */
          ),
          _createElementVNode(
            "option",
            { value: "custom" },
            "Custom",
            -1
            /* HOISTED */
          )
        ]),
        512
        /* NEED_PATCH */
      ), [
        [_vModelSelect, _ctx.name]
      ])
    ]),
    _: 1
    /* STABLE */
  }, 8, ["template", "livedata"]);
}
exampleComponent.render = render;
setup({
  rootComponent: exampleComponent,
  selector: "#VueLiveExample"
});
export {
  render
};
