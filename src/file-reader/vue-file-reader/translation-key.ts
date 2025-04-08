/**
 * Description of a translation key.
 *
 * @internal
 */
export interface TranslationKey {
    /** Translation key */
    name: string;
    /** Default translation */
    defaultTranslation: string | null;
    /** Description of when/how this translation is used */
    description: string | null;
    /** Parameters available for this translation */
    parameters: Array<{ name: string; description: string | null }>;
}
