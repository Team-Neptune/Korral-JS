module.exports = {
	name: 'avatar',
	description: 'Grabs the current users avatar',
	execute(message, args) {
        const fs = require('fs');
        const Discord = require('discord.js');
        const client = new Discord.Client();
        const user = message.mentions.users.first() || message.author;
        const avatarEmbed = new Discord.MessageEmbed()
        .setColor(0x333333)
        .setAuthor(user.username)
        .setImage(user.avatarURL);
        message.channel.send(avatarEmbed);
    },
};