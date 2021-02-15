module.exports = {
	name: 'restart',
	description: 'Kills the bot',
	aliases: ['kill', 'reboot', 'die'],
	usage: '',
	cooldown: 0,
	staff:true,
	essential:true,
	execute(message, args, client) {
		try{
		message.channel.send('Bye :wave:.')
		setTimeout(function(){ 
			process.exit()
		}, 3000);
	}catch(error) {
		respond('Error', 'Something went wrong.\n'+error+`\nMessage: ${message}\nArgs: ${args}\n`, message.channel)
		errorlog(error)
		// Your code broke (Leave untouched in most cases)
		console.error('an error has occured', error);
		}
	}
	
};
