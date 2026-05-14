import * as Breezes from '#~/index';

@Breezes.wind({
	location: new URL('ws://localhost:3000/auth'),
})
export class Login extends Breezes.Wind.Creator {
	
};


const login = await Login.connect();

login.send({
	name: "Brendan",
	password: "Hello_W0rld!",
});

const receiver = login.receiver();

