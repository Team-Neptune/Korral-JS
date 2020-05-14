module.exports = {
	name: 'guide',
	description: 'Displays some usefull guides',
	execute(message, args) {
        const Discord = require('discord.js');
		const client = new Discord.Client();
		if (message.author.bot) return;
		message.channel.send(`Generic starter guides:\n Beginners Guide: https://switch.homebrew.guide/\n\nSpecific guides:\nManually Updating/Downgrading (with HOS): https://switch.homebrew.guide/usingcfw/manualupgrade\nManually Repairing/Downgrading (without HOS): https://switch.homebrew.guide/usingcfw/manualchoiupgrade`);
	},
};