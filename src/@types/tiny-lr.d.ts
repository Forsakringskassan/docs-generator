declare module "tiny-lr" {
    interface Server {
        listen(port?: number, host?: string, fn?: () => void): void;
        changed(req: { body: { files: string[] } }): void;
        close(): void;
    }

    function tinylr(): Server;

    export default tinylr;
}
