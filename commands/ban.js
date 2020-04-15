module.exports = {
    name: 'ban',
    description: 'Bans a user.',
    aliases: ['banish'],
	usage: '<user> <reason>',
	cooldown: 0,
	mod:true,
    execute(message, args) {
        try {
			if (message.author.id == message.mentions.members.first().id){message.channel.send(`You can't perform this action on yourself.`);return;}
			const {ModeratorRoleID} = require('../info.json');
			const checkmemberforroles = message.mentions.members.first()
			if (checkmemberforroles.roles.cache.some(role => role.id === `${ModeratorRoleID}`)){message.channel.send(`You can't perform that action on this user.`);return;}
			const user = message.mentions.users.first();
			const userid = user.id
			const guild = message.guild
			const authorusername = message.author.username +'#' +message.author.discriminator
			let reasonraw = args.filter(arg => !Discord.MessageMentions.USERS_PATTERN.test(arg));
			var reason = reasonraw.join(' ')
			if(reason == ''){var reason = 'No reason provided.'}
			fs.appendFileSync('./logs/' + userid + '-warnings.log', 'Ban\nReason: ' + reason +'\n\n');
   			fs.appendFileSync('./logs/' + userid + '-modwarnings.log', 'Ban issued by '+ authorusername +'\nReason: ' + reason +'\n\n');
			respond('Ban','<@'+user+'> was banned.\nReason: '+reason, message.channel)
			respond('Banned','You were banned from the Apple Explained server due to: '+ reason, user)
			guild.members.ban(user);
			modaction(this.name, message.author.tag, message.channel.name, message.content)
    		}
        catch(error) {
			// Your code broke (Leave untouched in most cases)
			console.error('an error has occured', error);
		  }
    },
};
