module.exports = {
  name: 'say',
  aliases: ['echo'],
  description: 'Has the bot speak in the channel it is ran in.',
  usage: '<text>',
  cooldown: 0,
  staff:true,
	execute(message, args, client) {	
    message.delete()
		const { prefix } = require('../config.json');;
		const text = args.join(' ');
    message.channel.send(text)
  }}