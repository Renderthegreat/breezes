export type Serializable = string | number | boolean | null | Array<Serializable> | {
    [x: string]: Serializable;
};
export declare function stringify(data: Serializable): string | null;
export declare function parse(string: string): Serializable | null;
