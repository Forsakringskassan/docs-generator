import markdownIt from "markdown-it";
import { table } from "./table";

const md = markdownIt();
md.use(table());

it("should render table with datatable classes", () => {
    expect.assertions(1);
    const markup = md.render(`
| name           | age |
|----------------|-----|
| Donald Duck    | 47  |
| Scrooge McDuck | 81  |
`);
    expect(markup).toMatchSnapshot();
});
