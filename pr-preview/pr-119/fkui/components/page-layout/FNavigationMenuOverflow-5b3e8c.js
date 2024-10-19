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

// virtual-entry:./packages/vue/src/components/FNavigationMenu/examples/FNavigationMenuOverflow.vue
import { defineComponent } from "vue";
import { FNavigationMenu } from "@fkui/vue";

// packages/vue/src/components/FNavigationMenu/examples/router.ts
function generateExampleLabelsAndRoutes(nbRoutes) {
  const res = [];
  for (let i = 0; i < nbRoutes; i++) {
    res.push({ label: `label${i + 1}`, route: `ROUTE_${i + 1}` });
  }
  return res;
}
var routes = generateExampleLabelsAndRoutes(10);

// virtual-entry:./packages/vue/src/components/FNavigationMenu/examples/FNavigationMenuOverflow.vue
import { toDisplayString as _toDisplayString, createElementVNode as _createElementVNode, resolveComponent as _resolveComponent, createVNode as _createVNode, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue";
var exampleComponent = defineComponent({
  name: "FNavigationMenuExample",
  components: { FNavigationMenu },
  props: {},
  data: () => {
    return {
      routes,
      selectedRoute: ""
    };
  },
  methods: {}
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
      routes: _ctx.routes,
      onSelectedRoute: _cache[0] || (_cache[0] = ($event) => _ctx.selectedRoute = $event)
    }, null, 8, ["routes"])
  ]);
}
exampleComponent.render = render;
setup({
  rootComponent: exampleComponent,
  selector: "#FNavigationMenuOverflow"
});
export {
  render
};
