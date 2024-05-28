# CHANGELOG

## [1.30.0](https://github.com/Forsakringskassan/docs-generator/compare/v1.29.2...v1.30.0) (2024-05-28)


### Features

* new `motdProcessor` replacing now deprecated `versionBannerProcessor` ([c96aaed](https://github.com/Forsakringskassan/docs-generator/commit/c96aaed87128d3d98954b6f77a5fc5b1d2657b60))


### Bug Fixes

* **deps:** update dependency glob to v10.3.16 ([60aea60](https://github.com/Forsakringskassan/docs-generator/commit/60aea609bc0a342c431bbd660eebbf318d2c8f33))
* **deps:** update dependency glob to v10.4.1 ([381a6c1](https://github.com/Forsakringskassan/docs-generator/commit/381a6c1615cf19710f7b7a2ce44d3d5307f0b5c1))
* **deps:** update dependency piscina to v4.5.1 ([7339a08](https://github.com/Forsakringskassan/docs-generator/commit/7339a0859b04296155ef0d12eb53210e01d06523))

## [1.29.2](https://github.com/Forsakringskassan/docs-generator/compare/v1.29.1...v1.29.2) (2024-05-24)


### Bug Fixes

* **deps:** update dependency mermaid to v10.9.1 ([1dffc55](https://github.com/Forsakringskassan/docs-generator/commit/1dffc555c099474484fd1a6db7c916a81c81cf44))
* **deps:** update dependency piscina to v4.5.0 ([4e378bb](https://github.com/Forsakringskassan/docs-generator/commit/4e378bb2fe1adc53a51a1aeb067665a0f6a3473d))

## [1.29.1](https://github.com/Forsakringskassan/docs-generator/compare/v1.29.0...v1.29.1) (2024-05-17)


### Bug Fixes

* **deps:** update dependency glob to v10.3.14 ([ccadc65](https://github.com/Forsakringskassan/docs-generator/commit/ccadc6565a644825f46be7a4d0f32c3829a3c862))
* **deps:** update dependency glob to v10.3.15 ([4916055](https://github.com/Forsakringskassan/docs-generator/commit/491605556769cca5e7aab71acabc5b9312eeea8f))
* **deps:** update dependency semver to v7.6.1 ([4f02106](https://github.com/Forsakringskassan/docs-generator/commit/4f02106e1394245359d87a6aba4d185759e3fec4))
* **deps:** update dependency semver to v7.6.2 ([d77d8e4](https://github.com/Forsakringskassan/docs-generator/commit/d77d8e490b69186753f6d4287d458c8b48b18d53))

## [1.29.0](https://github.com/Forsakringskassan/docs-generator/compare/v1.28.0...v1.29.0) (2024-05-08)


### Features

* add alternative text markdown container ([4afc5bf](https://github.com/Forsakringskassan/docs-generator/commit/4afc5bf6ea3afe64a83e6ee5b1b78d6528af02e4))
* add frontmatter `include` ([77b762f](https://github.com/Forsakringskassan/docs-generator/commit/77b762fe8ac412bc9e4fc37c70b1d52c8330a699))


### Performance Improvements

* skip running example compiler when there are no examples to compile ([67800d8](https://github.com/Forsakringskassan/docs-generator/commit/67800d8d224f926da367b424d4a63d16504e58c6))

## [1.28.0](https://github.com/Forsakringskassan/docs-generator/compare/v1.27.0...v1.28.0) (2024-05-06)


### Features

* add new `defineSources` helper ([5b4b9ad](https://github.com/Forsakringskassan/docs-generator/commit/5b4b9ad5efa3e522324e54c28a1c1ed97948054b))
* backport topnav processor ([bf1e759](https://github.com/Forsakringskassan/docs-generator/commit/bf1e7595088a1f092180efdfa11b353e8d1e0759))
* new css-variables for text colors ([b5d9c57](https://github.com/Forsakringskassan/docs-generator/commit/b5d9c57220be1316fa215f13560bd089cafd4834))
* queryable example metadata ([15e01a5](https://github.com/Forsakringskassan/docs-generator/commit/15e01a541b9bfa2ac30e8e7c544612a79b317c3e))
* version processor can optionally include scm information ([0680cd8](https://github.com/Forsakringskassan/docs-generator/commit/0680cd81b1c7f302d690c42cb2bffd4d6861978f))

## [1.27.0](https://github.com/Forsakringskassan/docs-generator/compare/v1.26.0...v1.27.0) (2024-04-25)


### Features

* **deps:** make `express` an optional peer dependency ([c6f1ea1](https://github.com/Forsakringskassan/docs-generator/commit/c6f1ea1975c20c35ad3552ddb610df11306ee7d1))


### Bug Fixes

* fix relative urls appending extra trailing `/` ([f949396](https://github.com/Forsakringskassan/docs-generator/commit/f9493968640f2c0dfc20da6a08348711170b5cd2))

## [1.26.0](https://github.com/Forsakringskassan/docs-generator/compare/v1.25.3...v1.26.0) (2024-04-24)


### Features

* add a unique id to each example ([4413f26](https://github.com/Forsakringskassan/docs-generator/commit/4413f26c0309b4a144c5699c5f573ab9b90c1903))
* **api:** new `manifest()` method for programmatically retrieving maniest ([b3020f2](https://github.com/Forsakringskassan/docs-generator/commit/b3020f26794f8f5dca44867b0fe0630563bd19a1))
* **api:** new `manifestProcessor` ([c5029b4](https://github.com/Forsakringskassan/docs-generator/commit/c5029b479d3c126c304a8d2a97c06460c80a9ddc))
* **api:** support `[hash]` in `outputName` ([9e257e0](https://github.com/Forsakringskassan/docs-generator/commit/9e257e03165e295710a4ed3eddf52d94d2349ca2))


### Bug Fixes

* correct css-variables filepath for windows ([f267b91](https://github.com/Forsakringskassan/docs-generator/commit/f267b9172450688e21bffb47a960e4a4573fb91a))

## [1.25.3](https://github.com/Forsakringskassan/docs-generator/compare/v1.25.2...v1.25.3) (2024-04-20)


### Bug Fixes

* balanced header text wrapping ([7a11c46](https://github.com/Forsakringskassan/docs-generator/commit/7a11c4670a286aad166691461c6f8a708ccb381e))
* separate variables for default font-weight and headings ([e941260](https://github.com/Forsakringskassan/docs-generator/commit/e94126013d2b0f6f5f6b0c6896d06f2eaff231ae))

## [1.25.2](https://github.com/Forsakringskassan/docs-generator/compare/v1.25.1...v1.25.2) (2024-04-17)


### Bug Fixes

* fix EPERM error when renaming output folder on Windows ([c82f5f1](https://github.com/Forsakringskassan/docs-generator/commit/c82f5f18beed8462bacbb711da0103e90842c8e4))

## [1.25.1](https://github.com/Forsakringskassan/docs-generator/compare/v1.25.0...v1.25.1) (2024-04-16)


### Bug Fixes

* **style:** adjust font-weight on headings ([5a2fb85](https://github.com/Forsakringskassan/docs-generator/commit/5a2fb8519655986c9c9100f896ad2ad16d60598b))
* **style:** change font ([83c033f](https://github.com/Forsakringskassan/docs-generator/commit/83c033f35be6b0e6dbac2e4ec928991a99f95d5d))

## [1.25.0](https://github.com/Forsakringskassan/docs-generator/compare/v1.24.0...v1.25.0) (2024-04-15)


### Features

* **deps:** update dependency piscina to v4 ([5e7d50d](https://github.com/Forsakringskassan/docs-generator/commit/5e7d50dfb674f58268fb0ed908dbd767e8cec2ee))


### Bug Fixes

* add sri for most resources currently missing it ([336e309](https://github.com/Forsakringskassan/docs-generator/commit/336e3091ac9a1527e72ff6820e2dd6163791d678))

## [1.24.0](https://github.com/Forsakringskassan/docs-generator/compare/v1.23.1...v1.24.0) (2024-04-12)


### Features

* initial public version ([6352bbc](https://github.com/Forsakringskassan/docs-generator/commit/6352bbc097a5920181753f4980d6236d352c494a))
