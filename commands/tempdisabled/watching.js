module.exports = {
    name: 'watching',
    description: 'Sets status to `Watching` <text>',
    usage: '<text>',
    cooldown: 0,
    mod:true,
      execute(message, args, client) {
      const Discord = require('discord.js');
      const fs = require('fs');
      const statuscontent = args.join(' ')
      try {
        const activity = args.join(' ')
        client.user.setActivity(activity, { type: 'WATCHING' });
        const PlayingEmbed = new Discord.MessageEmbed()
        .setTitle('Watching Status')
        .setDescription('Bot activity is set to: ' + activity)
        .setTimestamp()
        message.channel.send(PlayingEmbed)
      }catch(error) {
        message.channel.send('Error', 'Something went wrong.\n'+error+`\nMessage: ${message}\nArgs: ${args}\n`, message.channel)
        errorlog(error)
        // Your code broke (Leave untouched in most cases)
        console.error('an error has occured', error);
        }
            
    }}