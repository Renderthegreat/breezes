import { Blower, } from '#~/blower';

import HTTP from 'node:http';

export class Router {
	protected routes: Map<string, Blower> = new Map();

	public constructor(
		private server: HTTP.Server,
	) {
		this.server.on('upgrade', (request, socket, head) => {
			const { pathname: path, } = new URL(`http://${request.headers.host}${request.url}`);
			
			if (this.routes.keys().toArray().includes(path)) {

				this.routes.get(path)?.handle(request, socket, head);
			} else {
				console.log(this.routes.keys());
			};
		});
	};

	public push(blower: Blower) {
		this.routes.set(blower.path, blower);
	};
};