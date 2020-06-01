const config = require('../config.json')

module.exports = {
	name: 'kick',
	description: 'Kicks a user from the server.',
	aliases: ['boot'],
	usage: '<user> <reason>',
	cooldown: 0,
	staff:true,
	execute(message, args) {
		try {
			function returnResponse(respone = 'Something went wrong.'){
				message.channel.send(respone)
			};
			mentionedMember = message.mentions.members.first();
			
			if (message.author.id == mentionedMember){
				message.channel.send(`You can't perform this action on yourself.`);
				return;
			}
			if (mentionedMember.roles.cache.some(role => role.id === `${config.staffRoles}`)){
				message.channel.send(`You can't perform that action on this user.`);
				return;
			}

			// Code hopefully works
			const reason = args.join(' ').replace(args[0], '')

			returnResponse('<@'+mentionedMember.id+'> was kicked from the server.')
			message.guild.channels.cache.get(config.modLog).send(`:boot: Kick: <@${message.author.id}> kicked <@${mentionedMember.id}> | ${mentionedMember.user.tag}
:label: User ID: ${mentionedMember.id}
:pencil2: Reason: "${reason}"`)
			mentionedMember.send(`You have been kicked from the server. You may rejoin at anytime.\n\nReason for kick: ${reason}`)
			mentionedMember.kick({reason: reason})

		  } catch(error) {
			// Your code broke (Leave untouched in most cases)
			console.error('an error has occured', error);
		  }
		
}
};