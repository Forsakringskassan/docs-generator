export function replaceAtLink(text: string): string {
    return text.replaceAll(/{@link [^}]+[$}]/g, (match) =>
        match.replace(/^{/, "&lcub;").replace(/}$/, "&rcub;"),
    );
}
