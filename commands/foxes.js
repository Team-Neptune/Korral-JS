module.exports = {
	name: 'fox',
	description: 'Displays the source of the fox',
	execute(message, args) {
        const Discord = require('discord.js');
		const client = new Discord.Client();
		if (message.author.bot) return;
		var request = require('request');

		request({url: 'https://randomfox.ca/floof/', json: true}, function(err, res, json) {
		  if (err) {
		    throw err;
 		 }
		  console.log(json);
	const exampleEmbed = new Discord.MessageEmbed()
	.setTitle('Fox')
	.setImage(json["image"])
	.setURL(json["link"])
	.setTimestamp()
	message.channel.send(exampleEmbed)

});
	},
};