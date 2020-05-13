module.exports = {
  name: 'speak',
  description: 'Has the bot speak in another channel.',
  usage: '<channel> <text>',
  cooldown: 0,
  mod:true,
  nodelay:true,
	execute(message, args, client) {
    const { prefix } = require('../config.json');
    const argarray = message.content.slice(prefix.length).trim().split(/ +/g);

		if(!message.mentions.channels.first()){
      respond('Error', 'Please mention a channel.', message.channel);
      return;
    }
    if(!argarray[1].includes(message.mentions.channels.first().id)){
      respond('Error', 'Please mention a channel.', message.channel);
      return;
    }
    if(!argarray[2]){
      respond('Error', 'Please provide a message.', message.channel);
      return;
    }
    var text = args.join(' ');
    var text = text.replace(argarray[1], '')
		message.delete()
		message.mentions.channels.first().send(text)
  }}