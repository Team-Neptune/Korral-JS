module.exports = {
    name: 'warm',
    description: 'warms the user',
    execute(message, args) {
    const Discord = require('discord.js');
    const client = new Discord.Client();
    const fs = require('fs');
    const user = message.mentions.users.first() || message.author;
    message.channel.send( `<@${user.id}> ` + 'warmed. User is now ' + Math.ceil(Math.random() * 80) + '°C');
    },
};