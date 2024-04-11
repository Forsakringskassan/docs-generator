import { highlight } from "./highlight";

it("should render syntax highlighting", () => {
    expect.assertions(1);
    const source = `export const meaningOfLife = 42;`;
    expect(highlight({ source, language: "ts" })).toMatchSnapshot();
});

it("should render vue as html", () => {
    expect.assertions(1);
    const source = /* HTML */ `
        <template>
            <p>lorem ipsum dolor sit amet</p>
        </template>

        <script>
            import { defineComponent } from "vue";
            export default defineComponent({
                name: "MyAwesomeComponent",
            });
        </script>
    `;
    expect(highlight({ source, language: "vue" })).toMatchSnapshot();
});

it("should render plaintext without syntax highlighing", () => {
    expect.assertions(1);
    const source = `export const meaningOfLife = 42;`;
    expect(highlight({ source, language: "plaintext" })).toMatchSnapshot();
});

it("should handle missing language as plaintext", () => {
    expect.assertions(1);
    const source = `export const meaningOfLife = 42;`;
    expect(highlight({ source, language: "" })).toMatchSnapshot();
});

it("should escape html in plaintext", () => {
    expect.assertions(1);
    const source = `<script>alert("xss")</script>`;
    expect(highlight({ source, language: "plaintext" })).toMatchSnapshot();
});
