module.exports = {
  name: 'emujoin',
  aliases: ['joinemu'],
  description: 'This is for testing purposes only. Remove from release.',
  usage: 'N/A',
  cooldown: 0,
  botmanager:true,
  hidden:true,
	execute(message, args) {
    global.client = new Discord.Client()
    client.emit("guildMemberAdd", message.member)
  }}