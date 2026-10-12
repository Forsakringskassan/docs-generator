"use strict";
(() => {
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });

  // docs/src/setup.ts
  var import_vue = __require("vue");
  function setup(options) {
    const { rootComponent, selector } = options;
    const app = (0, import_vue.createApp)({
      render() {
        return (0, import_vue.h)(rootComponent);
      }
    });
    app.mount(selector);
  }

  // virtual-entry:./docs/markdown/code-preview/vue.md
  var import_vue2 = __require("vue");
  var import_vue3 = __require("vue");
  var name = "World";
  var exampleComponent = {
    __name: "vue",
    setup(__props, { expose: __expose }) {
      __expose();
      const __returned__ = { name, ref: import_vue2.ref };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function render(_ctx, _cache, $props, $setup, $data, $options) {
    return (0, import_vue3.openBlock)(), (0, import_vue3.createElementBlock)("p", null, "Hello " + (0, import_vue3.toDisplayString)($setup.name) + "!");
  }
  exampleComponent.render = render;
  setup({
    rootComponent: exampleComponent,
    selector: "#vue"
  });
})();
