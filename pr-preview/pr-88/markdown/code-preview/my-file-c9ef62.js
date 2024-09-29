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

  // virtual-entry:./docs/markdown/files/my-file.vue
  var import_vue2 = __require("vue");
  var exampleComponent = {};
  function render(_ctx, _cache) {
    return (0, import_vue2.openBlock)(), (0, import_vue2.createElementBlock)(
      "div",
      null,
      "Hello " + (0, import_vue2.toDisplayString)(_ctx.name) + "!",
      1
      /* TEXT */
    );
  }
  exampleComponent.render = render;
  setup({
    rootComponent: exampleComponent,
    selector: "#my-file"
  });
})();
