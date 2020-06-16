module.exports = {
	name: 'note',
	description: 'Adds a note to a user.',
	usage: '<user> <note>',
	cooldown: 0,
	staff: true,
	execute(message, args) {

		function returnResponse(reponse = "Something happened but no response was defined.") {
			message.channel.send(reponse);
		}

		if (message.mentions.members.first()) {
			var mentionedUser = message.mentions.members.first();
		} else {
			returnResponse(`No user was mentioned.`);
			return;
		}

		if (!args[1]) {
			returnResponse(`Please provide a note.`)
			return;
		}

		var reason = args.join(' ').replace(args[0], '')

		// all requirements are met

		if (message.author.id == mentionedUser.id) {
			returnResponse(`You can't perform this action on yourself.`);
			return;
		}

		var config = require('../config.json');
		var warnings = require('../warnings.json')

		if (mentionedUser.roles.cache.some(role => config.staffRoles.includes(role.id))) {
			returnResponse(`You can't perform that action on this user.`);
			return;
		}

		if (!warnings[mentionedUser.id])
			warnings[mentionedUser.id] = [];

		warnings[mentionedUser.id].push(reason);

		fs.writeFile('./warnings.json', JSON.stringify(warnings), (err) => {
			if (err) {
				console.log(err);
				returnResponse(`An error occured during saving.`);
				return;
			}

			var eventMessage = `You were warned on ${message.guild.name}.\nThe given reason is: ${reason}\n\nPlease read the rules. This is warning #${(warnings[mentionedUser.id].length)}.`
			switch (warnings[mentionedUser.id].length) {
				case 0:
					// only base message
					mentionedUser.send(eventMessage);
					break;
				case 1:
					eventMessage = eventMessage + "\n\n __**The next warn will result in an automatic kick.**__";
					mentionedUser.send(eventMessage)
					break;
				case 2:
					eventMessage = eventMessage + "\n\nYou were kicked because of this warning. You can rejoin right away, but two more warnings will result in an automatic ban.";
					mentionedUser.send(eventMessage)
					mentionedUser.kick({ reason: `Auto kick: ${reason}` })
					break;
				case 3:
					eventMessage = eventMessage + "\n\nYou were kicked because of this warning. You can rejoin right away, but two more warnings will result in an automatic ban.";
					mentionedUser.send(eventMessage)
					mentionedUser.kick({ reason: `Auto kick: ${reason}` })
					break;
				case 4:
					eventMessage = eventMessage + "\n\nYou were kicked because of this warning. You can rejoin right away, but **one more warning will result in an automatic ban.**";
					mentionedUser.send(eventMessage)
					mentionedUser.kick({ reason: `Auto kick: ${reason}` })
					break;
				case 5:
					eventMessage = eventMessage + "\n\nYou were banned because of this warning. This ban will not expire.";
					mentionedUser.send(eventMessage)
					mentionedUser.ban({ reason: `Auto ban: ${reason}` })
					break;
				default:
				// code block
				// nothing will happen by default
			}


			message.channel.send(`<@${mentionedUser.id}> got warned. User has ${warnings[mentionedUser.id].length} warning(s).`)
			message.guild.channels.cache
				.get(config.modLog)
				.send(`<@${message.author.id}> warned <@${mentionedUser.id}> (${mentionedUser.user.tag}) - warn #${warnings[mentionedUser.id].length}\n Reason: "${reason}"`)
			delete require.cache[require.resolve(`../warnings.json`)]
		})

	}
};
