module.exports = {
  name: 'emuleave',
  aliases: ['leaveemu'],
  description: 'This is for testing purposes only. Remove from release.',
  usage: '',
  cooldown: 0,
  botmanager:true,
  hidden:true,
	execute(message, args) {
    global.client = new Discord.Client()
    client.emit("guildMemberRemove", message.member)
  }}