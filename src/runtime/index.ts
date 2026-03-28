import { setup } from "code-preview";
import "./mermaid";
import "./navigation";
import "./search";
import "./table-of-contents";
import "./version-banner";
import "./cookie";
import "./topnav";

export {
    type MOTDApi,
    type MOTDMessage,
    motdProxy as motd,
} from "./motd/motd-proxy";
export { onContentReady } from "./on-content-ready";

setup();
