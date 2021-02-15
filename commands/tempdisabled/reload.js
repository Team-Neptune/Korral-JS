module.exports = {
	name: 'reload',
	description: 'Reloads a command',
	aliases: ['fetch'],
	usage: '[command]',
	cooldown: 0,
	botmanager:true,
	execute(message, args) {
		const allcommandName = args[0].toLowerCase();
		const command = message.client.allcommands.get(allcommandName)
			|| message.client.allcommands.find(cmd => cmd.aliases && cmd.aliases.includes(allcommandName));
		
		if (!command) {
			return message.channel.send(`There is no command with name or alias \`${allcommandName}\`, ${message.author}!`);
		}
	
		delete require.cache[require.resolve(`./${allcommandName}.js`)];

		try {
			const newCommand = require(`./${allcommandName}.js`);
			message.client.allcommands.set(newCommand.name, newCommand);
		} catch (error) {
			console.log(error);
			return message.channel.send(`There was an error while reloading a command \`${allcommandName}\`:\n\`${error.message}\``);
		}
		respond('',`Command \`${allcommandName}\` was reloaded!`,message.channel);
	},
};
