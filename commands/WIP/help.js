module.exports = {
	name: 'help',
	description: 'Shows commands available',
	execute(message, args) {
		const Discord = require('discord.js');
		const client = new Discord.Client();
		const config = require('../config.json')
		commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
		const helpCommands = []
		const helpDescriptions = []
		const helpMenu = []
		if(message.member.roles.cache.some(role => config.staffRoles.includes(role.id))){
			for (const file of commandFiles) {
				const command = require(`./${file}`);
				helpCommands.push(command.name)
				helpDescriptions.push(command.description || "No information available.")
			}
			helpMenu.push(helpCommands.join('\n'))
			helpMenu.push(helpDescriptions.join('\n'))
			message.channel.send('```'+helpMenu.join('\n')+'```')
		}else{
			for (const file of commandFiles) {
				const command = require(`./${file}`);
				if(!command.staff && !command.mod){
					helpCommands.push(command.name)
					helpDescriptions.push(command.description || "No information available.")
				}
			}
			helpMenu.push(helpCommands.join('\n'))
			helpMenu.push(helpDescriptions.join('\n'))
			message.channel.send('```'+helpCommands.join('\n') + helpDescriptions.join(`\n`)+'```')	
		}

	},
};









