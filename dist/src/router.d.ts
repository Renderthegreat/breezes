import { Blower } from '#~/blower';
import HTTP from 'node:http';
export declare class Router {
    private server;
    protected routes: Map<string, Blower>;
    constructor(server: HTTP.Server);
    push(blower: Blower): void;
}
