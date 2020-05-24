module.exports = {
	name: 'deletewarn',
	aliases: ['delwarn'],
	description: 'Deletes a warning',
	staff: true,
	execute(message, args) {

		function returnResponse(reponse = "Something happened but no response was defined.") {
			message.channel.send(reponse);
			return;
		}

		if (message.mentions.members.first()) {
			var mentionedUser = message.mentions.members.first();
		} else {
			returnResponse(`No user was mentioned.`);
			return;
		}

		if (!fs.existsSync(`./warnings.json`)) {
			returnResponse(`'warnings.json' doesn't exist. Please do at least one warning to create the file.`)
			return;
		}


		if (!args[1]) {
			returnResponse(`Please choose a (or different) warning to delete.`);
			return;
		}

		var warningNr = args[1]-1;

		// all requirements are met

		var userLog = require('../warnings.json')
		if (!userLog[mentionedUser.id]) {
			returnResponse(`This user has no warnings.`);
			return;
		}


		if (!userLog[mentionedUser.id][warningNr]) {
			returnResponse(`Warning doesn't exist.`)
			return;
		}


		userLog[mentionedUser.id].splice(warningNr, 1); // remove the warning
		fs.writeFile('./warnings.json', JSON.stringify(userLog), (err) => {
			if (err) {
				console.log(err);
				returnResponse(`An error occured during saving.`);
				return;
			}
		})

		returnResponse(`Warning removed.`);
		delete require.cache[require.resolve(`../warnings.json`)]
	}
};