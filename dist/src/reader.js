// import Z from 'zod';
/**
 * Converts {@link Serializable} → {@link string}.
 *
 * @param data The data to stringify.
 * @returns {string | null} The stringified data.
 */
export function stringify(data) {
    try {
        return JSON.stringify(data);
    }
    catch {
        return null;
    }
    ;
}
;
/**
 * Converts {@link string} → {@link Serializable | null}.
 *
 * @param string The string to parse.
 * @returns {Serializable | null} The parsed data.
 */
export function parse(string) {
    try {
        return JSON.parse(string);
    }
    catch {
        return null;
    }
    ;
}
;
