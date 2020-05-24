module.exports = {
	name: 'exfat',
	description: 'Displays info on why not to use exfat',
	execute(message, args) {
		const Discord = require('discord.js');
        const client = new Discord.Client();
        const exampleEmbed = new Discord.MessageEmbed()
        .setTitle("Guiformat")
        .setURL('www.ridgecrop.demon.co.uk/guiformat.exe')
        .setDescription('A useful tool for formatting SD cards over 32GB as FAT32 on Windows.')
        message.channel.send("The exFAT drivers built into the Switch has been known to corrupt SD cards and homebrew only makes this worse. Backup everything on your SD card as soon as possible and format it to FAT32. On Windows, if your SD card is over 32GB then it will not let you select FAT32 from the built-in format tool, however you can use a tool like GUIFormat to format it.")
        message.channel.send(exampleEmbed)
	},
};
