import { fileURLToPath } from "node:url";

const templateUrl = new URL("../templates", import.meta.url);
export const templateDirectory = fileURLToPath(templateUrl);
