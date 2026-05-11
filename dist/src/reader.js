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
export function parse(string) {
    try {
        return JSON.parse(string);
    }
    catch {
        return null;
    }
}
;
