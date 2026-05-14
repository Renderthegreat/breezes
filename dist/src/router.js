export class Router {
    server;
    routes = new Map();
    constructor(server) {
        this.server = server;
        this.server.on('upgrade', (request, socket, head) => {
            const { pathname: path, } = new URL(`http://${request.headers.host}${request.url}`);
            if (this.routes.keys().toArray().includes(path)) {
                this.routes.get(path)?.handle(request, socket, head);
            }
            else {
                console.log(this.routes.keys());
            }
            ;
        });
    }
    ;
    push(blower) {
        this.routes.set(blower.path, blower);
    }
    ;
}
;
