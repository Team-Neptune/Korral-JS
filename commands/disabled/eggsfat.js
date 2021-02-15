module.exports = {
	name: 'eggsfat',
	description: 'Yes',
	execute(message, args) {
		const Discord = require('discord.js');
		const client = new Discord.Client();
		const embed = new Discord.MessageEmbed()
        .setURL('https://en.wikipedia.org/wiki/Egg')
        .setThumbnail('https://cdn.vox-cdn.com/thumbor/TGJMIRrhzSrTu1oEHUCVrizhYn0=/1400x1400/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/13689000/instagram_egg.jpg')
        .setTitle('🥚')
        .setDescription('🥚 🥚🥚🥚🥚🥚🥚 🥚🥚🥚🥚 🥚🥚🥚 🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚 🥚🥚 🥚🥚🥚🥚🥚 🥚🥚🥚🥚 🥚🥚🥚🥚 🥚🥚 🥚🥚🥚🥚🥚 🥚🥚 🥚🥚🥚🥚🥚🥚🥚🥚')
		message.channel.send('🥚🥚🥚 🥚🥚🥚🥚🥚 🥚🥚🥚🥚🥚🥚🥚 🥚🥚🥚🥚🥚 🥚🥚🥚🥚 🥚🥚🥚 🥚🥚🥚🥚🥚🥚 🥚🥚🥚 🥚🥚🥚🥚 🥚🥚🥚🥚🥚 \n 🥚🥚 🥚🥚🥚🥚🥚🥚🥚 🥚🥚 🥚🥚🥚🥚🥚 🥚🥚🥚 🥚🥚🥚🥚🥚🥚🥚🥚 🥚🥚🥚🥚 🥚🥚🥚🥚🥚 🥚🥚🥚🥚 🥚🥚🥚🥚🥚🥚 \n 🥚🥚🥚🥚🥚🥚 🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚 🥚🥚 🥚🥚🥚🥚 🥚🥚 🥚🥚🥚🥚 🥚🥚 🥚🥚🥚🥚 🥚🥚 🥚🥚🥚🥚🥚🥚🥚🥚 \n 🥚🥚🥚 🥚🥚🥚🥚🥚🥚 🥚🥚 🥚🥚 🥚🥚🥚🥚🥚🥚 🥚🥚 🥚🥚🥚🥚🥚🥚🥚🥚 🥚🥚 🥚🥚🥚🥚 🥚🥚 🥚🥚🥚🥚 🥚🥚 \n 🥚🥚🥚🥚 🥚🥚🥚🥚 🥚🥚🥚🥚 🥚🥚 🥚🥚🥚🥚 🥚🥚🥚 🥚🥚🥚 🥚🥚🥚 🥚🥚🥚🥚🥚🥚 🥚🥚🥚🥚🥚 🥚🥚🥚🥚 \n 🥚🥚🥚 🥚🥚🥚🥚🥚🥚🥚🥚 🥚🥚🥚🥚🥚🥚 🥚🥚🥚🥚🥚 🥚🥚🥚🥚🥚🥚🥚 🥚🥚🥚 🥚🥚🥚 🥚🥚🥚 🥚 🥚🥚🥚🥚 \n 🥚🥚🥚🥚 🥚🥚🥚🥚🥚🥚🥚🥚🥚 🥚🥚 🥚🥚🥚🥚🥚🥚 🥚🥚🥚')
		message.channel.send(embed)
	},
};