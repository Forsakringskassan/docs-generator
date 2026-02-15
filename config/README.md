This folder contains the [API Extractor][api-extractor] configuration files.

Each endpoint contains its own configuration file (inheriting from the base configuration in `api-extractor.json`).
The build script in `build.mjs` calls API Extractor programmatically using each configuration.

[api-extractor]: https://api-extractor.com/
