export function replaceAtLink(text: string): string {
    return text.replace(/{@link [^}]+[$}]/g, (match) =>
        match.replace(/^{/, "&lcub;").replace(/}$/, "&rcub;"),
    );
}
