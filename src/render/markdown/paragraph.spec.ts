import markdownIt from "markdown-it";
import { paragraph } from "./paragraph";

const md = markdownIt();
md.use(paragraph());

it("should render paragraph with class", () => {
    expect.assertions(1);
    const markup = md.render(`
lorem ipsum
dolor sit amet

foo bar baz
spam ham
`);
    expect(markup).toMatchSnapshot();
});

it("should not add paragraph to list items", () => {
    expect.assertions(1);
    const markup = md.render(`
- foo
- bar
- baz

lorem ipsum

* spam
* ham
`);
    expect(markup).toMatchSnapshot();
});
