# Integration test: relative import

This integration test contains an imported Vue example which imports a sibling file with a relative path.
The directory used to resolve the import is derived from the example path (which uses `\` on Windows), so the build fails if it is resolved incorrectly.

- The build should succeed.
