export function replaceAtLink(text: string): string {
    return text.replaceAll(/\{@link [^}]+[$}]/g, (match) => {
        return match.replace(/^\{/, "&lcub;").replace(/\}$/, "&rcub;");
    });
}
