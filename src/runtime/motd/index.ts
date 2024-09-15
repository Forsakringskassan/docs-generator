import { motd } from "./motd";
import { type MOTDApi } from "./motd-api";
import { motdSymbol } from "./motd-symbol";

declare global {
    interface Window {
        [motdSymbol]: MOTDApi;
    }
}

window[motdSymbol] = motd;
