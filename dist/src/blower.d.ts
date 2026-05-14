import { Wind } from '#~/wind';
import { WebSocketServer } from 'ws';
import HTTP from 'node:http';
import Stream from 'node:stream';
import { EventEmitter } from 'eventemitter3';
export declare class Blower extends EventEmitter<Blower.Events> {
    private server;
    readonly path: string;
    protected static __WebSocketServer__: typeof WebSocketServer;
    static create(config: Blower.Config): Promise<Blower>;
    private initialize;
    private constructor();
    handle(request: HTTP.IncomingMessage, socket: Stream.Duplex, head: Buffer<ArrayBuffer>): void;
}
export declare namespace Blower {
    type Config = {
        path: string;
    };
    interface Events {
        connection: (socket: Wind) => void;
    }
    class Creator {
        static create(): Promise<Blower>;
    }
}
export declare function blower<T>(config: Blower.Config): (...args: any) => void;
