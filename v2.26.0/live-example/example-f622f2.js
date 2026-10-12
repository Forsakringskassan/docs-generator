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

// virtual-entry:virtual:docs/live-example/example.md:example-f622f2.js
import { defineComponent } from "vue";
import { LiveExample } from "@forsakringskassan/docs-live-example";
import { createElementVNode as _createElementVNode, vModelSelect as _vModelSelect, withDirectives as _withDirectives, resolveComponent as _resolveComponent, withCtx as _withCtx, openBlock as _openBlock, createBlock as _createBlock } from "vue";
var exampleComponent = defineComponent({
  name: "HTMLLiveExample",
  components: { LiveExample },
  data() {
    return {
      name: "World"
    };
  },
  computed: {
    template() {
      return (
        /* HTML */
        ` <div>Hello ${this.name}!</div> `
      );
    }
  }
});
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_live_example = _resolveComponent("live-example");
  return _openBlock(), _createBlock(_component_live_example, {
    language: "html",
    template: _ctx.template
  }, {
    default: _withCtx(() => [
      _cache[2] || (_cache[2] = _createElementVNode(
        "label",
        {
          class: "docs-block",
          for: "html-name"
        },
        " Name ",
        -1
        /* HOISTED */
      )),
      _withDirectives(_createElementVNode(
        "select",
        {
          id: "html-name",
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.name = $event),
          class: "docs-block",
          name: "html-name"
        },
        _cache[1] || (_cache[1] = [
          _createElementVNode(
            "option",
            { value: "World" },
            "World",
            -1
            /* HOISTED */
          ),
          _createElementVNode(
            "option",
            { value: "Kalle Anka" },
            "Kalle Anka",
            -1
            /* HOISTED */
          ),
          _createElementVNode(
            "option",
            { value: "Fred Flintstone" },
            "Fred Flintstone",
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
  }, 8, ["template"]);
}
exampleComponent.render = render;
setup({
  rootComponent: exampleComponent,
  selector: "#example-f622f2"
});
export {
  render
};
