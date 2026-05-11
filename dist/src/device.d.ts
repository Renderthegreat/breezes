import EventEmitter from 'eventemitter3';
import * as Reader from '#~/reader';
export declare class Device extends EventEmitter<Device.Events> {
    protected socket: WebSocket;
    private queue;
    private peerIdentity;
    constructor(socket: WebSocket);
    send(data: Reader.Serializable): void;
    receiver(): AsyncGenerator<Reader.Serializable, Device.Disconnect, unknown>;
}
export declare namespace Device {
    interface Events {
        packet: (packet: Reader.Serializable) => void;
        disconnect: (code: number, reason: string) => void;
    }
    type Disconnect = {
        code: number;
        reason: string;
    };
}
