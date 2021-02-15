module.exports = {
	name: 'source',
	description: 'Displays the source of the bot',
	execute(message, args) {
        const Discord = require('discord.js');
		const client = new Discord.Client();
		if (message.author.bot) return;
		message.channel.send(`You can find my source at https://github.com/Team-Neptune/Korral-JS. Serious PRs and issues welcome!`);
	},
};