module.exports = {
	name: 'userinfo',
	description: 'Views info about the mentioned member.',
	staff: true,
	execute(message, args) {
		const Discord = require('discord.js')


		function returnResponse(reponse = "Something happened but no response was defined.") {
			message.channel.send(reponse);
		}

		if (message.mentions.members.first()) {
			var mentionedMember = message.mentions.members.first();
		} else {
			returnResponse(`No user was mentioned.`);
			return;
		}

		// all requirements are met

		const embed = new Discord.MessageEmbed()
		embed.setDescription(`Username: ${mentionedMember.user.tag}\nID: ${mentionedMember.user.id}\nAvatar: [here](${mentionedMember.user.displayAvatarURL({dynamic:true})})\nBot: ${mentionedMember.user.bot}\nCreation: ${mentionedMember.user.createdAt}\nDisplay Name: ${mentionedMember.nickname || "None."}\nJoined: ${mentionedMember.joinedAt}\nHighest Role: ${mentionedMember.roles.highest || "None."}`)
		message.channel.send(embed)
	}
};