var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as Breezes from '#~/index';
let Ping = class Ping extends Breezes.Wind.Creator {
};
Ping = __decorate([
    Breezes.wind({
        location: new URL('ws://localhost:3000'),
        validateStructure: true,
        timeout: 1000,
    })
], Ping);
export { Ping };
;
const ping = await Ping.connect();
/*ping.send({
    username: 'Brendan',
    password: 'Hello_W0rld!'
});*/
const receiver = ping.receiver();
for (let i = 0; i < 100; i++) {
    const packet = (await receiver.next()).value;
    console.log(packet);
    await new Promise((resolve) => setTimeout(resolve, 100));
    ping.send("ping");
}
;
