# CHANGELOG

## [2.15.3](https://github.com/Forsakringskassan/docs-generator/compare/v2.15.2...v2.15.3) (2025-01-09)

### Bug Fixes

* properly pass markdown options to markdown renderer ([f11e5d9](https://github.com/Forsakringskassan/docs-generator/commit/f11e5d9569b0551bfaaa06626fd4e24e73cb183d))

## [2.15.2](https://github.com/Forsakringskassan/docs-generator/compare/v2.15.1...v2.15.2) (2025-01-03)

### Bug Fixes

* **deps:** update dependency highlight.js to v11.11.1 ([f15cd38](https://github.com/Forsakringskassan/docs-generator/commit/f15cd388ef3a68e694fd294231deb08b1247df39))

## [2.15.1](https://github.com/Forsakringskassan/docs-generator/compare/v2.15.0...v2.15.1) (2024-12-27)

### Bug Fixes

* **deps:** update dependency chokidar to v4.0.3 ([#142](https://github.com/Forsakringskassan/docs-generator/issues/142)) ([929dcdc](https://github.com/Forsakringskassan/docs-generator/commit/929dcdc07e3a6d8477af9ac7d6fe86feab260956))

## [2.15.0](https://github.com/Forsakringskassan/docs-generator/compare/v2.14.5...v2.15.0) (2024-12-20)

### Features

* support snippets in html and vue examples ([c58f410](https://github.com/Forsakringskassan/docs-generator/commit/c58f410835dec51d5705b31eb70fb80f3dcaa040))

### Bug Fixes

* fix missing root url on fullscreen example ([4842d58](https://github.com/Forsakringskassan/docs-generator/commit/4842d58f829a3481fac327bc6761dce591f4a248))
* fix search error in fullscreen example ([ef4aad4](https://github.com/Forsakringskassan/docs-generator/commit/ef4aad44b1d27bb0bb3d6e35b08f246680909a4b))
* fullscreen example extranous padding ([988bc95](https://github.com/Forsakringskassan/docs-generator/commit/988bc95365cbf13cc2a21ef4ce2979f1c69ca3eb))
* normalize imported example language ([e0890eb](https://github.com/Forsakringskassan/docs-generator/commit/e0890ebc31f372d1370a3038fedee2589a2e558f))

## [2.14.5](https://github.com/Forsakringskassan/docs-generator/compare/v2.14.4...v2.14.5) (2024-12-20)

### Bug Fixes

* **deps:** update dependency highlight.js to v11.11.0 ([66071e8](https://github.com/Forsakringskassan/docs-generator/commit/66071e8ac2214b18737209184e480a03768bd6d7))

## [2.14.4](https://github.com/Forsakringskassan/docs-generator/compare/v2.14.3...v2.14.4) (2024-12-16)

### Bug Fixes

* **deps:** update dependency piscina to v4.8.0 ([7d56d01](https://github.com/Forsakringskassan/docs-generator/commit/7d56d0171dbee2cd2f11b1f4a026ceb022387348))

## [2.14.3](https://github.com/Forsakringskassan/docs-generator/compare/v2.14.2...v2.14.3) (2024-12-07)


### Bug Fixes

* fix mismatched example fingerprints ([77e7293](https://github.com/Forsakringskassan/docs-generator/commit/77e7293b6247a910b79b19169366f96def84b9de))

## [2.14.2](https://github.com/Forsakringskassan/docs-generator/compare/v2.14.1...v2.14.2) (2024-12-06)


### Bug Fixes

* support snippets in imported examples ([70b25ea](https://github.com/Forsakringskassan/docs-generator/commit/70b25eaae661e7fb8a68d5032b203eed36a98a3d))

## [2.14.1](https://github.com/Forsakringskassan/docs-generator/compare/v2.14.0...v2.14.1) (2024-12-06)


### Bug Fixes

* **deps:** update dependency @leeoniya/ufuzzy to v1.0.17 ([#135](https://github.com/Forsakringskassan/docs-generator/issues/135)) ([022df8c](https://github.com/Forsakringskassan/docs-generator/commit/022df8cc0c2dbb0f495df3e012ec0d5aa0b2a97e))
* **deps:** update dependency mermaid to v11.4.1 ([8d060a3](https://github.com/Forsakringskassan/docs-generator/commit/8d060a36076ded677919a3b76cb422539f28a3e6))

## [2.14.0](https://github.com/Forsakringskassan/docs-generator/compare/v2.13.0...v2.14.0) (2024-11-05)


### Features

* dedent code after transforming ([744f9c5](https://github.com/Forsakringskassan/docs-generator/commit/744f9c57abb5dbed7ef783a81b920afe8394e2a5))

## [2.13.0](https://github.com/Forsakringskassan/docs-generator/compare/v2.12.0...v2.13.0) (2024-11-04)


### Features

* allow to cut snippets from examples ([db07585](https://github.com/Forsakringskassan/docs-generator/commit/db07585e5b345ce7aecc7023e0b5b46beac0531e))
* new `extractExamplesProcessor` ([2559b06](https://github.com/Forsakringskassan/docs-generator/commit/2559b069450362d1006df887087aaaafa912e05b)), closes [#59](https://github.com/Forsakringskassan/docs-generator/issues/59)
* strip eslint comments from examples ([5dd604e](https://github.com/Forsakringskassan/docs-generator/commit/5dd604e17e8c67e59c38b110455b5ee00aa0086a))


### Bug Fixes

* `cacheFolder` is optional ([e4ad918](https://github.com/Forsakringskassan/docs-generator/commit/e4ad9188bde5cd919f699c3b718c2ca1f5f485aa))
* `exampleFolders` is optional ([bf4893d](https://github.com/Forsakringskassan/docs-generator/commit/bf4893d6ad7e52d8512b837c564d3a507a31d33c))
* `markdown.messagebox` is optional ([d558a90](https://github.com/Forsakringskassan/docs-generator/commit/d558a90eaa28b58ce4b87a33a17b8f691a366db3))
* `motdProcessor` options is optional ([d43c0cb](https://github.com/Forsakringskassan/docs-generator/commit/d43c0cbe684e01236b5010c5da693207e132ad8c))
* `outputFolder` is optional ([53dde23](https://github.com/Forsakringskassan/docs-generator/commit/53dde23d340dd5c6f14f5ee3c38ac7fb0a6baa32))
* only match filenames when matching source files ([aec08fa](https://github.com/Forsakringskassan/docs-generator/commit/aec08fa318eb1fd828849fcb2648e7b68c3b841d))


### Performance Improvements

* reuse same manifest `md` instance for all calls ([616f226](https://github.com/Forsakringskassan/docs-generator/commit/616f226aa895c0595918f7fafa6785637d80d55c))

## [2.12.0](https://github.com/Forsakringskassan/docs-generator/compare/v2.11.4...v2.12.0) (2024-11-03)


### Features

* new processor `fileRedirctProcessor` for html based redirects ([17c18cc](https://github.com/Forsakringskassan/docs-generator/commit/17c18cc7236afdaa3571ad037d81a972b40f07ee)), closes [#77](https://github.com/Forsakringskassan/docs-generator/issues/77)
* new processor `redirctFileProcessor` for netlify-style redirects ([a326b5f](https://github.com/Forsakringskassan/docs-generator/commit/a326b5f3d9db1a0cbe8628707fcce33613cf11bb)), closes [#77](https://github.com/Forsakringskassan/docs-generator/issues/77)
* support tagging redirects on documents ([e695ec6](https://github.com/Forsakringskassan/docs-generator/commit/e695ec60c9cfcb0a1f71019a6bee69a7e6f2b4e1)), closes [#76](https://github.com/Forsakringskassan/docs-generator/issues/76)


### Bug Fixes

* **deps:** update dependency mermaid to v11.4.0 ([b408d94](https://github.com/Forsakringskassan/docs-generator/commit/b408d94e21bf6f7c75e9284d076952086cbdc3c3))

## [2.11.4](https://github.com/Forsakringskassan/docs-generator/compare/v2.11.3...v2.11.4) (2024-11-01)


### Bug Fixes

* code in messagebox and messagebox styling ([7ea1600](https://github.com/Forsakringskassan/docs-generator/commit/7ea1600b5bae3830b7ffeed1b2239a420cddb67b))
* **deps:** update dependency nano-spawn to v0.2.0 ([b041385](https://github.com/Forsakringskassan/docs-generator/commit/b041385a9ebf655290bf4fd2cbfb5f329ff3fdfa))

## [2.11.3](https://github.com/Forsakringskassan/docs-generator/compare/v2.11.2...v2.11.3) (2024-10-29)


### Bug Fixes

* set correct language in manifest ([d1f1e0f](https://github.com/Forsakringskassan/docs-generator/commit/d1f1e0fbde666737466db00ae0d52a4c02ba5b6d))

## [2.11.2](https://github.com/Forsakringskassan/docs-generator/compare/v2.11.1...v2.11.2) (2024-10-28)


### Bug Fixes

* add latest version prefix ([762e9c3](https://github.com/Forsakringskassan/docs-generator/commit/762e9c377f0424ebb8f62093aa7098ed0ca2ffd2))

## [2.11.1](https://github.com/Forsakringskassan/docs-generator/compare/v2.11.0...v2.11.1) (2024-10-28)


### Bug Fixes

* resolve latest version properly ([d496835](https://github.com/Forsakringskassan/docs-generator/commit/d496835f15035f23f7bb0221bbf17ab4310cbfa1))

## [2.11.0](https://github.com/Forsakringskassan/docs-generator/compare/v2.10.0...v2.11.0) (2024-10-28)


### Features

* motd API ([a4ed61d](https://github.com/Forsakringskassan/docs-generator/commit/a4ed61d075ae3d85a1e57968ba6a1d0a73d53edc))


### Bug Fixes

* selectable version ([f12db4d](https://github.com/Forsakringskassan/docs-generator/commit/f12db4d3a0d25294b13b4975d2264275f61bfc51))

## [2.10.0](https://github.com/Forsakringskassan/docs-generator/compare/v2.9.2...v2.10.0) (2024-10-23)


### Features

* support vue composition and scoped styling in examples ([8f00924](https://github.com/Forsakringskassan/docs-generator/commit/8f00924064fb5c7171a74fe5fecb0f1f0c9f01b0))


### Bug Fixes

* dont print exceptions twice ([e8c93a9](https://github.com/Forsakringskassan/docs-generator/commit/e8c93a91230320d99deb69a88209f6866a9f280d))
* ensure compiling sass works when package is linked with `npm link` ([59f3753](https://github.com/Forsakringskassan/docs-generator/commit/59f3753286f1b786aab28054652b5ea9faec6342))
* load layout templates from custom directories ([c2f37d5](https://github.com/Forsakringskassan/docs-generator/commit/c2f37d541dbccbccd9e2ee206ba2c4baae9c7297))

## [2.9.2](https://github.com/Forsakringskassan/docs-generator/compare/v2.9.1...v2.9.2) (2024-10-15)


### Bug Fixes

* build examples in development mode ([8d8f0c3](https://github.com/Forsakringskassan/docs-generator/commit/8d8f0c3a2f3c24f612d606bd3c242e6a3a54360c))
* hide hidden sections (`index.md`) in topmenu ([2d55a07](https://github.com/Forsakringskassan/docs-generator/commit/2d55a07696a26e722679bd72290769aff38ed3c1))

## [2.9.1](https://github.com/Forsakringskassan/docs-generator/compare/v2.9.0...v2.9.1) (2024-10-14)


### Bug Fixes

* **vue:** handle multiple `v-model` ([5fc40d9](https://github.com/Forsakringskassan/docs-generator/commit/5fc40d90fceabf84041aba951df5f38b20b8e6c0)), closes [#112](https://github.com/Forsakringskassan/docs-generator/issues/112)

## [2.9.0](https://github.com/Forsakringskassan/docs-generator/compare/v2.8.0...v2.9.0) (2024-10-11)


### Features

* add styling for mermaid git graph ([770bbc9](https://github.com/Forsakringskassan/docs-generator/commit/770bbc93e7a97b39cfb09a55a570ab72a0091478))
* new `sourceFiles` parameter to limit `sourceUrlProcessor` results ([30c7906](https://github.com/Forsakringskassan/docs-generator/commit/30c7906852533247a1c62f4710bbb3eb8bd9f876))


### Bug Fixes

* fix performance regression when using `sourceUrlProcessor` ([d024574](https://github.com/Forsakringskassan/docs-generator/commit/d02457409d9e647179bd2f78aa553213e58984c8))

## [2.8.0](https://github.com/Forsakringskassan/docs-generator/compare/v2.7.0...v2.8.0) (2024-10-09)


### Features

* support `<details>` element in markdown content ([ec2a9cd](https://github.com/Forsakringskassan/docs-generator/commit/ec2a9cde9c2fcc5d8bd8143187d52e1dad4b4511))
* support markdown content in messagebox titles ([36be401](https://github.com/Forsakringskassan/docs-generator/commit/36be401259809ef62857ee1fe1495bdcc3b2b2c9))


### Bug Fixes

* fix `cannot read property of null` when clicking on topnav ([6744894](https://github.com/Forsakringskassan/docs-generator/commit/6744894d84b441bfca17e0988f9c795eccaeebe2))

## [2.7.0](https://github.com/Forsakringskassan/docs-generator/compare/v2.6.0...v2.7.0) (2024-10-08)


### Features

* bundle highlight styling (refs SB-4982) ([be29bb1](https://github.com/Forsakringskassan/docs-generator/commit/be29bb1d8cc3c12d51e20470f4f35cbece0d877d))
* **deps:** update dependency chokidar to v4 ([b56cde2](https://github.com/Forsakringskassan/docs-generator/commit/b56cde23f50a3ddb6eaaf063c80771cbf1186d62))


### Bug Fixes

* **deps:** update dependency mermaid to v11.3.0 ([1e8e72c](https://github.com/Forsakringskassan/docs-generator/commit/1e8e72cbf81fa6ac102eb144d2295c47aa0d569d))
* make responsive menu hidden while page is loading ([5512b72](https://github.com/Forsakringskassan/docs-generator/commit/5512b720f8b24ed70a076838ab00984803b1e0ce))
* move responsive topnav styling to layout styling ([46c9c24](https://github.com/Forsakringskassan/docs-generator/commit/46c9c24dc933441eb0e9959901c82641ab2e0af9)), closes [#101](https://github.com/Forsakringskassan/docs-generator/issues/101) [#102](https://github.com/Forsakringskassan/docs-generator/issues/102)
* reload responsive menu on site navigation ([a613d6d](https://github.com/Forsakringskassan/docs-generator/commit/a613d6d8828c69c781b6336726dbb6146589787e)), closes [#100](https://github.com/Forsakringskassan/docs-generator/issues/100)
* rewrite moduleImporter (refs SB-4982) ([8ad44fc](https://github.com/Forsakringskassan/docs-generator/commit/8ad44fcf3e79396c486625452b1007b8b52f3aba))

## [2.6.0](https://github.com/Forsakringskassan/docs-generator/compare/v2.5.0...v2.6.0) (2024-10-05)


### Features

* add debounce method (refs SFKUI-6794) ([86ba797](https://github.com/Forsakringskassan/docs-generator/commit/86ba7974075bb3df2fa6f96544bba67b109cd514))
* add ipopupmenu styling (refs SFKUI-6794) ([98545d9](https://github.com/Forsakringskassan/docs-generator/commit/98545d9f41c17968dfebad13f5a3df73748c2564))
* new `{@optional}` tag ([428e685](https://github.com/Forsakringskassan/docs-generator/commit/428e68525290791e655a07a2c369d4c921707982))
* new layout `article` ([e55727f](https://github.com/Forsakringskassan/docs-generator/commit/e55727f70eecd5f2be559b265aa2db1bcae53a10))
* new messagebox container for rendering messageboxes ([d75c97e](https://github.com/Forsakringskassan/docs-generator/commit/d75c97e9db35dc3b3ee878c60cdd975a2323873b))
* responsive navbar (fixes SFKUI-6794) ([ce86247](https://github.com/Forsakringskassan/docs-generator/commit/ce862474e667f4c611cc0ce19467df7257317380))
* support `short-title` attribute ([863154b](https://github.com/Forsakringskassan/docs-generator/commit/863154b4865b79791d5496b0d8f309c14cf804c6))
* support definition lists ([63fd90b](https://github.com/Forsakringskassan/docs-generator/commit/63fd90b1adf7a051fb8d0ef6d1df701efee1c170))


### Bug Fixes

* branch name when running on github actions ([d4bbca5](https://github.com/Forsakringskassan/docs-generator/commit/d4bbca5a5586cafb43ad87df155267623e0e400e))
* fix clipped bullet in lists ([7519d60](https://github.com/Forsakringskassan/docs-generator/commit/7519d60782330ccb4e5de480c68c021859853a3f)), closes [#89](https://github.com/Forsakringskassan/docs-generator/issues/89)
* fix redos issue with inline tags ([8b7b92b](https://github.com/Forsakringskassan/docs-generator/commit/8b7b92bc72118cab8974ef731a234007f6b90f1f))
* handle inline tags with not content and multiple brackets ([5682319](https://github.com/Forsakringskassan/docs-generator/commit/568231946c71e383b2ff679a11f6754bb31e98bc))

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
