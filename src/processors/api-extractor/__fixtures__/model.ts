/* this symbol has no documentation block (this is a regular code comment, not a documentation block) */
export const docWithoutDocumentation = 1;

/** lorem ipsum dolor sit amet */
export const docSingleline = 1;

/**
 * Lorem ipsum dolor
 * sit amet, consectetur
 * adipiscing elit.
 *
 * Duis tincidunt justo ut
 * augue volutpat ultricies.
 */
export const docMultiline = 1;

/**
 * Lorem ipsum dolor sit amet.
 *
 * - List item 1
 * - List item 2
 * - List item 3
 *
 * * Another list
 * * using asterisks
 * * instead of dashes.
 *
 * Markdown **formatting**.
 */
export const docMarkdown = 1;

/**
 * Lorem ipsum dolor sit amet.
 *
 * @remarks
 *
 * Consectetur adipiscing elit.
 *
 * @privateRemarks
 *
 * Duis tincidunt justo ut.
 */
export const docBlocktag = 1;

/**
 *
 */
export const docWhitespace = 1;

/**
 *
 * Lorem ipsum dolor sit amet.
 *
 *
 */
export const docLeadingTrailing = 1;

/**
 * First paragraph.
 *
 *
 *
 * Second paragraph after multiple blanks.
 */
export const docMultipleBlanks = 1;

/**
 * HTML entities: &lt;div&gt;, &amp;, &copy;, &#8217;
 */
export const docHtmlEntities = 1;

/**
 * Special chars: / \\ \# $ % ^ & ( ) + = \{ \} [ ] | ; : ' " , . \< \> ?
 */
export const docSpecialChars = 1;

/**
 * Code example:
 *
 * ```typescript
 * const x = 1;
 * function foo() {}
 * ```
 */
export const docCodeFence = 1;

/**
 * ☃️
 */
export const docUnicodeEmoji = 1;
