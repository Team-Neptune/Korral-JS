module.exports = {
	name: 'sd',
	description: 'Shows the SD command',
	execute(message, args) {
		const Discord = require('discord.js');
		const client = new Discord.Client();
        const fs = require('fs');
        const embed = new Discord.MessageEmbed()
        embed.setTitle("SD Folder")
		embed.setDescription('If you are getting an error in hekate such as: Missing lp0 lib,  Missing or old minerva lib or Update bootloader \n Please check and make sure that you **extracted the contents of the SD folder onto your SD card**')
		message.channel.send(embed)
	},
};