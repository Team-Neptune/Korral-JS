module.exports = [
	{
		name: 'eta',
		description: '@tomger eta wen',
		usage: '<text>',
		cooldown: 0,
		mod: false,
		nodelay: true,
		execute(message, args) {
			const messages = [
				'Soon:tm:',
				'June 15th',
				'Germany',
				'jelbrek wil lunch tomorrr',
				':egg:',
			]
			const index = Math.floor(Math.random() * messages.length)
			const msg = messages[index]
			message.channel.send(msg)
	}
};