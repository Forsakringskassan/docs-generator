import { defineTestConfig as nodeConfig } from "@forsakringskassan/vitest-config";
import { defineTestConfig as browserConfig } from "@forsakringskassan/vitest-config-jsdom";
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        coverage: {
            enabled: true,
            exclude: ["**/index.ts"],
        },
        exclude: ["**/node_modules/**"],
        projects: [
            {
                extends: true,
                test: nodeConfig({
                    name: "node",
                    exclude: ["src/runtime/**/*.spec.ts"],
                    setupFiles: ["vitest.setup.mts"],
                    globalSetup: "vitest.global.mts",
                }),
            },
            {
                extends: true,
                test: browserConfig({
                    name: "browser",
                    include: ["src/runtime/**/**.spec.ts"],
                }),
            },
        ],
    },
});
