const fs = require("fs")
const Discord = require('discord.js');
module.exports = {
	name: 'help',
	description: 'Shows commands available',
	/**
	 * 
	 * @param {Discord.Message} message 
	 * @param {Array<String>} args 
	 */
	execute(message, args) {
		const config = require("../config.json")
		let commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
		let allowedCommands = commandFiles.filter(c => {
			const command = require(`./${c}`);
			if((command.mod || command.staff) && message.member.roles.cache.some(r => config.staffRoles.includes(r.id)))
				return true;
			if((!command.mod && !command.staff))
				return true;
		})
		let commands = allowedCommands.map(v => {
			const command = require(`./${v}`);
			return `**${command.name}**: ${command.description && command.description.length >= 100?`${command.description.slice(0, 97)}...`:command.description || "No information found..."}`
		})
		message.channel.send(commands.join("\n"))
	},
};