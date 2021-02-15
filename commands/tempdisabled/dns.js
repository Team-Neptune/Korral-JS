module.exports = {
	name: 'dns',
	description: "shows 90's dns options",
	staff:false,
	execute(message, args) {
		const Discord = require('discord.js');
		const client = new Discord.Client();
        const DNS = new Discord.MessageEmbed()
        .setTitle('90DNS IP adresses')
        .setDescription("These are the 90DNS IP adresses: \n `207.246.121.77` (USA) \n `163.172.141.219` (France) \n \n You will have to set up the DNS for every wifi network you connect to.")
        message.channel.send(DNS)
	},
};

