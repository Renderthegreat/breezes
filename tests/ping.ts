import * as Breezes from '#~/index';

@Breezes.wind({
	location: new URL('ws://localhost:3000'),

	validateStructure: true,
	timeout: 1000,
})
export class Ping extends Breezes.Wind.Creator {
	
};


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
};