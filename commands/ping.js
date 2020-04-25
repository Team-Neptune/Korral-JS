module.exports = {
	name: 'ping',
	description: 'Ping!',
	execute(message, args) {
		const Discord = require('discord.js');
		const client = new Discord.Client();
		const fs = require('fs');
		var ping = Date.now() - message.createdTimestamp + " ms";
    	message.channel.send("Your ping is `" + `${Date.now() - message.createdTimestamp}` + " ms`");
	},
};