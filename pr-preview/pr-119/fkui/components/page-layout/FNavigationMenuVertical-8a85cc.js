// docs/src/setup.ts
import { createApp, h } from "vue";
import {
  ErrorPlugin,
  FErrorHandlingApp,
  TestPlugin,
  TranslationPlugin,
  ValidationPlugin,
  setRunningContext
} from "@fkui/vue";
function setup(options) {
  const { rootComponent, selector } = options;
  const app = createApp({
    render() {
      return h(FErrorHandlingApp, { defaultComponent: rootComponent });
    }
  });
  setRunningContext(app);
  app.use(ErrorPlugin, {
    captureWarnings: true,
    logToConsole: true
  });
  app.use(ValidationPlugin);
  app.use(TestPlugin);
  app.use(TranslationPlugin);
  app.mount(selector);
}

// virtual-entry:./packages/vue/src/components/FNavigationMenu/examples/FNavigationMenuVertical.vue
import { defineComponent } from "vue";
import { FNavigationMenu } from "@fkui/vue";
import { toDisplayString as _toDisplayString, createElementVNode as _createElementVNode, resolveComponent as _resolveComponent, createVNode as _createVNode, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue";
var exampleComponent = defineComponent({
  name: "FNavigationMenuVertical",
  components: { FNavigationMenu },
  data() {
    return {
      /** @type {NavigationMenuItem[]} */
      routes: [
        { label: "label1", route: "ROUTE_1" },
        { label: "label2", route: "ROUTE_2" },
        { label: "label3", route: "ROUTE_3" },
        { label: "label4", route: "ROUTE_4", href: "/", target: "" }
      ],
      selectedRoute: ""
    };
  }
});
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_f_navigation_menu = _resolveComponent("f-navigation-menu");
  return _openBlock(), _createElementBlock("div", null, [
    _createElementVNode(
      "pre",
      null,
      "selectedRoute: " + _toDisplayString(_ctx.selectedRoute),
      1
      /* TEXT */
    ),
    _createVNode(_component_f_navigation_menu, {
      vertical: "",
      routes: _ctx.routes,
      onSelectedRoute: _cache[0] || (_cache[0] = ($event) => _ctx.selectedRoute = $event)
    }, null, 8, ["routes"])
  ]);
}
exampleComponent.render = render;
setup({
  rootComponent: exampleComponent,
  selector: "#FNavigationMenuVertical"
});
export {
  render
};
