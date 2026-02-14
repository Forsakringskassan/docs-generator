/* eslint-disable jest/no-large-snapshots -- for readability */

import path from "node:path";
import {
    type ApiDocumentedItem,
    type ApiItem,
    ApiModel,
} from "@microsoft/api-extractor-model";
import { documentation, documentationComment } from "./documentation";

const fixture = path.join(__dirname, "__fixtures__/model.api.json");

const apiModel = new ApiModel();
const apiPackage = apiModel.loadPackage(fixture);
const [entrypoint] = apiPackage.entryPoints;

expect.addSnapshotSerializer({
    test() {
        return true;
    },
    serialize(value) {
        return String(value);
    },
});

function isDocumentedItem(item: ApiItem): item is ApiDocumentedItem {
    return "tsdocComment" in item;
}

function findItem(name: string): ApiDocumentedItem | undefined {
    return entrypoint.members
        .filter(isDocumentedItem)
        .find((it) => "name" in it && it.name === name);
}

describe("documentation()", () => {
    it("should return single line documentation", () => {
        expect.assertions(1);
        const item = findItem("docSingleline");
        const result = documentation(item);
        expect(result).toMatchInlineSnapshot(`lorem ipsum dolor sit amet`);
    });

    it("should return multiline documentation", () => {
        expect.assertions(1);
        const item = findItem("docMultiline");
        const result = documentation(item);
        expect(result).toMatchInlineSnapshot(`
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.

            Duis tincidunt justo ut augue volutpat ultricies.
        `);
    });

    it("should preserve markdown formatting", () => {
        expect.assertions(1);
        const item = findItem("docMarkdown");
        const result = documentation(item);
        expect(result).toMatchInlineSnapshot(`
            Lorem ipsum dolor sit amet.

            - List item 1
            - List item 2
            - List item 3

            * Another list
            * using asterisks
            * instead of dashes.

            Markdown **formatting**.
        `);
    });

    it("should render summary block only", () => {
        expect.assertions(1);
        const item = findItem("docBlocktag");
        const result = documentation(item);
        expect(result).toMatchInlineSnapshot(`Lorem ipsum dolor sit amet.`);
    });

    it("should handle node without documentation", () => {
        expect.assertions(1);
        const item = findItem("docWithoutDocumentation");
        const result = documentation(item);
        expect(result).toMatchInlineSnapshot(``);
    });

    it("should handle undefined node", () => {
        expect.assertions(1);
        const result = documentation(undefined);
        expect(result).toBeUndefined();
    });

    it("should return empty string for whitespace-only documentation", () => {
        expect.assertions(1);
        const item = findItem("docWhitespace");
        const result = documentation(item);
        expect(result).toMatchInlineSnapshot(``);
    });

    it("should trim leading and trailing empty lines", () => {
        expect.assertions(1);
        const item = findItem("docLeadingTrailing");
        const result = documentation(item);
        expect(result).toMatchInlineSnapshot(`Lorem ipsum dolor sit amet.`);
    });

    it("should collapse multiple consecutive blank lines", () => {
        expect.assertions(1);
        const item = findItem("docMultipleBlanks");
        const result = documentation(item);
        expect(result).toMatchInlineSnapshot(`
            First paragraph.

            Second paragraph after multiple blanks.
        `);
    });

    it("should preserve HTML entities", () => {
        expect.assertions(1);
        const item = findItem("docHtmlEntities");
        const result = documentation(item);
        expect(result).toMatchInlineSnapshot(
            `HTML entities: &lt;div&gt;, &amp;, &copy;, &#8217;`,
        );
    });

    it("should preserve special characters", () => {
        expect.assertions(1);
        const item = findItem("docSpecialChars");
        const result = documentation(item);
        expect(result).toMatchInlineSnapshot(
            `Special chars: / \\\\ \\# $ % ^ & ( ) + = \\{ \\} [ ] | ; : ' " , . \\< \\> ?`,
        );
    });

    it("should preserve code fences with triple backticks", () => {
        expect.assertions(1);
        const item = findItem("docCodeFence");
        const result = documentation(item);
        expect(result).toMatchInlineSnapshot(`
            Code example:
            \`\`\`typescript
            const x = 1;
            function foo() {}
            \`\`\`
        `);
    });

    it("should preserve unicode and emoji", () => {
        expect.assertions(1);
        const item = findItem("docUnicodeEmoji");
        const result = documentation(item);
        expect(result).toMatchInlineSnapshot(`☃️`);
    });
});

describe("documentationComment()", () => {
    it("should return single line documentation", () => {
        expect.assertions(1);
        const item = findItem("docSingleline");
        const result = documentationComment(item);
        expect(result).toMatchInlineSnapshot(`
            /**
             * lorem ipsum dolor sit amet
             */
        `);
    });

    it("should return multiline documentation", () => {
        expect.assertions(1);
        const item = findItem("docMultiline");
        const result = documentationComment(item);
        expect(result).toMatchInlineSnapshot(`
            /**
             * Lorem ipsum dolor sit amet, consectetur adipiscing elit.
             *
             * Duis tincidunt justo ut augue volutpat ultricies.
             */
        `);
    });

    it("should preserve markdown formatting", () => {
        expect.assertions(1);
        const item = findItem("docMarkdown");
        const result = documentationComment(item);
        expect(result).toMatchInlineSnapshot(`
            /**
             * Lorem ipsum dolor sit amet.
             *
             * - List item 1
             * - List item 2
             * - List item 3
             *
             * * Another list
             * * using asterisks
             * * instead of dashes.
             *
             * Markdown **formatting**.
             */
        `);
    });

    it("should handle node without documentation", () => {
        expect.assertions(1);
        const item = findItem("docWithoutDocumentation");
        const result = documentationComment(item);
        expect(result).toMatchInlineSnapshot(``);
    });

    it("should handle undefined node", () => {
        expect.assertions(1);
        const result = documentationComment(undefined);
        expect(result).toBeUndefined();
    });

    it("should return empty string for whitespace-only documentation", () => {
        expect.assertions(1);
        const item = findItem("docWhitespace");
        const result = documentationComment(item);
        expect(result).toMatchInlineSnapshot(``);
    });

    it("should trim leading and trailing empty lines", () => {
        expect.assertions(1);
        const item = findItem("docLeadingTrailing");
        const result = documentationComment(item);
        expect(result).toMatchInlineSnapshot(`
            /**
             * Lorem ipsum dolor sit amet.
             */
        `);
    });

    it("should collapse multiple consecutive blank lines", () => {
        expect.assertions(1);
        const item = findItem("docMultipleBlanks");
        const result = documentationComment(item);
        expect(result).toMatchInlineSnapshot(`
            /**
             * First paragraph.
             *
             * Second paragraph after multiple blanks.
             */
        `);
    });

    it("should preserve HTML entities", () => {
        expect.assertions(1);
        const item = findItem("docHtmlEntities");
        const result = documentationComment(item);
        expect(result).toMatchInlineSnapshot(`
            /**
             * HTML entities: &lt;div&gt;, &amp;, &copy;, &#8217;
             */
        `);
    });

    it("should preserve special characters", () => {
        expect.assertions(1);
        const item = findItem("docSpecialChars");
        const result = documentationComment(item);
        expect(result).toMatchInlineSnapshot(`
            /**
             * Special chars: / \\\\ \\# $ % ^ & ( ) + = \\{ \\} [ ] | ; : ' " , . \\< \\> ?
             */
        `);
    });

    it("should preserve code fences with triple backticks", () => {
        expect.assertions(1);
        const item = findItem("docCodeFence");
        const result = documentationComment(item);
        expect(result).toMatchInlineSnapshot(`
            /**
             * Code example:
             * \`\`\`typescript
             * const x = 1;
             * function foo() {}
             * \`\`\`
             */
        `);
    });

    it("should preserve unicode and emoji", () => {
        expect.assertions(1);
        const item = findItem("docUnicodeEmoji");
        const result = documentationComment(item);
        expect(result).toMatchInlineSnapshot(`
            /**
             * ☃️
             */
        `);
    });
});
