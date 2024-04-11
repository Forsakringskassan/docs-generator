import { replaceAtLink } from "./replace-at-link";

it("should replace all {@link ...}", () => {
    expect.assertions(1);
    const input = `See {@link MyAwesomeComponent} for details or the {@link getting-started getting started guide}.`;
    expect(replaceAtLink(input)).toMatchInlineSnapshot(
        `"See &lcub;@link MyAwesomeComponent&rcub; for details or the &lcub;@link getting-started getting started guide&rcub;."`,
    );
});
