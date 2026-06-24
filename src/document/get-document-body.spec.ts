import { expect, it, vi } from "vitest";
import { getDocumentBody } from "./get-document-body";

const text = "lorem ipsum";
const tags = ["mock-tags"];
const reference = { kind: "id", reference: "mock-id" } as const;

it("should return static body", () => {
    expect.assertions(1);
    const body = text;
    const document = { body };
    const result = getDocumentBody(document, tags, reference);
    expect(result).toBe(text);
});

it("should return dynamic body", () => {
    expect.assertions(2);
    const body = vi.fn().mockReturnValue(text);
    const document = { body };
    const result = getDocumentBody(document, tags, reference);
    expect(result).toBe(text);
    expect(body).toHaveBeenCalledWith(tags, reference);
});
