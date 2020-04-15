const { prefix } = require('../config.json');

module.exports = {
	name: 'kick',
	description: 'Kicks a user from the server.',
	aliases: ['boot'],
	usage: '<user>',
	cooldown: 0,
	mod:true,
	execute(message, args) {
		try {
			if (message.author.id == message.mentions.members.first().id){message.channel.send(`You can't perform this action on yourself.`);return;}
			const {ModeratorRoleID} = require('../info.json');
			const checkmemberforroles = message.mentions.members.first()
			if (checkmemberforroles.roles.cache.some(role => role.id === `${ModeratorRoleID}`)){message.channel.send(`You can't perform that action on this user.`);return;}
			// Code hopefully works
			const user = message.mentions.members.first()
			const reason = args.join(' ')
			respond('⬅️ Kick','<@'+user.id+'> was kicked from the server.\nReason: '+reason, message.channel)
			respond('⬅️ Kick','You have been kicked from the server. You may rejoin at anytime.\n\nReason for kick: '+reason, user)
			modaction(this.name, message.author.tag, message.channel.name, message.content)
			user.kick()
		  } catch(error) {
			// Your code broke (Leave untouched in most cases)
			console.error('an error has occured', error);
		  }
		
}
};