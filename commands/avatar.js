const Discord = require('discord.js');
module.exports = {
	name: 'avatar',
	description: 'Grabs the current users avatar',
    /**
     * 
     * @param {Discord.Message} message 
     * @param {Array<String>} args 
     */
	execute(message, args) {
        const member = message.mentions.members.first() || message.member
        const avatarEmbed = new Discord.MessageEmbed()
        .setColor(member.roles.highest?member.roles.highest.color:"")
        .setAuthor(member.user.tag)
        .setImage(member.user.displayAvatarURL({"size":"512", "dynamic":true}));
        message.channel.send(avatarEmbed).catch(e => {
            message.client.channels.cache.get(require("../config.json").botLog).send(`\`\`\`console\n${e}\`\`\``, {allowedMentions:{parse:[]}})
        })
    },
};