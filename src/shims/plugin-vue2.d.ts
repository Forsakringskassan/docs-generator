declare module "esbuild-vue" {
    import { type Plugin } from "esbuild";

    const value: (options?: { workers?: false | number }) => Plugin;
    export default value;
}
