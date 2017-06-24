'use strict';
// create an API server
const Restify = require('restify');
const server = Restify.createServer({
	name: 'movieMateBot'
});
const PORT = process.env.PORT || 8080;

server.use(Restify.jsonp());
server.use(Restify.bodyParser());
//server.use(f.verifySignature);
server.use((req,res,next)=>f.verifySignature(req,res,next));

// Tokens
const config = require('./config');

// FBeamer
const FBeamer = require('./fbeamer');
const f = new FBeamer(config.FB);

// Wit.ai
const Wit = require('node-wit').Wit;
const wit = new Wit({
	accessToken:config.WIT_ACCESS_TOKEN
});

// OMDB
const omdb = require('./omdb');


// Register the webhooks
server.get('/', (req, res, next) => {
	f.registerHook(req, res);
	return next();
});

// Receive all incoming messages
server.post('/', (req, res, next) => {
	f.incoming(req, res, msg => {
		const {message,sender} = msg;
		// Process messages
		if(message.text) {
			// If a text message is received
			//f.txt(sender,`You just said ${message.text}`);

			wit.message(message.text,{})
				.then(omdb)
				.then(response=>{
					f.txt(sender,response.text);
					if(response.image){
						f.img(sender,response.image);
					}
				})
				.catch(error=>{
					console.log(error)
					f.txt(sender,"Hmm...my servers are acting weird today! try asking me after a while");
				});
		}
	});
	return next();
});

// Subscribe
f.subscribe();

server.listen(PORT, () => console.log(`movieMateBot running on port ${PORT}`));
