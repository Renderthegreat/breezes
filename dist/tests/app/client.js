var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as Breezes from '#~/index';
let Login = class Login extends Breezes.Wind.Creator {
};
Login = __decorate([
    Breezes.wind({
        location: new URL('ws://localhost:3000/auth'),
    })
], Login);
export { Login };
;
const login = await Login.connect();
login.send({
    name: "Brendan",
    password: "Hello_W0rld!",
});
const receiver = login.receiver();
