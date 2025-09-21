/**
 * @public
 */
export interface SoftErrorDetails {
    ELINKTARGET: {
        key: string;
        hash: string | undefined;
        title: string | undefined;
    };
    ELINKFORMAT: undefined;
    ELINKPARTIAL: {
        key: string;
        hash: string | undefined;
        title: string | undefined;
    };
    EINCLUDETARGET: { id: string };
    EINCLUDERECURSION: undefined;
    ETAGMISSING: undefined;
}

/**
 * @public
 */
export type SoftErrorCode = keyof SoftErrorDetails;

/**
 * A soft error than can be recovered from.
 *
 * @public
 */
export class SoftError<T extends SoftErrorCode> extends Error {
    public readonly code: T;
    public readonly details: SoftErrorDetails[T];

    /**
     * @internal
     */
    public constructor(
        code: T,
        message: string,
        ...args: SoftErrorDetails[T] extends undefined
            ? []
            : [SoftErrorDetails[T]]
    ) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        const [details] = args;

        /* eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style -- works as intended */
        this.details = details as typeof this.details;
    }
}

/**
 * @public
 */
export type SoftErrorType = {
    [T in SoftErrorCode]: SoftError<T>;
}[SoftErrorCode];
