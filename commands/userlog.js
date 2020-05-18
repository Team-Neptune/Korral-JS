module.exports = {
	name: 'userlog',
	description: 'Views the user warn log',
	staff:true,
	execute(message, args) {
		var memberIdToLookup = message.mentions.members.first().id

		function viewEntries(currentNumber, userLog, embed){
			var currentNumber = currentNumber +1
			embed.addField('Warn '+currentNumber, userLog[memberIdToLookup+`_warn`+currentNumber])
			if(currentNumber == userLog[memberIdToLookup+`_warnings`]){
				message.channel.send(embed)
			}else{
				viewEntries(currentNumber, userLog, embed)
			}
		}


		if (!fs.existsSync(`./warnings.json`)){
			message.channel.send('`warnings.json` doesn\'t exist. Please do at least one warning to create the file.')
		}else{
			var userLog = require('../warnings.json')
			if(!userLog[memberIdToLookup+`_warnings`]){
				message.channel.send('No entries found.')
				return
			}
			console.log(userLog[memberIdToLookup+`_warnings`])
			message.channel.send(userLog[memberIdToLookup+`_warnings`])	
			var currentNumber = 0
			const embed = new Discord.MessageEmbed()
			viewEntries(currentNumber, userLog, embed)
		}
	},
};