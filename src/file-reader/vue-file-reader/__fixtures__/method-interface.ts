export interface ExternalMethodProps {
    id: string;
    /**
     * Lorem ipsum.
     */
    format?(value: string, options: { pad: number }): string;
}
