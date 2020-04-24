module.exports = {
	name: 'source',
	description: 'Displays the source of the bot',
	execute(message, args) {
        const Discord = require('discord.js');
		const client = new Discord.Client();
		if (message.author.bot) return;
		message.channel.send(`https://cdn.discordapp.com/attachments/703302532629266554/703370736492085248/image0.png`);
	},
};