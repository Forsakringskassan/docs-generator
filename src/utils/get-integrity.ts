import crypto from "crypto";

export function getIntegrity(source: string): string {
    const hash = crypto.createHash("sha384").update(source).digest("base64");
    return `sha384-${hash}`;
}
