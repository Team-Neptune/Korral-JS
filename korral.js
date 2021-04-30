console.log('Loading, please wait a moment.')

const fs = require('fs')
fetch = require("node-fetch");

const Discord = require('discord.js');
const client = new Discord.Client({ws:{intents:["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"]}});
client.commands = new Discord.Collection();

let commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
commandFiles.forEach((file) => {
	const commands = require(`./commands/${file}`)
	if(Array.isArray(commands)){
		commands.forEach(command => {
			client.commands.set(command.name, command);
			console.log(`Exported ${command.name}`)
		})
	}else{
		const command = require(`./commands/${file}`)
		client.commands.set(command.name, command)
		console.log(`Loaded ${command.name}`)
	}
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
	console.log(`Ready as ${client.user.tag} (${client.user.id})`);
	const StartupEmbed = new Discord.MessageEmbed()
		.setColor('#00FF00')
		.setTitle('Bot Started')
		.setTimestamp()
		.setFooter(`${client.user.username}`)
	client.channels.cache.get(config.botLog).send(StartupEmbed);
})

process.on('unhandledRejection', error => {
	console.error('Uncaught Promise Rejection', error)
	client.channels.cache.get(config.botl)
});

//Login
client.login(config.token);

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

	if (command.staff && command.staff == true && !message.member.roles.cache.some(role => config.staffRoles.includes(role.id))) {
		message.channel.send('<@' + message.author.id + '>: Check failed. You might not have the right permissions to run this command, or you may not be able to run this command in the current channel.');
		return;
	}
	//Added so there is time to fix commands
	if (command.mod && command.mod == true && !message.member.roles.cache.some(role => config.staffRoles.includes(role.id))) {
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
	member.guild.channels.cache.get(config.userLog).send(`:white_check_mark: Join: <@${member.id}> | ${member.user.tag}\n:calendar_spiral: Creation: ${member.user.createdAt}\n:label: User ID: ${member.id}\n:hash: Server Member Count: ${member.guild.memberCount}`)
}
);

//Member leave
client.on('guildMemberRemove', member => {
	if(config.userLogging == false)return;
	client.channels.cache.get(config.userLog).send(`:arrow_left: Leave: <@${member.id}> | ${member.user.tag}\n:label: User ID: ${member.id}\n:hash: Server Member Count: ${member.guild.memberCount}`)
});

//Log deleted messages
client.on('messageDelete', async message => {
	message.guild.channels.cache.get(config.modLog).send(`:wastebasket: Message delete: \nfrom ${message.author.tag} (${message.author.id}), in <#${message.channel.id}>:\n\`${message.content}\``)
});

//Log message edits
client.on('messageUpdate', (oldMessage, newMessage) => {
	if(oldMessage.aut)
		newMessage.guild.channels.cache.get(config.modLog).send(`:pencil: Message edit: 
from ${newMessage.author.tag} (${newMessage.author.id}), in <#${newMessage.channel.id}>:
\`${oldMessage.content}\` → \`${newMessage.content}\``)
})

//Logs bad words like XCI, NSP, Tinfoil and brawlr perhaps extend this to also look for invites?
client.on('message', message => {
	if (config.suspiciousWordsFilter == false || message.author.bot)return
	let msg = message.content.toLowerCase()
	let blacklistedWords = ["xci", "nsp", "tinfoil", "blawar", "discord.gg"]
	let caughtWords = blacklistedWords.filter(w => msg.includes(w))
	if (caughtWords.length > 0) {
		message.guild.channels.cache.get(config.suspiciousWordsLog).send(`:rotating_light: Suspicious message by <@${message.author.id}> (${message.author.id}):
- Contains suspicious word(s): \`${caughtWords.join(", ")}\`

Jump:
https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`)

		const messageContent = message.content.toLowerCase()
		caughtWords.forEach(w => messageContent.replace(new RegExp(w, "gi")))
		const messageContentEmbed = new Discord.MessageEmbed()
			.setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic:true}))
			.setDescription(messageContent)
		message.guild.channels.cache.get(config.suspiciousWordsLog).send(messageContentEmbed)
	}
})