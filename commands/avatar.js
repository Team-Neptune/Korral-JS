const Discord = require('discord.js');
module.exports = {
	name: 'avatar',
	description: 'Grabs the current users avatar',
    /**
     * 
     * @param {Discord.Message} message 
     * @param {Array<String>} args 
     */
	execute(message, args) {
        const fs = require('fs');
        const user = message.mentions.users.first() || message.author;
        const avatarEmbed = new Discord.MessageEmbed()
        .setColor(0x333333)
        .setAuthor(user.username)
        .setImage(user.displayAvatarURL({"size":"512", "dynamic":true}));
        message.channel.send(avatarEmbed);
    },
};