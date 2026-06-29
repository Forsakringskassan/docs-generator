import crypto from "node:crypto";

export function getFingerprint(source: string): string {
    return crypto.createHash("md5").update(source).digest("hex").slice(0, 6);
}
