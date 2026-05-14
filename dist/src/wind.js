import Identifier from '#assets/identifier.json' with { type: 'json' };
import { Device, } from '#~/device';
import * as Reader from '#~/reader';
export class Wind extends Device {
    static __WebSocket__;
    // By default, use the *WebSocket* base.
    static {
        this.__WebSocket__ = globalThis.WebSocket;
    }
    ;
    static async connect(config) {
        const socket = new this.__WebSocket__(config.location);
        return new Promise((resolve, reject) => {
            socket.addEventListener('open', async () => {
                socket.send(`"${Identifier.greeting}"`);
                let response = await (new Promise((resolve, reject) => {
                    function listener(event) {
                        socket.removeEventListener('message', listener);
                        resolve(Reader.parse(event.data));
                    }
                    ;
                    socket.addEventListener('message', listener);
                    /*if (config.timeout !== undefined) {
                        setTimeout(reject, config.timeout);
                    };*/
                }));
                if (response !== Identifier.greeting) {
                    reject("The server did not return the correct identifier.");
                }
                ;
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
    }
    ;
}
;
(function (Wind) {
    class Creator {
        /**
         * Connects to a {@link Blower} instance.
         *
         * @param location The location of the *WebSocket*.
         *
         */
        static async connect() {
            // Type declaration only.
            return null;
        }
        ;
    }
    Wind.Creator = Creator;
    ;
})(Wind || (Wind = {}));
;
export function wind(config) {
    return (target) => {
        target.connect = async () => {
            return await Wind.connect(config);
        };
    };
}
;
