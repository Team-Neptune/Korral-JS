module.exports = {
    name: 'warn',
    description: 'Warns a user.',
	usage: '<user> <reason>',
	cooldown: 0,
	staff:true,
    execute(message, args) {
		const fs = require('fs');
		try {
			if (message.author.id == message.mentions.members.first().id){message.channel.send(`You can't perform this action on yourself.`);return;}
			const {staffRoles} = require('../config.json');
			if (message.mentions.members.first().roles.cache.some(role => staffRoles.includes(role.id))){
				respond('',`You can't perform that action on this user.`, message.channel);return;
			}
			const {modLog} = require('../config.json');
			const user = message.mentions.users.first();
			const userid = user.id
			const authorusername = message.author.username +'#' +message.author.discriminator
			var reason = args.join(' ').replace(args[0], '')
			if(reason == ''){var reason = 'No reason provided.'}

			amountofwarns = 0
			if(fs.existsSync('./warnings.json')){
			var warningjson = require('../warnings.json')
			if(warningjson.warnings)amountofwarns = warningjson.warnings
			delete require.cache[require.resolve(`../warnings.json`)]
			}
			let student = { 
				name: `${user.tag}`, 
				reason: `${reason}`,
				warnings:amountofwarns+1

			};
			 
			let data = JSON.stringify(student, null, 2);
			
			fs.writeFile('./warnings.json', data, (err) => {
				if (err) throw err;
				console.log('Data written to file');
				delete require.cache[require.resolve(`../warnings.json`)]
				warningjson = require('../warnings.json')
			delete require.cache[require.resolve(`../warnings.json`)]
			warningjson = require('../warnings.json')
			message.mentions.members.first().send(`You were warned on ${message.guild.name}. The given reason is: ${reason}\n\nPlease read the rules. This is warn #${warningjson.warnings}.`)
			message.channel.send(`<@${user.id}> warned. User has ${warningjson.warnings} warning(s).`)
			message.guild.channels.cache.get(modLog).send(`:warning: Warned: <@${message.author.id}> warned <@${message.mentions.members.first().id}> (warn #${warningjson.warnings}) | ${message.mentions.members.first().user.tag}
:pencil2: Reason: "${reason}"`)
delete require.cache[require.resolve(`../warnings.json`)]
});
    		}
        catch(error) {
			// Your code broke (Leave untouched in most cases)
			console.error('an error has occured', error);
		  }
    },
};
