import { Device } from '#~/device';
export declare class Wind extends Device {
    protected static __WebSocket__: typeof WebSocket;
    static connect(config: Wind.Config): Promise<Wind>;
}
export declare namespace Wind {
    type Config = {
        /**
         * The location at which the *WebSocket* lives.
         */
        location: URL;
        /**
         * The maximum time (in milliseconds) given for the server to respond to the inital connection.
         */
        timeout?: number;
    };
    class Creator {
        /**
         * Connects to a {@link Blower} instance.
         *
         * @param location The location of the *WebSocket*.
         *
         */
        static connect(): Promise<Wind>;
    }
}
export declare function wind<T>(config: Wind.Config): (...args: any) => void;
