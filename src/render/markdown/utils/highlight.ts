import hljs from "highlight.js/lib/common";

const HTML_ESCAPE_REPLACE_RE = /[&<>"]/g;
const HTML_REPLACEMENTS: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
};

function escapeHtml(str: string): string {
    return str.replace(HTML_ESCAPE_REPLACE_RE, (ch) => HTML_REPLACEMENTS[ch]);
}

function wrap(content: string, language: string): string {
    const markup = /* HTML */ `
        <code class="hljs lang-${language}" tabindex="0">${content}</code>
    `;
    return markup.trim();
}

/**
 * @internal
 */
export function highlight({
    source,
    language,
}: {
    source: string;
    language: string;
}): string {
    switch (language) {
        case "":
        case "import":
        case "mermaid":
        case "plaintext":
            return `<code>${escapeHtml(source)}</code>`;
        case "vue":
            return highlight({ source, language: "html" });
        case "html":
    }
    try {
        const { value } = hljs.highlight(source, { language });
        return wrap(value, language);
    } catch (err) {
        return wrap(String(err), language);
    }
}
