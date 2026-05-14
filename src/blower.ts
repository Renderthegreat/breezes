import Identifier from '#assets/identifier.json' with { type: 'json', };

import { Device, } from '#~/device';
import { Wind, } from '#~/wind';

import WebSocket2, { WebSocketServer, } from 'ws';

import HTTP from 'node:http';
import Stream from 'node:stream';

import { EventEmitter, } from 'eventemitter3';


export class Blower extends EventEmitter<Blower.Events> {
	protected static __WebSocketServer__: typeof WebSocketServer;

	// By default, use the *WebSocketServer* base.
	static {
		this.__WebSocketServer__ = WebSocketServer;
	};

	public static async create(config: Blower.Config): Promise<Blower> {
		const server = new WebSocketServer({
			perMessageDeflate: true,

			noServer: true,
		});

		return new Blower(server, config.path);
	};

	private initialize(socket: WebSocket2) {
		socket.once('message', (data) => {
			// TODO: Check identity...

			socket.send(`"${Identifier.greeting}"`);

			// TODO: ...

			this.emit('connection', new Wind(socket as unknown as WebSocket /* TODO: Check the implications of this. */));
		});
	}


	private constructor(
		private server: WebSocketServer,
		public readonly path: string,
	) {
		super();

		this.server.on('connection', (socket) => {
			this.initialize(socket);
		});
	};

	public handle(request: HTTP.IncomingMessage, socket: Stream.Duplex, head: Buffer<ArrayBuffer>) {
		this.server.handleUpgrade(request, socket, head, (socket, request) => {
			this.initialize(socket);
		});
	};
};

export namespace Blower {
	export type Config = {
		// server: Server,

		path: string,
	};

	export interface Events {
		connection: (socket: Wind) => void;
	};

	export class Creator {
		// TODO: Document.
		public static async create(): Promise<Blower> {
			// Type declaration only.
			return null as any;
		};
	};
};

export function blower<T>(config: Blower.Config): (...args: any) => void {
	return (target: any) => {
		target.create = async () => {
			return await Blower.create(config);
		};
	};
};