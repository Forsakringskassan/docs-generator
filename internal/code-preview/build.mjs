import { Extractor, ExtractorConfig } from "@microsoft/api-extractor";
import esbuild from "esbuild";
import isCI from "is-ci";

try {
    const result = await esbuild.build({
        entryPoints: ["src/index.ts"],
        bundle: true,
        metafile: true,
        sourcemap: true,
        format: "esm",
        platform: "browser",
        target: ["es2022"],
        outfile: "dist/index.js",
        loader: {
            ".css": "text",
            ".html": "text",
        },
        logLevel: "info",
    });
    console.log(await esbuild.analyzeMetafile(result.metafile));

    if (isCI) {
        console.group(`Running API Extractor in CI mode.`);
    } else {
        console.group(`Running API Extractor in local mode.`);
    }
    const config = ExtractorConfig.loadFileAndPrepare("api-extractor.json");
    const extractorResult = Extractor.invoke(config, {
        localBuild: !isCI,
        showVerboseMessages: true,
    });

    if (extractorResult.succeeded) {
        console.log(`API Extractor completed successfully`);
    } else {
        const { errorCount, warningCount } = extractorResult;
        console.error(
            [
                "API Extractor completed with",
                `${errorCount} error(s) and ${warningCount} warning(s)`,
            ].join("\n"),
        );
        process.exitCode = 1;
    }
    console.groupEnd();
} catch (error) {
    console.error(error);
    process.exitCode = 1;
}
