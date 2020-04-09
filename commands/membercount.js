module.exports = {
	name: 'membercount',
	description: 'Counts the members in the current server',
	execute(message, args) {
        const Discord = require('discord.js');
		const client = new Discord.Client();
		if (message.author.bot) return;
		message.channel.send(`${message.guild.name} has ${message.guild.memberCount} members!`);
	},
};