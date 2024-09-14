import { getRepositoryUrl } from "./get-repository-url";

it("should normalize git+https://", () => {
    expect.assertions(1);
    const url = getRepositoryUrl("git+https://example.com/org/repo.git");
    expect(url).toBe("https://example.com/org/repo");
});

it("should normalize git+ssh://", () => {
    expect.assertions(1);
    const url = getRepositoryUrl("git+ssh://git@example.com:org/repo.git");
    expect(url).toBe("https://example.com/org/repo");
});

it("should normalize https://", () => {
    expect.assertions(1);
    const url = getRepositoryUrl("https://example.com/org/repo.git");
    expect(url).toBe("https://example.com/org/repo");
});

it("should normalize ssh (with protocol)", () => {
    expect.assertions(1);
    const url = getRepositoryUrl("ssh://git@example.com:org/repo.git");
    expect(url).toBe("https://example.com/org/repo");
});

it("should normalize ssh (without protocol)", () => {
    expect.assertions(1);
    const pkg = { repository: { url: "git@example.com:org/repo.git" } };
    const url = getRepositoryUrl(pkg);
    expect(url).toBe("https://example.com/org/repo");
});

it("should normalize .git suffix", () => {
    expect.assertions(2);
    const url1 = getRepositoryUrl("git+https://example.com/org/repo.git");
    const url2 = getRepositoryUrl("git+https://example.com/org/repo");
    expect(url1).toBe("https://example.com/org/repo");
    expect(url2).toBe("https://example.com/org/repo");
});

it("should handle passing in package.json object directly", () => {
    expect.assertions(1);
    const pkg = { repository: { url: "git+https://example.com/org/repo.git" } };
    const url = getRepositoryUrl(pkg);
    expect(url).toBe("https://example.com/org/repo");
});

it("should return null if package.json object is missing repository field", () => {
    expect.assertions(2);
    expect(getRepositoryUrl({})).toBeNull();
    expect(getRepositoryUrl({ repository: {} })).toBeNull();
});
