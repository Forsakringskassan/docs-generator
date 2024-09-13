import { getPullRequestID } from "./get-pull-request-id";

it("should get pull request id from Jenkins", () => {
    expect.assertions(2);
    const prEnv = { JOB_BASE_NAME: "PR-123" };
    const branchEnv = { JOB_BASE_NAME: "awesome-branch" };
    expect(getPullRequestID(prEnv)).toBe("123");
    expect(getPullRequestID(branchEnv)).toBeUndefined();
});

it("should get pull request id from Github Actions", () => {
    expect.assertions(2);
    const prEnv = { GITHUB_REF: "refs/pull/123/merge" };
    const branchEnv = { GITHUB_REF: "refs/heads/feature/awesome-branch" };
    expect(getPullRequestID(prEnv)).toBe("123");
    expect(getPullRequestID(branchEnv)).toBeUndefined();
});

it("should return undefined if no pull request id is found", () => {
    expect.assertions(1);
    const env = {};
    expect(getPullRequestID(env)).toBeUndefined();
});
