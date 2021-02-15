module.exports = {
	name: 'userlogid',
	description: 'Views the user warn log',
	staff: true,
	execute(message, args) {


		function returnResponse(reponse = "Something happened but no response was defined.") {
			message.channel.send(reponse);
		}

		if (message.mentions.members.first()) {
			returnResponse(`Please use userlog command instead.`);
			return;
		}

		if (!fs.existsSync(`./warnings.json`)) {
			returnResponse(`'warnings.json' doesn't exist. Please do at least one warning to create the file.`)
			return;
		}

		// all requirements are met

		var warnings = require('../warnings.json')

		if (!warnings[args[0]]) {
			returnResponse(`This user does not have any userlog entries`);
			return;
		}

		const embed = new Discord.MessageEmbed()
		warnings[args[0]].forEach(function (warning, index) {
			embed.addField('Warning: ' + (parseInt(index) + 1), warning)
		});
		message.channel.send(embed)

		delete require.cache[require.resolve(`../warnings.json`)]
	}
};