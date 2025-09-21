import { formatSize } from "./format-size";

it.each`
    input         | output
    ${10}         | ${"10"}
    ${100}        | ${"100"}
    ${1000}       | ${"1 kB"}
    ${2345}       | ${"2.35 kB"}
    ${10000}      | ${"10 kB"}
    ${23456}      | ${"23.46 kB"}
    ${100000}     | ${"100 kB"}
    ${234567}     | ${"234.57 kB"}
    ${1000000}    | ${"1 MB"}
    ${2345678}    | ${"2.35 MB"}
    ${10000000}   | ${"10 MB"}
    ${23456789}   | ${"23.46 MB"}
    ${100000000}  | ${"100 MB"}
    ${234567890}  | ${"234.57 MB"}
    ${1000000000} | ${"1 GB"}
    ${2345678900} | ${"2.35 GB"}
`("should format $input", ({ input, output }) => {
    expect.assertions(1);
    expect(formatSize(input as number)).toBe(output);
});
