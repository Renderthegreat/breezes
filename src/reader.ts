export type Serializable =
	| string
	| number
	| boolean
	| null

	| Array<Serializable>
	| { [x: string]: Serializable, }
;


export function stringify(data: Serializable): string | null {
	try {
		return JSON.stringify(data);
	} catch {
		return null;
	};
};

export function parse(string: string): Serializable | null {
	try {
		return JSON.parse(string);
	} catch {
		return null;
	}
};