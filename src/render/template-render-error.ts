const messageRegex = /^[(][^)]+[)] \[Line \d+, Column \d+\]\n\s+Error: (.*)$/;

/**
 * Extracts the actual error message from a nunjucks render error.
 *
 * The error instance should have properties such as `.cause` but these are lost
 * somewhere so this serves as a workaround.
 *
 * @internal
 */
export function getActualMessage(message: string): string {
    const match = message.match(messageRegex);
    if (match) {
        return match[1].trim();
    } else {
        return message;
    }
}

/**
 * @internal
 */
export class TemplateRenderError extends Error {
    private readonly filename: string;

    public constructor(message: string, filename: string) {
        super(getActualMessage(message));
        this.name = "RenderError";
        this.filename = filename;
    }

    public prettyError(): string {
        return [
            `An error occured when rendering a document.`,
            `  Document: "${this.filename}".`,
            `  Message: ${this.message}`,
        ].join("\n");
    }
}
