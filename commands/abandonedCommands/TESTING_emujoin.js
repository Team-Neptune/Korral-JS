module.exports = {
  name: 'emujoin',
  aliases: ['joinemu'],
  description: 'This is for testing purposes only. Remove from release.',
  usage: 'N/A',
  cooldown: 0,
  botmanager:true,
  hidden:true,
	execute(message, args, client) {
    if(message.mentions.members.size == 0){
      client.emit("guildMemberAdd", message.member)
      respond('✅', `<@${message.author.id}> has "joined" the server.`, message.channel)
    }else{
      client.emit("guildMemberAdd", message.mentions.members.first())
      respond('✅', `<@${message.mentions.members.first().id}> has "joined" the server.`, message.channel)
    }
  }}