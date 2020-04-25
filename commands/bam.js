module.exports = {
    name: 'bam',
    description: 'bams the user',
    execute(message, args) {
    const prefix = require('../config.json')
    const Discord = require('discord.js');
    const client = new Discord.Client();
    const fs = require('fs');
    const argarray = message.content.slice(prefix.length).trim().split(/ +/g);
    const user = message.mentions.users.first() || message.guild.members.cache.get(`${argarray[1]}`)|| client.users.cache.get('name', `${argarray[1]}`) ||message.author;
    message.channel.send( `${user.tag}`+ ' is ̶n͢ow b̕&̡.̷ 👍̡!');
    },
};