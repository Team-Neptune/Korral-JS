module.exports = [
	{
		name: 'ban',
		description: 'Bans a user.',
		aliases: ['banish'],
		usage: '<user> <reason>',
		cooldown: 0,
		staff:true,
		execute(message, args) {
			const Discord = require('discord.js');
			const client = new Discord.Client();
			const fs = require('fs');
			try {
				if (message.author.id == message.mentions.members.first().id){message.channel.send(`You can't perform this action on yourself.`);return;}
				const {staffRoles} = require('../config.json');
				if (message.mentions.members.first().roles.cache.some(role => staffRoles.includes(role.id))){
					respond('',`You can't perform that action on this user.`, message.channel);return;
				}
				const {modLog} = require('../config.json');
				const user = message.mentions.users.first();
				const userid = user.id
				const authorusername = message.author.username +'#' +message.author.discriminator
				var reason = args.join(' ').replace(args[0], '')
				if(reason == ''){var reason = 'No reason provided.'}
				message.mentions.members.first().send(`You were banned from ${message.guild.name}. The given reason was: "${reason}"\n\nThis ban does not expire.`)
				message.channel.send(message.mentions.members.first().user.tag+' is ̶n͢ow b̕&̡.̷ 👍̡')
				message.mentions.members.first().ban({reason: `${message.author.tag}, ${reason}`})
				message.guild.channels.cache.get(modLog).send(`:no_entry: Ban: <@${message.author.id}> banned <@${userid}> | ${user.tag}
	:label: User ID: ${userid}
	:pencil2: Reason: "${reason}"`)
				
				}
			catch(error) {
				// Your code broke (Leave untouched in most cases)
				console.error('an error has occured', error);
			  }
		}
	}
]