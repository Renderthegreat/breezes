import EventEmitter from 'eventemitter3';

import * as Reader from '#~/reader';
import * as Codes from '#~/codes';

export class Device extends EventEmitter<Device.Events> {
	private queue: Reader.Serializable[] = [];

	private peerIdentity: /* TODO: Add this type. */ | null = null;

	public constructor(
		protected socket: WebSocket,
	) {
		super();

		socket.addEventListener('message', (event) => {
			const data = Reader.parse(event.data);

			if (data === null) {
				// TODO: Make this configurable.
				socket.close(Codes.Disconnect.InvalidPayloadData);
			
				return;
			};

			this.queue.push(data);
			this.emit('packet', data);
		});

		socket.addEventListener('close', (event) => {
			this.emit('disconnect', event.code, event.reason);
		});
	};

	public send(data: Reader.Serializable): void {
		const string = Reader.stringify(data);
		
		if (string === null) {
			return;
		};

		this.socket.send(string);
	};

	public async * receiver(): AsyncGenerator<Reader.Serializable, Device.Disconnect, unknown> {
		const queue: Reader.Serializable[] = [];

		let next: { resolve: (() => void) | null, reject: ((error: Error) => void) | null, } = {
			resolve: null,
			reject: null,
		};

		let disconnectInfo: Device.Disconnect | null = null;


		this.on('packet', (packet) => {
			queue.push(packet);

			next.resolve?.();
			next.resolve = null;
		});

		this.once('disconnect', (code, reason) => {
			console.log(`Disconnected from server!`);

			next.resolve?.(); // Wake up the loop to handle the disconnect.

			disconnectInfo = {
				code: code,
				reason: reason,
			};
		});

		while (true) {
			// Yield all items currently in the queue.
			while (queue.length > 0) {
				yield queue.shift()!;
			};

			// Ensure that we don't `await` the promise, which will be unsettled.
			if (this.socket.readyState === Codes.ConnectionState.Closed) {
				return disconnectInfo!;
				// Subsequent calls of `next` should give errors.
			};

			await new Promise<void>((resolve, reject) => {
				next.resolve = resolve;
				next.reject = reject;
			});
		};
	};
};

export namespace Device {
	export interface Events {
		packet: (packet: Reader.Serializable) => void;
		disconnect: (code: number, reason: string) => void;
	};

	export type Disconnect = {
		code: number,
		reason: string,
	};
};