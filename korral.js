console.log('Loading, please wait a moment.')

const fs = require('fs')
fetch = require("node-fetch");

const Discord = require('discord.js');
const client = new Discord.Client({ws:{intents:["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"]}});
client.commands = new Discord.Collection();

const commands = require(`./commands/${file}`)
commands.forEach(command => {
	client.commands.set(command.name, command);
	console.log(`exported ${command.name}`)
})

const config = require('./config.json')


respond = function (title, content, sendto, color) {
	//Since hax4dayz likes to copy my code from my other bot
	//He doesn't check to make sure it works on this bot :shrek:
	sendto.send(content)
}

//Required files
let requiredFiles = ["warnings.json", "userNotes.json"]
for (let index = 0; index < requiredFiles.length; index++) {
	const element = requiredFiles[index];
	if(!fs.existsSync(`./${element}`)){
		fs.writeFileSync(`./${element}`, JSON.stringify({}))
	}
}

//Bootup check
client.once('ready', () => {
	console.log('Ready!');
	const StartupEmbed = new Discord.MessageEmbed()
		.setColor('#00FF00')
		.setTitle('Bot Started')
		.setTimestamp()
		.setFooter(`${client.user.username}`)
	client.channels.cache.get(`${botLog}`).send(StartupEmbed);
})

process.on('unhandledRejection', error => {
	console.error('Uncaught Promise Rejection', error)
	client.channels.cache.get(config.botl)
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
	if(!config.prefix.includes(message.content.charAt(0)))return;
	if (message.author.bot) return;

	const args = message.content.slice(config.prefix[config.prefix.findIndex(p => message.content.charAt(0) == p)].length).split(/ +/);
	console.log(args)
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.staff && command.staff == true && !message.member.roles.cache.some(role => staffRoles.includes(role.id))) {
		message.channel.send('<@' + message.author.id + '>: Check failed. You might not have the right permissions to run this command, or you may not be able to run this command in the current channel.');
		return;
	}
	//Added so there is time to fix commands
	if (command.mod && command.mod == true && !message.member.roles.cache.some(role => staffRoles.includes(role.id))) {
		message.channel.send('<@' + message.author.id + '>: Check failed. You might not have the right permissions to run this command, or you may not be able to run this command in the current channel.');
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
	if(config.userLogging == false)return;
	member.guild.channels.cache.get(`${userLog}`).send(`:white_check_mark: Join: <@${member.id}> | ${member.user.tag}\n:calendar_spiral: Creation: ${member.user.createdAt}\n:label: User ID: ${member.id}\n:hash: Server Member Count: ${member.guild.memberCount}`)
}
);

//Member leave
client.on('guildMemberRemove', member => {
	if(config.userLogging == false)return;
	client.channels.cache.get(`${userLog}`).send(`:arrow_left: Leave: <@${member.id}> | ${member.user.tag}\n:label: User ID: ${member.id}\n:hash: Server Member Count: ${member.guild.memberCount}`)
});

//Log deleted messages
client.on('messageDelete', async message => {
	message.guild.channels.cache.get(modLog).send(`:wastebasket: Message delete: \nfrom ${message.author.tag} (${message.author.id}), in <#${message.channel.id}>:\n\`${message.content}\``)
});

//Log message edits
client.on('messageUpdate', (oldMessage, newMessage) => {
	if(oldMessage.aut)
		newMessage.guild.channels.cache.get(modLog).send(`:pencil: Message edit: 
from ${newMessage.author.tag} (${newMessage.author.id}), in <#${newMessage.channel.id}>:
\`${oldMessage.content}\` → \`${newMessage.content}\``)
})

//Logs bad words like XCI, NSP, Tinfoil and brawlr perhaps extend this to also look for invites?
client.on('message', message => {
	if (config.suspiciousWordsFilter == true && config.suspiciousWordsLog){
	if (message.author.bot) return;
	var msg = message.content.toLowerCase()
	if (msg.includes('xci') || msg.includes('nsp') || msg.includes('tinfoil') || msg.includes('blawar') || msg.includes('discord.gg')) {
		caughtwords = []
		if (msg.includes('xci')) caughtwords.push('xci')
		if (msg.includes('nsp')) caughtwords.push('nsp')
		if (msg.includes('tinfoil')) caughtwords.push('tinfoil')
		if (msg.includes('blawar')) caughtwords.push('blawar')
		message.guild.channels.cache.get(config.suspiciousWordsLog).send(`:rotating_light: Suspicious message by <@${message.author.id}> (${message.author.id}):
- Contains suspicious word(s): \`${caughtwords}\`

Jump:
https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`)

		const messageContent = message.content.toLocaleLowerCase().replace(/xci/g, '**xci**').replace(/nsp/g, '**nsp**').replace(/tinfoil/g, '**tinfoil**').replace(/blawar/g, '**blawar**').replace(/discord.gg/g, '**discord.gg**')
		const messageContentEmbed = new Discord.MessageEmbed()
			.setAuthor(`${message.author.tag}`, message.author.avatarURL(), '')
			.setDescription(`${messageContent}`)
		message.guild.channels.cache.get(config.suspiciousWordsLog).send(messageContentEmbed)
	}
	}
})