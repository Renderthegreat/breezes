import { createRequire, } from 'node:module';
const require = createRequire(import.meta.url);
const { WebSocketServer, } = require('ws');
const server = new WebSocketServer({
    port: 3000,
});
server.on('connection', (socket) => {
    console.log('Connection established!');
    socket.send('breezes');
    socket.addEventListener('message', (event) => {
        console.log(event.data);
        if (event.data === '"ping"') {
            socket.send('"pong"');
        }
        else if (event.data === '"breezes"') {
            socket.send('"breezes"');
        }
        else {
            socket.close(undefined, "Unexpected message received.");
        }
        ;
    });
});
server.on('error', (error) => {
    console.error(error);
});
