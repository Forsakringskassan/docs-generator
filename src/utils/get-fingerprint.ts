import crypto from "node:crypto";

export function getFingerprint(source: string): string {
    /* eslint-disable-next-line sonarjs/hashing -- technical debt, not used in a sensitive context but could still be replaced */
    return crypto.createHash("md5").update(source).digest("hex").slice(0, 6);
}
