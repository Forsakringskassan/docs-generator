/* this file is precompiled from jest.global.js */
jest.mock(
    "./src/workers/format-worker?worker&url",
    () => require.resolve("./temp/workers/format-worker.mjs"),
    { virtual: true },
);
