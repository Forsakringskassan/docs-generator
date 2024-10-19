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

// virtual-entry:./packages/vue/src/components/FNavigationMenu/examples/FNavigationMenuActiveRoute.vue
import { defineComponent } from "vue";
import { FNavigationMenu } from "@fkui/vue";
import { toDisplayString as _toDisplayString, createElementVNode as _createElementVNode, vModelText as _vModelText, resolveDirective as _resolveDirective, withDirectives as _withDirectives, resolveComponent as _resolveComponent, createVNode as _createVNode, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue";
var exampleComponent = defineComponent({
  name: "FNavigationMenuActiveRoute",
  components: { FNavigationMenu },
  data() {
    return {
      /** @type {NavigationMenuItem[]} */
      routes: [
        { label: "label1", route: "ROUTE_1" },
        { label: "label2", route: "ROUTE_2" },
        { label: "label3", route: "ROUTE_3" },
        {
          label: "label4",
          route: "ROUTE_4",
          href: "#f-navigation-menu-active-route-qwerty"
        },
        {
          label: "label5",
          route: "ROUTE_5",
          href: "#f-navigation-menu-active-route-asdfgh"
        }
      ],
      selectedRoute: "ROUTE_2",
      // or this.route.path (from Vue router in setup)
      routeInput: "ROUTE_3"
    };
  },
  computed: {
    availableRoutes() {
      return this.routes.map((r) => r.route).join(", ");
    }
  }
});
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_f_navigation_menu = _resolveComponent("f-navigation-menu");
  const _directive_validation = _resolveDirective("validation");
  return _openBlock(), _createElementBlock("div", null, [
    _createElementVNode(
      "pre",
      null,
      "selectedRoute: " + _toDisplayString(_ctx.selectedRoute),
      1
      /* TEXT */
    ),
    _createElementVNode(
      "pre",
      null,
      "availableRoutes: " + _toDisplayString(_ctx.availableRoutes),
      1
      /* TEXT */
    ),
    _createElementVNode("p", null, [
      _withDirectives(_createElementVNode(
        "input",
        {
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.routeInput = $event),
          type: "text"
        },
        null,
        512
        /* NEED_PATCH */
      ), [
        [_vModelText, _ctx.routeInput],
        [
          _directive_validation,
          { maxLength: { length: 20 } },
          void 0,
          { maxLength: true }
        ]
      ]),
      _createElementVNode("button", {
        type: "button",
        onClick: _cache[1] || (_cache[1] = ($event) => _ctx.selectedRoute = _ctx.routeInput)
      }, "Go to route")
    ]),
    _createVNode(_component_f_navigation_menu, {
      route: _ctx.selectedRoute,
      "onUpdate:route": _cache[2] || (_cache[2] = ($event) => _ctx.selectedRoute = $event),
      routes: _ctx.routes
    }, null, 8, ["route", "routes"])
  ]);
}
exampleComponent.render = render;
setup({
  rootComponent: exampleComponent,
  selector: "#FNavigationMenuActiveRoute"
});
export {
  render
};
