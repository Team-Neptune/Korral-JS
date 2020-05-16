module.exports = {
	name: 'userlog',
	description: 'Yes',
	execute(message, args) {

		var memberIdToLookup = message.mentions.members.first().id
		var userLog = require('../warnings.json')
		console.log(userLog[memberIdToLookup+`_warnings`])
		message.channel.send(userLog[memberIdToLookup+`_warnings`])
	},
};