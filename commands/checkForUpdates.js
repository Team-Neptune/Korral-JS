module.exports = {
  name: 'updates',
  aliases: ['checkforupdates'],
  description: 'Checks commit ID to latest to find updates.',
  staff:true,
  essential:true,
	execute(message, args, client) {
    checkForUpdates().then(result => {
      message.channel.send(result)
    })
  }
}