module.exports = {
  name: 'approve',
  description: 'Approves a role to a user.',
  usage: '<user> <role name>',
  cooldown: 0,
  staff:true,
	execute(message, args, client) {
    const roleConfig = require('../roles.json')
   try{
     if(message.mentions.members.size == 0){
       message.channel.send(`Available roles: ${roleConfig.availableRoles}`)
       return;
      }
    var roleToFind = args.join('').replace(' ', '').replace(args[0], '')
    console.log(roleToFind)
    const Discord = require('discord.js');
    const rolename = roleConfig[roleToFind]
    console.log(rolename)
    const role = message.guild.roles.cache.find(role => role.id === rolename);
    const member = message.mentions.members.first();
    try{
      member.roles.add([role]).then(
        respond('✅ Role Approved', `<@${message.mentions.members.first().id}> had the \`${roleToFind}\` role approved.`, message.channel)
        )
    }catch(error){
    respond('Error', 'Something went wrong.\n'+error, message.channel)
    return;
    }
  }catch(error) {
    respond('Error', 'Something went wrong.\n'+error+`\nMessage: ${message}\nArgs: ${args}\n`, message.channel)
    errorlog(error)
    // Your code broke (Leave untouched in most cases)
    console.error('an error has occured', error);
    }
  }}