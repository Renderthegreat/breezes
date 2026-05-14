import Identifier from '#assets/identifier.json' with { type: 'json', };

import { Device, } from '#~/device';
import * as Reader from '#~/reader';

export class Wind extends Device {
	protected static __WebSocket__: typeof WebSocket;

	// By default, use the *WebSocket* base.
	static {
		this.__WebSocket__ = globalThis.WebSocket;
	};

	public static async connect(config: Wind.Config): Promise<Wind> {
		const socket = new this.__WebSocket__(config.location);

		return new Promise((resolve, reject) => {
			socket.addEventListener('open', async () => {
				socket.send(`"${Identifier.greeting}"`);
				
				let response = await (new Promise<string>((resolve, reject) => {
					function listener(event: MessageEvent<string>) {
						socket.removeEventListener('message', listener);

						resolve(Reader.parse(event.data) as string);
					};

					socket.addEventListener('message', listener);

					/*if (config.timeout !== undefined) {
						setTimeout(reject, config.timeout);
					};*/
				}));

				if (response !== Identifier.greeting) {
					reject("The server did not return the correct identifier.");
				};
					
				/*if (config.doNotInquirePeerInfo !== true) {
					response = await (new Promise<string>((resolve, reject) => {
						function listener(event: MessageEvent<string>) {
							socket.removeEventListener('message', listener);
	
							resolve(event.data);
						};
	
						socket.addEventListener('message', listener);
	
						if (config.timeout !== undefined) {
							setTimeout(reject, config.timeout);
						};
					}));
				};*/

				// The *WebSocket* is ready.

				const wind = new Wind(socket);

				// ...

				resolve(wind);
			});

			socket.addEventListener('error', (error) => {
				reject(error);
			});
		});
	};
};

export namespace Wind {
	export type Config = {
		/**
		 * The location at which the *WebSocket* lives.
		 */
		location: URL,
		/**
		 * The maximum time (in milliseconds) given for the server to respond to the inital connection.
		 */
		timeout?: number,

		// TODO: Remove this message when convenient.
		/**
		 * Should the packets be type validated (using *Zod*)?
		 * This option is not great when many packets are received quickly.
		 */
		//validateStructure?: boolean,
	};

	export class Creator {
		/**
		 * Connects to a {@link Blower} instance.
		 * 
		 * @param location The location of the *WebSocket*.
		 * 
		 */
		public static async connect(): Promise<Wind> {
			// Type declaration only.
			return null as any;
		};
	};
};

export function wind<T>(config: Wind.Config): (...args: any) => void {
	return (target: any) => {
		target.connect = async () => {
			return await Wind.connect(config);
		};
	};
};