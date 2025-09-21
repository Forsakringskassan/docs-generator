import { promisify } from "node:util";
import nunjucks from "nunjucks";
import { TemplateLoader } from "../render/template-loader";
import { type VersionProcessorTemplateData as TemplateData } from "./version-processor";

const pkg = {
    name: "mock-package",
    version: "1.2.3",
    homepage: "https://example.net",
};

const build = {
    date: "1999-12-31",
    time: "13:37:00",
};

describe("should render correctly", () => {
    const loader = new TemplateLoader(["templates"]);
    const njk = new nunjucks.Environment(loader, { autoescape: false });
    const asyncRender = promisify<string, object, string>(njk.render); // eslint-disable-line @typescript-eslint/unbound-method -- technical debt */
    const renderTemplate = asyncRender.bind(njk);
    const template = "partials/version.njk.html";

    it("without scm data", async () => {
        expect.assertions(1);
        const data: TemplateData = {
            pkg,
            build,
            scm: null,
        };
        const result = await renderTemplate(template, data);
        expect(result).toMatchSnapshot();
    });

    it("without PR data", async () => {
        expect.assertions(1);
        const data: TemplateData = {
            pkg,
            build,
            scm: {
                branch: "feature/foobar",
                commitUrl: "https://example.net/commits/c0ffee",
                commitShort: "c0ffee",
                commitHash: "c0ffeedeadbeeffdfdfdfd",
                pr: undefined,
                prUrl: undefined,
            },
        };
        const result = await renderTemplate(template, data);
        expect(result).toMatchSnapshot();
    });

    it("with all data", async () => {
        expect.assertions(1);
        const data: TemplateData = {
            pkg,
            build,
            scm: {
                branch: "feature/foobar",
                commitUrl: "https://example.net/commits/c0ffee",
                commitShort: "c0ffee",
                commitHash: "c0ffeedeadbeeffdfdfdfd",
                pr: "123",
                prUrl: "https://example.net/pull-requests/123",
            },
        };
        const result = await renderTemplate(template, data);
        expect(result).toMatchSnapshot();
    });
});
