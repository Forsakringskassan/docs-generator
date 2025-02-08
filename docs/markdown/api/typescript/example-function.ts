/**
 * Adds the numbers together.
 *
 * @example
 *
 * ```ts
 * add(1, 2); // --> 3
 * add(1, 2, 3); // --> 6
 * ```
 *
 * @public
 * @param a - First number to add.
 * @param b - Second number to add.
 * @param c - Optional third number to add.
 * @returns The sum of the numbers.
 */
export function exampleFunction(a: number, b: number, c?: number): number {
    return a + b + (c ?? 0);
}
