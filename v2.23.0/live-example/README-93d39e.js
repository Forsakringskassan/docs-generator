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

// virtual-entry:virtual:node_modules/@forsakringskassan/docs-live-example/README.md:README-93d39e.js
import { defineComponent } from "vue";
import {
  LiveExample,
  createElement
} from "@forsakringskassan/docs-live-example";
import { createElementVNode as _createElementVNode, vModelSelect as _vModelSelect, withDirectives as _withDirectives, vModelCheckbox as _vModelCheckbox, createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, withCtx as _withCtx, openBlock as _openBlock, createBlock as _createBlock } from "vue";
var exampleComponent = defineComponent({
  name: "AwesomeComponentLiveExample",
  components: { LiveExample },
  data() {
    return {
      tagName: "div",
      placeholderText: false
    };
  },
  computed: {
    template() {
      const { tagName, placeholderText } = this;
      const message = placeholderText ? "Lorem ipsum dolor sit amet" : "Hello World!";
      return createElement(tagName, message);
    }
  }
});
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_live_example = _resolveComponent("live-example");
  return _openBlock(), _createBlock(_component_live_example, { template: _ctx.template }, {
    default: _withCtx(() => [
      _createElementVNode("div", null, [
        _cache[3] || (_cache[3] = _createElementVNode(
          "label",
          { for: "config-element" },
          " Element ",
          -1
          /* HOISTED */
        )),
        _withDirectives(_createElementVNode(
          "select",
          {
            id: "config-element",
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.tagName = $event)
          },
          _cache[2] || (_cache[2] = [
            _createElementVNode(
              "option",
              { value: "div" },
              "div",
              -1
              /* HOISTED */
            ),
            _createElementVNode(
              "option",
              { value: "p" },
              "p",
              -1
              /* HOISTED */
            ),
            _createElementVNode(
              "option",
              { value: "em" },
              "em",
              -1
              /* HOISTED */
            )
          ]),
          512
          /* NEED_PATCH */
        ), [
          [_vModelSelect, _ctx.tagName]
        ])
      ]),
      _createElementVNode("div", null, [
        _createElementVNode("label", null, [
          _withDirectives(_createElementVNode(
            "input",
            {
              type: "checkbox",
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => _ctx.placeholderText = $event),
              value: true
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [_vModelCheckbox, _ctx.placeholderText]
          ]),
          _cache[4] || (_cache[4] = _createTextVNode(" Use placeholder text "))
        ])
      ])
    ]),
    _: 1
    /* STABLE */
  }, 8, ["template"]);
}
exampleComponent.render = render;
setup({
  rootComponent: exampleComponent,
  selector: "#example-93d39e"
});
export {
  render
};
