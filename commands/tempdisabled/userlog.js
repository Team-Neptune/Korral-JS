module.exports = {
	name: 'userlog',
	description: 'Views the user warn log',
	staff: true,
	execute(message, args) {


		function returnResponse(reponse = "Something happened but no response was defined.") {
			message.channel.send(reponse);
		}

		if (message.mentions.members.first()) {
		} else {
			returnResponse(`No user was mentioned.`);
			return;
		}

		// all requirements are met
		var warnings = require('../warnings.json')
		var notes = require('../userNotes.json')

		message.mentions.members.forEach(mentionedUser => {
			if (!warnings[mentionedUser.id] && !notes[mentionedUser.id]) {
				returnResponse(`${mentionedUser.user.tag} does not have any warnings or notes.`);
				return;
			}
	
			const embed = new Discord.MessageEmbed()
			embed.setAuthor(mentionedUser.user.tag)
			if(warnings[mentionedUser.id]){
				warnings[mentionedUser.id].forEach(function (warning, index) {
					embed.addField('Warning: ' + (parseInt(index) + 1), warning)
				});
			}
			if(notes[mentionedUser.id]){
				notes[mentionedUser.id].forEach(function (warning, index) {
					embed.addField('Note: ' + (parseInt(index) + 1), warning)
				});
			}
			message.channel.send(embed)
		});

		delete require.cache[require.resolve(`../warnings.json`)]
		delete require.cache[require.resolve(`../userNotes.json`)]
	}
};