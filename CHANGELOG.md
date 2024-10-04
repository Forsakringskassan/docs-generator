# CHANGELOG

## [2.5.0](https://github.com/Forsakringskassan/docs-generator/compare/v2.4.0...v2.5.0) (2024-10-04)


### Features

* expose `onContentReady` to consumers ([7330ac5](https://github.com/Forsakringskassan/docs-generator/commit/7330ac573751da61818378b37ea139144a984d4d))

## [2.4.0](https://github.com/Forsakringskassan/docs-generator/compare/v2.3.0...v2.4.0) (2024-09-23)


### Features

* expose a limited set of esbuild options to js assets ([aeb8f81](https://github.com/Forsakringskassan/docs-generator/commit/aeb8f819f4dde8431d1d83998d56bc2d45b6eb89))
* fullscreen support for html examples ([aa92d6e](https://github.com/Forsakringskassan/docs-generator/commit/aa92d6e64fbb196bba23993a828941c4689da5e6))
* sass module importer (refs SB-4982) ([592dd06](https://github.com/Forsakringskassan/docs-generator/commit/592dd06ed257741b1922a605793cc4db35a5a996))


### Bug Fixes

* **deps:** update dependency piscina to v4.7.0 ([66cca41](https://github.com/Forsakringskassan/docs-generator/commit/66cca41ff2524487584507757fa5a15ecdbea20e))
* **vue:** handle when vue component is missing `<script>` ([5daa4eb](https://github.com/Forsakringskassan/docs-generator/commit/5daa4ebe02c975087b871ecff4e5ad936eb2160f))

## [2.3.0](https://github.com/Forsakringskassan/docs-generator/compare/v2.2.2...v2.3.0) (2024-09-20)


### Features

* `repository` placeholder in format strings ([3d58208](https://github.com/Forsakringskassan/docs-generator/commit/3d582087cea0e047b19653b59b6e176c3b281331))
* added support for NodePackageImporter (refs SB-4982) ([dd6c0c0](https://github.com/Forsakringskassan/docs-generator/commit/dd6c0c0f4c04cdd198fd65367473d15352297a8c))
* asset priority settings for sorting the order they run in ([e93ec83](https://github.com/Forsakringskassan/docs-generator/commit/e93ec8360740fdd513a2408cb9164bf0bfa4a7e7))
* detect github pull requests ([3c1073d](https://github.com/Forsakringskassan/docs-generator/commit/3c1073d1f1caeab349aca975842552d7b7ac8b35))


### Bug Fixes

* **deps:** update dependency mermaid to v11.2.1 ([7e0d689](https://github.com/Forsakringskassan/docs-generator/commit/7e0d68962182dff0cb382a6d72b500b5b9084a0d))
* fix vulnerable regexp ([63fb562](https://github.com/Forsakringskassan/docs-generator/commit/63fb562cb5f707d1e92bde25fe27e1eaec728552))

## [2.2.2](https://github.com/Forsakringskassan/docs-generator/compare/v2.2.1...v2.2.2) (2024-09-13)


### Bug Fixes

* **deps:** update dependency express to v4.20.0 [security] ([dd9d77b](https://github.com/Forsakringskassan/docs-generator/commit/dd9d77bc2bd394d7f147466fa428d7ff5e16d1d0))
* **deps:** update dependency mermaid to v11.2.0 ([e5b84b9](https://github.com/Forsakringskassan/docs-generator/commit/e5b84b98dcd2391aa695daec7e522a4e9c4bc16d))

## [2.2.1](https://github.com/Forsakringskassan/docs-generator/compare/v2.2.0...v2.2.1) (2024-09-11)


### Bug Fixes

* invalid layout when mobile and expanded menu (refs SFKUI-6794) ([7284025](https://github.com/Forsakringskassan/docs-generator/commit/72840253c6980ceaee69699ecc1f16cecb017881))

## [2.2.0](https://github.com/Forsakringskassan/docs-generator/compare/v2.1.0...v2.2.0) (2024-09-10)


### Features

* hide sidenav on click (fixes SFKUI-6767) ([0256f7b](https://github.com/Forsakringskassan/docs-generator/commit/0256f7bb649234df4dd782c0bb51c2002d9418f4))


### Bug Fixes

* **deps:** update dependency mermaid to v11.1.1 ([13d79bc](https://github.com/Forsakringskassan/docs-generator/commit/13d79bc5fbed67ab5e6f804041ef505585988e1f))
* hide details marker on Safari (refs SFKUI-6764) ([c4da3bb](https://github.com/Forsakringskassan/docs-generator/commit/c4da3bb1147a8d726f384171aaf8ad6bd75a5354))

## [2.1.0](https://github.com/Forsakringskassan/docs-generator/compare/v2.0.0...v2.1.0) (2024-09-09)


### Features

* **api:** `compileScript` and `compileStyle` accepts URL parameter ([a844004](https://github.com/Forsakringskassan/docs-generator/commit/a8440049f7162dec7ee99ef1f9cd20f53d1d01bb))
* **deps:** update dependency execa to v9 ([1735bbd](https://github.com/Forsakringskassan/docs-generator/commit/1735bbdd3f38ea9c07e018374af6a9eabeab2dc1))
* **deps:** update dependency glob to v11 ([9417f08](https://github.com/Forsakringskassan/docs-generator/commit/9417f08f3f6111e839723fb4ea8d80001cd78dad))
* processors may contain optional runtime scripts ([bcf51d7](https://github.com/Forsakringskassan/docs-generator/commit/bcf51d78858c3fb50559db3be12154c8faf3aa04))
* skeleton element for mermaid diagrams ([bed00fb](https://github.com/Forsakringskassan/docs-generator/commit/bed00fb0782b071b319d1344a7aa02f2abee4d34))
* support `hash` and `short` placeholders for `urlFormat` in `sourceUrlProcessor` ([174dd97](https://github.com/Forsakringskassan/docs-generator/commit/174dd9739598e49895b18caf0ab42374cca10ee6))


### Bug Fixes

* ensure asset directory exists before moving script assets ([5767e2f](https://github.com/Forsakringskassan/docs-generator/commit/5767e2f92e7bd497800fed69de93aa725ba9ba2f))
* fix broken mermaid diagrams after navigation ([91490fc](https://github.com/Forsakringskassan/docs-generator/commit/91490fc0ca6907ed4c962449430e5059c8a4b3d4))
* hide seconds from buildinfo ([9b0fec5](https://github.com/Forsakringskassan/docs-generator/commit/9b0fec5aec1553c5b4efb44136795483e5f3798e))
* include original error message when `compileScript` fails ([122aea3](https://github.com/Forsakringskassan/docs-generator/commit/122aea32307fb3ec1937fa36ff9ca981ece3095e))
* remove non-working support for arrays to `compileScript` ([c30803a](https://github.com/Forsakringskassan/docs-generator/commit/c30803aaf229910eb0229e5d6921817b5ca81da2))
* resolve `versions.json` proper when site is in a subdirectory ([ae44ab7](https://github.com/Forsakringskassan/docs-generator/commit/ae44ab7764acf803a016a54593f2aeb450b7238a))

## [2.0.0](https://github.com/Forsakringskassan/docs-generator/compare/v1.33.1...v2.0.0) (2024-09-07)


### ⚠ BREAKING CHANGES

* drop vue 2 support
* **deps:** NodeJS v20 or later is now required.

### Features

* **deps:** require nodejs v20 or later ([59d8172](https://github.com/Forsakringskassan/docs-generator/commit/59d81724384c5ce325a8085ff93c855825c0f6ad))
* drop vue 2 support ([27a8d7e](https://github.com/Forsakringskassan/docs-generator/commit/27a8d7e3ad6de593f4d1247ad0cdd7b9d327aa36))


### Bug Fixes

* try to fix nav icon size on older mobile devices ([b3e601d](https://github.com/Forsakringskassan/docs-generator/commit/b3e601dc9bada479b6a42a395fa197a4099f5d38))

## [1.33.1](https://github.com/Forsakringskassan/docs-generator/compare/v1.33.0...v1.33.1) (2024-09-06)


### Bug Fixes

* **deps:** update dependency mermaid to v11.1.0 ([fca5fa2](https://github.com/Forsakringskassan/docs-generator/commit/fca5fa2fcbff55bdd910bd4227079ed179087f29))

## [1.33.0](https://github.com/Forsakringskassan/docs-generator/compare/v1.32.0...v1.33.0) (2024-09-05)


### Features

* cookie processor (fixes SFKUI-6728) ([85c730d](https://github.com/Forsakringskassan/docs-generator/commit/85c730dae73c0649c04a15a9ca37779821c2f3cb))
* optional `apiUrl` in `MatomoOptions` ([c1281d2](https://github.com/Forsakringskassan/docs-generator/commit/c1281d2765fb15d1e565b8346c3865dc92c60e30))


### Bug Fixes

* do not render empty outline ([4f06652](https://github.com/Forsakringskassan/docs-generator/commit/4f06652a0efad66138407b964e3fa216f5605dff))
* heading size in examples ([fc5e087](https://github.com/Forsakringskassan/docs-generator/commit/fc5e08755e4fc82326979ed8c327bc0f789e2f59))
* responsive table of contents ([a478f56](https://github.com/Forsakringskassan/docs-generator/commit/a478f56d61f612c000a2b52592fee5479145312d))

## [1.32.0](https://github.com/Forsakringskassan/docs-generator/compare/v1.31.0...v1.32.0) (2024-08-30)


### Features

* **deps:** update dependency mermaid to v11 ([984c468](https://github.com/Forsakringskassan/docs-generator/commit/984c4687bfa12e63fc8f35780be5b1863320c610))

## [1.31.0](https://github.com/Forsakringskassan/docs-generator/compare/v1.30.10...v1.31.0) (2024-08-22)


### Features

* add option enabled to `selectableVersionProcessor` ([27d9ff2](https://github.com/Forsakringskassan/docs-generator/commit/27d9ff216513cca23b6aed9053d32d53fc3641a2))
* generate component links (fixes SFKUI-6698) ([90165d5](https://github.com/Forsakringskassan/docs-generator/commit/90165d591910f3387792fe33216f4785686ffb17))

## [1.30.10](https://github.com/Forsakringskassan/docs-generator/compare/v1.30.9...v1.30.10) (2024-08-16)


### Bug Fixes

* show active header in outline ([7293119](https://github.com/Forsakringskassan/docs-generator/commit/7293119ee29d08a4138aa34f7705a2a8f2b43d7c))

## [1.30.9](https://github.com/Forsakringskassan/docs-generator/compare/v1.30.8...v1.30.9) (2024-08-09)


### Bug Fixes

* **deps:** update dependency vue-docgen-api to v4.79.2 ([f8c3494](https://github.com/Forsakringskassan/docs-generator/commit/f8c3494c30522da84cd5b6b958346b838ed437e9))

## [1.30.8](https://github.com/Forsakringskassan/docs-generator/compare/v1.30.7...v1.30.8) (2024-07-26)


### Bug Fixes

* **deps:** update dependency semver to v7.6.3 ([05ad04a](https://github.com/Forsakringskassan/docs-generator/commit/05ad04ad0fab05a13091228bf9e94b48e82b4149))

## [1.30.7](https://github.com/Forsakringskassan/docs-generator/compare/v1.30.6...v1.30.7) (2024-07-19)


### Bug Fixes

* **deps:** update dependency glob to v10.4.5 ([d6006a2](https://github.com/Forsakringskassan/docs-generator/commit/d6006a23cc78fcdb6db97750cc93c4cfcc95acab))

## [1.30.6](https://github.com/Forsakringskassan/docs-generator/compare/v1.30.5...v1.30.6) (2024-07-12)


### Bug Fixes

* **deps:** update dependency highlight.js to v11.10.0 ([818dd66](https://github.com/Forsakringskassan/docs-generator/commit/818dd66b1d6123fe9f5dfa74e9021b9e99df4b0c))
* **deps:** update dependency vue-docgen-api to v4.79.1 ([5693008](https://github.com/Forsakringskassan/docs-generator/commit/56930081e9a70f608dcdf33ddf8c878c181b039e))

## [1.30.5](https://github.com/Forsakringskassan/docs-generator/compare/v1.30.4...v1.30.5) (2024-07-05)


### Bug Fixes

* **deps:** update dependency piscina to v4.6.1 ([c967c07](https://github.com/Forsakringskassan/docs-generator/commit/c967c07ef49c40d17852574adef4e6fc34579ba1))

## [1.30.4](https://github.com/Forsakringskassan/docs-generator/compare/v1.30.3...v1.30.4) (2024-06-28)


### Bug Fixes

* **deps:** update dependency glob to v10.4.2 ([0581866](https://github.com/Forsakringskassan/docs-generator/commit/0581866dbcb02af3c859ac7dcd0b658011e321b1))
* **deps:** update dependency piscina to v4.6.0 ([65ad2c3](https://github.com/Forsakringskassan/docs-generator/commit/65ad2c3d2d736f2b6407ec817857961800e1ee9c))

## [1.30.3](https://github.com/Forsakringskassan/docs-generator/compare/v1.30.2...v1.30.3) (2024-06-16)


### Bug Fixes

* fix fullscreen button link ([28a62ac](https://github.com/Forsakringskassan/docs-generator/commit/28a62acf8170c4d80062a132b08c38424edaf911))

## [1.30.2](https://github.com/Forsakringskassan/docs-generator/compare/v1.30.1...v1.30.2) (2024-06-12)


### Bug Fixes

* fix jenkins pull request id incorrectly including `PR-` prefix ([739b9b1](https://github.com/Forsakringskassan/docs-generator/commit/739b9b15b25a6e0acee79c8b1a255ce1899daff1))
* move `scmInfo` to importable macro in separate file ([893b315](https://github.com/Forsakringskassan/docs-generator/commit/893b315516a8e512962e1c6b5bf9d33bf6e515b8))
* move PR info on it's own line in version info ([d5f6e54](https://github.com/Forsakringskassan/docs-generator/commit/d5f6e54b7d3567077e94e50c2de8eeb81cf2e609))

## [1.30.1](https://github.com/Forsakringskassan/docs-generator/compare/v1.30.0...v1.30.1) (2024-06-12)


### Bug Fixes

* fix broken external links after navigating to subfolder ([9d3ed2b](https://github.com/Forsakringskassan/docs-generator/commit/9d3ed2b126c24cb933c90ed23d4ab623d6f5069b))
* fix broken search results when navigating from subdirectory ([6e23db6](https://github.com/Forsakringskassan/docs-generator/commit/6e23db64dd5395d99156dcb5ebaa3114cb0158c4))
* fix theme selector being stored per directory instead of globally ([90e90e5](https://github.com/Forsakringskassan/docs-generator/commit/90e90e57f2cc4aeb954e39f234138e37fe881fa8))
* prevent theme from flickering when loading page ([89339c1](https://github.com/Forsakringskassan/docs-generator/commit/89339c140d9815eeff7de274c6ee728982772438))

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
