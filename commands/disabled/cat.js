module.exports = {
	name: 'cat',
	description: 'Displays an image of an fox',
	execute(message, args) {
        const Discord = require('discord.js');
		const client = new Discord.Client();
		if (message.author.bot) return;
	const exampleEmbed = new Discord.MessageEmbed()
	.setTitle('Cat')
	.setImage('https://placekitten.com/200/' + Math.floor((Math.random() * 200) + 1))
	.setTimestamp()
	message.channel.send(exampleEmbed)

},
};
