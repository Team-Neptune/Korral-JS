module.exports = {
	name: 'komet',
	description: 'Displays the OG autor of Komet and Robocop',
	execute(message, args) {
        if (message.author.bot) return;
        const Discord = require('discord.js');
		const client = new Discord.Client();
        const embed = new Discord.MessageEmbed()
        .setURL('https://github.com/hax4dazy/Komet-JS')
        .setThumbnail('https://cdn.discordapp.com/avatars/336603003660271627/aca6134ad849feb46711092d2c0d9f78.webp?size=1024')
        .setTitle('Komet-JS')
        .setColor('141414')
        .setDescription('Komet-JS (Komet (Robocop-NG)) is developed by [Ave](https://github.com/aveao), [tomGER](https://github.com/tumGER) and [NicholeMattera](https://github.com/NicholeMatteraNicholeMattera), and is a rewrite of Komet. Komet is based on Robocop by Ave and tomGER.')
        message.channel.send(embed)
    },
};