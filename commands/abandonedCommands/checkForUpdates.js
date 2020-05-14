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

//below is what should go in main bot file
//Check for updates
checkForUpdates = function(){
  exec("git rev-parse HEAD", (error, stdout, stderr) => {
    commitID = `${stdout}`
    version = `${stdout}`
    })
  exec("git log master --format=\"%H\" -n 1", (err, stdout, stderr) => {
    latestCommit = stdout
  })
  exec("git log master -1 --pretty=%B", (err, stdout, stderr) => {
    latestCommitMessage = stdout
  })
  if(latestCommit != commitID){
    const UpdateAvailableEmbed = new Discord.MessageEmbed()
    .setTitle('Update Available')
    .setColor('ffa500')
    .setDescription(`An update is available.\nLatest commit ID: ${latestCommit}\nLocal commit ID: ${commitID}`)
    .addField('Commit message',latestCommitMessage,false)
    .setTimestamp()
    .setFooter(`${client.user.username} | Commit: ${commitID}`)
    client.channels.cache.get(`${botLog}`).send(UpdateAvailableEmbed);
    return `An update was found.\nLocal commit ID: ${commitID}\nLatest commit ID: ${latestCommit}\nUpdate information can be found in <#${config.botLog}>.`
  }else{
    return `No update was found.\nLocal commit ID: ${commitID}\nLatest commit ID: ${latestCommit}`
  }
}