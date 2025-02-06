import { htmlencode } from "./htmlencode";

it("should encode characters", () => {
    expect.assertions(1);
    const text = `<script src="nasty.js?foo&bar">`;
    expect(htmlencode(text)).toMatchInlineSnapshot(
        `"&lt;script src=&quot;nasty.js?foo&amp;bar&quot;&gt;"`,
    );
});
