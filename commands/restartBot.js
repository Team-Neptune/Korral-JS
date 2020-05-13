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
		const Discord = require('discord.js')
		const { MessageEmbed } = require('discord.js')
		const RestartedEmbed = new Discord.MessageEmbed()
		RestartedEmbed.setTitle('🔄 Restarting')
		RestartedEmbed.setDescription('Bye :wave:.')
		message.channel.send(RestartedEmbed)
		setTimeout(function(){ 
			process.exit()
		}, 5000);
	}catch(error) {
		respond('Error', 'Something went wrong.\n'+error+`\nMessage: ${message}\nArgs: ${args}\n`, message.channel)
		errorlog(error)
		// Your code broke (Leave untouched in most cases)
		console.error('an error has occured', error);
		}
	}
	
};
