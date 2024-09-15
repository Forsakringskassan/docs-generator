/* @jest-environment jsdom */

import { promisify } from "node:util";
import nunjucks from "nunjucks";
import { TemplateLoader } from "../render/template-loader";
import { MOTDProcessorTemplateData as TemplateData } from "./motd-processor";

const loader = new TemplateLoader(["templates"]);
const njk = new nunjucks.Environment(loader, { autoescape: false });
const asyncRender = promisify<string, object, string>(njk.render);
const renderTemplate = asyncRender.bind(njk);
const template = "partials/motd-container.njk.html";

const motd = {
    get templateElement(): HTMLElement | null {
        return document.querySelector("#motd-message");
    },
    get containerElement(): HTMLElement | null {
        return document.querySelector("#motd-container");
    },
    get messageElements(): HTMLElement[] {
        return Array.from(
            document.querySelectorAll<HTMLElement>(
                "#motd-container .docs-motd",
            ),
        );
    },
};

it("should render template with static message", async () => {
    expect.assertions(5);
    const data: TemplateData = {
        message: "lorem ipsum",
    };
    const html = await renderTemplate(template, data);
    document.body.innerHTML = html;
    expect(motd.templateElement).toBeInstanceOf(HTMLTemplateElement);
    expect(motd.containerElement).toBeInstanceOf(HTMLElement);
    expect(motd.messageElements).toHaveLength(1);
    expect(motd.messageElements[0].textContent).toContain("lorem ipsum");
    expect(html).toMatchSnapshot();
});

it("should render template with static message with markup", async () => {
    expect.assertions(3);
    const data: TemplateData = {
        message: "lorem <em>ipsum</em>",
    };
    const html = await renderTemplate(template, data);
    document.body.innerHTML = html;
    expect(motd.messageElements).toHaveLength(1);
    const element = motd.messageElements[0];
    expect(element.textContent).toContain("lorem ipsum");
    expect(element.querySelector("em")!.textContent).toContain("ipsum");
});

it("should render template without static message", async () => {
    expect.assertions(4);
    const data: TemplateData = {
        message: undefined,
    };
    const html = await renderTemplate(template, data);
    document.body.innerHTML = html;
    expect(motd.templateElement).toBeInstanceOf(HTMLTemplateElement);
    expect(motd.containerElement).toBeInstanceOf(HTMLElement);
    expect(motd.messageElements).toHaveLength(0);
    expect(html).toMatchSnapshot();
});
