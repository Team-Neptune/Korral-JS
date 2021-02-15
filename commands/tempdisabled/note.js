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
		var config = require('../config.json');
		var notes = require('../userNotes.json')

		if (!notes[mentionedUser.id])
			notes[mentionedUser.id] = [];

		notes[mentionedUser.id].push(reason);

		fs.writeFile('./userNotes.json', JSON.stringify(notes), (err) => {
			if (err) {
				console.log(err);
				returnResponse(`An error occured during saving.`);
				return;
			}

			message.channel.send(`<@${mentionedUser.id}> had a note added. User has ${notes[mentionedUser.id].length} note(s).`)
			delete require.cache[require.resolve(`../warnings.json`)]
		})

	}
};
