import Identifier from '#assets/identifier.json' with { type: 'json' };
import { Wind, } from '#~/wind';
import { WebSocketServer, } from 'ws';
import { EventEmitter, } from 'eventemitter3';
export class Blower extends EventEmitter {
    server;
    path;
    static __WebSocketServer__;
    // By default, use the *WebSocketServer* base.
    static {
        this.__WebSocketServer__ = WebSocketServer;
    }
    ;
    static async create(config) {
        const server = new WebSocketServer({
            perMessageDeflate: true,
            noServer: true,
        });
        return new Blower(server, config.path);
    }
    ;
    initialize(socket) {
        socket.once('message', (data) => {
            // TODO...
            socket.send(`"${Identifier.greeting}"`);
            // TODO...
            this.emit('connection', new Wind(socket /* TODO: Check the implications of this. */));
        });
    }
    constructor(server, path) {
        super();
        this.server = server;
        this.path = path;
        this.server.on('connection', (socket) => {
            this.initialize(socket);
        });
    }
    ;
    handle(request, socket, head) {
        this.server.handleUpgrade(request, socket, head, (socket, request) => {
            this.initialize(socket);
        });
    }
    ;
}
;
(function (Blower) {
    ;
    class Creator {
        // TODO: Document.
        static async create() {
            // Type declaration only.
            return null;
        }
        ;
    }
    Blower.Creator = Creator;
    ;
})(Blower || (Blower = {}));
;
export function blower(config) {
    return (target) => {
        target.create = async () => {
            return await Blower.create(config);
        };
    };
}
;
