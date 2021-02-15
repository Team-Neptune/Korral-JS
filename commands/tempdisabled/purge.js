module.exports = {
    name: 'purge',
    description: 'Deletes multiple messages at once.',
	usage: '<amount>',
	cooldown: 0,
	staff:true,
    execute(message, args, client) {
        try {
			if(!args[0]){
				message.channel.send('Invalid arguments.')
					return;
				}
				message.channel.bulkDelete(Number(args[0])+1)
					}catch(error) {
						// Your code broke (Leave untouched in most cases)
						console.error('an error has occured', error);
						}
    },
};