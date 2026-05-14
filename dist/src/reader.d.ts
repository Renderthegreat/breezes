export type Serializable = string | number | boolean | null | Array<Serializable> | {
    [x: string]: Serializable;
};
/**
 * Converts {@link Serializable} → {@link string}.
 *
 * @param data The data to stringify.
 * @returns {string | null} The stringified data.
 */
export declare function stringify(data: Serializable): string | null;
/**
 * Converts {@link string} → {@link Serializable | null}.
 *
 * @param string The string to parse.
 * @returns {Serializable | null} The parsed data.
 */
export declare function parse(string: string): Serializable | null;
