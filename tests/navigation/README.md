# Integration test: Navigation

This integration test contains a project with some base features enabled. This is used to verify that the navigation behaves as expected.

- The build should succeed.
- Tests in [`cypress/e2e/integration-tests/navigation.cy.ts`](../../cypress/e2e/integration-tests/navigation.cy.ts) should succeed.

This site has enabled:

- Cookie warning (`cookieProcessor`) - should show a cookie warning.
- MOTD (`motdProcessor`) - should display a message at the top of the page.
- Search (`searchProcessor`) - should have a working search function.
- Selectable version (`selectableVersionProcessor`) - should display the version selector.
- Version (`versionProcessor`) - should display the version and scm information in the header.
