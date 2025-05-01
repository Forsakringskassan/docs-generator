import { fileURLToPath } from "node:url";

const path = new URL("../tsconfig-examples.json", import.meta.url);
export const tsconfigPath = fileURLToPath(path);
