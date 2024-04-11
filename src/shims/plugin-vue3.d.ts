declare module "esbuild-plugin-vue3" {
    import { type Plugin } from "esbuild";

    const value: () => Plugin;
    export default value;
}
