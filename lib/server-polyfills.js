// Polyfills para objetos del navegador en el entorno del servidor
if (typeof global !== "undefined" && !global.self) {
  global.self = global
  global.window = global
  global.document = {
    createElement: () => ({
      getContext: () => ({}),
    }),
    addEventListener: () => {},
    removeEventListener: () => {},
    documentElement: {
      style: {},
    },
  }
  global.navigator = {
    userAgent: "node",
  }
}
