import EventEmitter from 'eventemitter3';
import * as Reader from '#~/reader';
import * as Codes from '#~/codes';
export declare class Device extends EventEmitter<Device.Events> {
    protected socket: WebSocket;
    private queue;
    private peerIdentity;
    constructor(socket: WebSocket);
    send(data: Reader.Serializable): void;
    /**
     * End the connection.
     *
     * @param code The closing code to send.
     */
    close(code?: Codes.Close, reason?: string): void;
    receiver(): AsyncGenerator<Reader.Serializable, Device.Close, unknown>;
}
export declare namespace Device {
    interface Events {
        packet: (packet: Reader.Serializable) => void;
        close: (code: number, reason: string) => void;
    }
    type Close = {
        code: number;
        reason: string;
    };
}
