module.exports = {
  name: 'lock',
  aliases: ['lockout'],
  description: 'Locks the channel the command is ran in.',
  usage: '',
  cooldown: 0,
  mod:true,
	execute(message, args) {
    const Discord = require('discord.js');
    
	const fs = require('fs');
	const channel = message.channel
	const reason = args.join(' ')
    try {
		channel.updateOverwrite(channel.guild.roles.everyone, { SEND_MESSAGES: false });
		if(args != ''){respond('🔒','<#'+message.channel+'> was locked.\nReason: '+reason, message.channel)}
		else{respond('🔒','<#'+message.channel+'> was locked.\n', message.channel)}
		modaction(this.name, message.author.tag, message.channel.name, message.content)
	}
		catch(error) {
			// Your code broke (Leave untouched in most cases)
			console.error('an error has occured', error);
		  }
		  
  }}