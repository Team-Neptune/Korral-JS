console.log('Loading, please wait a moment.')

fs = require('fs')

Discord = require('discord.js');
client = new Discord.Client();
client.commands = new Discord.Collection();
commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const {
	MessageEmbed
} = require('discord.js');

const {
	prefix,
	token, 
	botLog, 
	modLog, 
	userLog,
	staffRoles
} = require ('./config.json');
const config = require('./config.json')


respond = function (title, content, sendto, color){
	//Since hax4dayz likes to copy my code from my other bot
	//He doesn't check to make sure it works on this bot :shrek:
	sendto.send(content)
}
/*
const { exec } = require("child_process");
exec("git rev-parse HEAD", (error, stdout, stderr) => {
	if(stderr)return;
	commitID = `${stdout}`
	version = `${stdout}`
	if(stderr)console.log(stderr)
	})
exec("git log master --format=\"%H\" -n 1", (err, stdout, stderr) => {
	if(stderr)return;
	latestCommit = stdout
	if(stderr)console.log(stderr)
})
exec("git log master -1 --pretty=%B", (err, stdout, stderr) => {
	if(stderr)return;
	latestCommitMessage = stdout
	if(stderr)console.log(stderr)
})

//Check for updates automatically
autoCheckForUpdates = function(){
	console.log('Checking for updates...')
	setTimeout(function(){ 
		exec("git rev-parse HEAD", (error, stdout, stderr) => {
			if(stderr)return;
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
			.setFooter(`${client.user.username} | Version: ${commitID}`)
			client.channels.cache.get(`${botLog}`).send(UpdateAvailableEmbed);
			console.log('Checking for updates complete. Update was found.')
		}else{
			console.log('Checking for updates complete. No update found.')
		}
		autoCheckForUpdates()
	}, 43200000);
}
autoCheckForUpdates()

*/

//If files are missing, they are created
fs.readFile('./warnings.json',(err, data) => {
	if(err)fs.writeFile('./warnings.json', JSON.stringify({}), (err) => {if(err)console.log(err)})
})

//Bootup check
client.once('ready', () => {
	commitID = "2.0.0"
	console.log('Ready!');
	//console.log(`Local commit ID: ${commitID}`)
//	console.log(`Latest commit ID: ${latestCommit}`)
		const StartupEmbed = new Discord.MessageEmbed()
			.setColor('#00FF00')
			.setTitle('Bot Started')
			.setTimestamp()
			.setFooter(`${client.user.username} | Version: ${commitID}`)
		client.channels.cache.get(`${botLog}`).send(StartupEmbed);
				//Check for updates
				return;
				 		if(latestCommit != commitID){
						const UpdateAvailableEmbed = new Discord.MessageEmbed()
						.setTitle('Update Available')
						.setColor('ffa500')
						.setDescription(`An update is available.\nLatest commit ID: ${latestCommit}\nLocal commit ID: ${commitID}`)
						.addField('Commit message',latestCommitMessage,false)
						.setTimestamp()
						.setFooter(`${client.user.username} | Version: ${commitID}`)
						client.channels.cache.get(`${botLog}`).send(UpdateAvailableEmbed);
					
					  }
				})

process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

//Error
client.on('error', error => {
	console.error('an error has occured', error);

});

//Login
client.login(token);

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

//this is the code for the /commands folder
client.on('message', message => {
	var firstChar = message.content.slice(0, 1)
	if (!prefix.includes(firstChar) && !message.content.startsWith(firstChar) || message.author.bot) return;

	const args = message.content.slice(firstChar.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if(!command)return;
	
	if(command.staff && command.staff == true && !message.member.roles.cache.some(role => staffRoles.includes(role.id))){
		message.channel.send('<@'+message.author.id+'>: Check failed. You might not have the right permissions to run this command, or you may not be able to run this command in the current channel.');
		return;
	}
	//Added so there is time to fix commands
	if(command.mod && command.mod == true && !message.member.roles.cache.some(role => staffRoles.includes(role.id))){
		message.channel.send('<@'+message.author.id+'>: Check failed. You might not have the right permissions to run this command, or you may not be able to run this command in the current channel.');
		return;
	}

	try {
		command.execute(message, args, client);
	} catch (error) {
		console.error(error);
		message.channel.send('There was an error trying to execute that command!');
	}
});

//Member join
client.on('guildMemberAdd', member => {
	const guild = member.guild
	member.guild.channels.cache.get(`${userLog}`).send(`:white_check_mark: Join: <@${member.id}> | ${member.user.tag}
:calendar_spiral: Creation: ${member.user.createdAt}
:label: User ID: ${member.id}
:hash: Server Member Count: ${member.guild.memberCount}`)
	}
);

//Member leave
client.on('guildMemberRemove', member => {
	const guild = member.guild
	client.channels.cache.get(`${userLog}`).send(`:arrow_left: Leave: <@${member.id}> | ${member.user.tag}
:label: User ID: ${member.id}
:hash: Server Member Count: ${member.guild.memberCount}`)
});

//Log deleted messages
client.on('messageDelete', async message => {
	const fetchedLogs = await message.guild.fetchAuditLogs({
		limit: 1,
		type: 'MESSAGE_DELETE',
	});

	message.guild.channels.cache.get(modLog).send(`:wastebasket: Message delete: 
from ${message.author.tag} (${message.author.id}), in <#${message.channel.id}>:
\`${message.content}\``)
	//May fix it up someday TM
	return; 
	// Since we only have 1 audit log entry in this collection, we can simply grab the first one
	const deletionLog = fetchedLogs.entries.first();

	// Let's perform a sanity check here and make sure we got *something*
	if (!deletionLog) {  console.log(`A message by ${message.author.tag} was deleted, but no relevant audit logs were found.`);
	const DeletionEmbed = new Discord.MessageEmbed()
	.setColor('#ff0000')
	.setTitle('Message Deleted')
	.addFields(
		{ name: 'Message sent by', value: message.author.tag, inline: false },
		{ name: 'Deleted by', value: 'Unknown - Audit log was not found.', inline: false },
		{ name: 'Sent in', value: message.channel.name, inline: false },
		{ name: 'Message', value: message.content, inline: false },
	)
	.setTimestamp()
	client.channels.cache.get(`${modLog}`).send(DeletionEmbed)}

	// We now grab the user object of the person who deleted the message
	// Let us also grab the target of this action to double check things
	const { executor, target } = deletionLog;


	// And now we can update our output with a bit more information
	// We will also run a check to make sure the log we got was for the same author's message
	if (target.id === message.author.id) {
		console.log(`A message by ${message.author.tag} was deleted by ${executor.tag}.`)
		const DeletionEmbed = new Discord.MessageEmbed()
		.setColor('#ff0000')
		.setTitle('Message Deleted')
		.addFields(
			{ name: 'Message sent by', value: message.author.tag, inline: false },
			{ name: 'Deleted by', value: executor.tag + ` (${executor.id})`, inline: false },
			{ name: 'Sent in', value: message.channel.name, inline: false },
			{ name: 'Message', value: message.content, inline: false },
		)
		.setTimestamp()
		client.channels.cache.get(`${modLog}`).send(DeletionEmbed)
		return;
	}	else {
		if (target.id === message.author.id) return;
		console.log(`A message by ${message.author.tag} was deleted, but we don't know by who.`)
		const DeletionEmbed = new Discord.MessageEmbed()
		.setColor('#ff0000')
		.setTitle('Message Deleted')
		.addFields(
			{ name: 'Message sent by', value: message.author.tag, inline: false },
			{ name: 'Deleted by', value: 'Unable to find.', inline: false },
			{ name: 'Sent in', value: message.channel.name, inline: false },
			{ name: 'Message', value: message.content, inline: false },
		)
		.setTimestamp()
		client.channels.cache.get(`${modLog}`).send(DeletionEmbed)
		return;
	}
});

//Log message edits
client.on('messageUpdate', (oldMessage, newMessage) => {
	if(newMessage.author.bot)return
	if(newMessage.author != client.user)
	newMessage.guild.channels.cache.get(modLog).send(`:pencil: Message edit: 
from ${newMessage.author.tag} (${newMessage.author.id}), in <#${newMessage.channel.id}>:
\`${oldMessage.content}\` → \`${newMessage.content}\``)
})

//Logs bad words like XCI, NSP, Tinfoil and brawlr perhaps extend this to also look for invites?
client.on('message', message => {
	if(config.suspiciousWordsFilter == true && config.suspiciousWordsLog)
	if(message.author.bot) return;
	var msg = message.content.toLowerCase()
       if (msg.includes('xci') || msg.includes('nsp') || msg.includes('tinfoil') || msg.includes('blawar') || msg.includes('discord.gg')) {
		   caughtwords = []
		   if(msg.includes('xci'))caughtwords.push('xci')
		   if(msg.includes('nsp'))caughtwords.push('nsp')
		   if(msg.includes('tinfoil'))caughtwords.push('tinfoil')
		   if(msg.includes('blawar'))caughtwords.push('blawar')
		   message.guild.channels.cache.get(config.suspiciousWordsLog).send(`:rotating_light: Suspicious message by <@${message.author.id}> (${message.author.id}):
- Contains suspicious word(s): \`${caughtwords}\`

Jump:
https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`)

const messageContent = message.content.toLocaleLowerCase().replace(/xci/g, '**xci**').replace(/nsp/g, '**nsp**').replace(/tinfoil/g, '**tinfoil**').replace(/blawar/g, '**blawar**').replace(/discord.gg/g, '**discord.gg**')
const messageContentEmbed = new Discord.MessageEmbed()
.setAuthor(`${message.author.tag}`, message.author.avatarURL(), '')
.setDescription(`${messageContent}`)
message.guild.channels.cache.get(config.suspiciousWordsLog).send(messageContentEmbed)
}
})