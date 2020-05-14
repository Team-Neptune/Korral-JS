module.exports = {
  name: 'emuleave',
  aliases: ['leaveemu'],
  description: 'This is for testing purposes only. Remove from release.',
  usage: '',
  cooldown: 0,
  botmanager:true,
  hidden:true,
	execute(message, args, client) {
    if(message.mentions.members.size == 0){
      client.emit("guildMemberRemove", message.member)
      respond('⬅️', `<@${message.author.id}> has "left" the server.`, message.channel)
    }else{
      client.emit("guildMemberRemove", message.mentions.members.first())
      respond('⬅️', `<@${message.mentions.members.first().id}> has "left" the server.`, message.channel)
    }
  }}