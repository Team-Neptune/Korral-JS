module.exports = {
	name: 'stop',
	description: 'Stops the current song from playing',
	execute(message, args) {
        const Discord = require('discord.js');
		const client = new Discord.Client();
        message.channel.send('${guild.name} has ${guild.memberCount} members!');
	},
};