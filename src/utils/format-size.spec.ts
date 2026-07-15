import { expect, it } from "vitest";
import { formatSize } from "./format-size";

it.each`
    input            | output
    ${10}            | ${"10"}
    ${100}           | ${"100"}
    ${1000}          | ${"1 kB"}
    ${2345}          | ${"2.35 kB"}
    ${10_000}        | ${"10 kB"}
    ${23_456}        | ${"23.46 kB"}
    ${100_000}       | ${"100 kB"}
    ${234_567}       | ${"234.57 kB"}
    ${1_000_000}     | ${"1 MB"}
    ${2_345_678}     | ${"2.35 MB"}
    ${10_000_000}    | ${"10 MB"}
    ${23_456_789}    | ${"23.46 MB"}
    ${100_000_000}   | ${"100 MB"}
    ${234_567_890}   | ${"234.57 MB"}
    ${1_000_000_000} | ${"1 GB"}
    ${2_345_678_900} | ${"2.35 GB"}
`("should format $input", ({ input, output }) => {
    expect.assertions(1);
    expect(formatSize(input as number)).toBe(output);
});
