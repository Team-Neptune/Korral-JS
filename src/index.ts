console.log('Loading, please wait a moment.')
import * as fs from 'fs'
import fetch from 'node-fetch'
import { TextChannel, Client, Collection, MessageEmbed } from 'discord.js'
import { Command } from '../typings';
import {config} from '../config'

const client = new Client({ws:{intents:["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"]}});
client.commands = new Collection()

//Commands
import {botCommands} from './commands/bot'
import {moderationCommands} from './commands/moderation'
import {userCommands} from './commands/user'
import {supportCommands} from './commands/support'
import {memeCommands} from './commands/meme'
import {customCommands} from './commands/custom'

botCommands.forEach(c => client.commands.set(c.name, c))
moderationCommands.forEach(c => client.commands.set(c.name, c))
userCommands.forEach(c => client.commands.set(c.name, c))
supportCommands.forEach(c => client.commands.set(c.name, c))
memeCommands.forEach(c => client.commands.set(c.name, c))
customCommands.forEach(c => client.commands.set(c.name, c))


let requiredFiles = ["warnings.json", "userNotes.json"]
for (let index = 0; index < requiredFiles.length; index++) {
	const element = requiredFiles[index];
	if(!fs.existsSync(`../${element}`)){
		fs.writeFileSync(`../${element}`, JSON.stringify({}))
	}
}

client.once('ready', () => {
	console.log(`Ready as ${client.user.tag} (${client.user.id}) | ${client.guilds.cache.size} ${client.guilds.cache.size==1?"guild":"guilds"}`);
	const StartupEmbed = new MessageEmbed()
		.setColor('#00FF00')
		.setDescription(`**${client.user.tag}** is ready. Currently in ${client.guilds.cache.size} ${client.guilds.cache.size==1?"guild":"guilds"}.`)
		.setTimestamp()
	client.channels.fetch(config.botLog).then(c => {
		(c as TextChannel).send(StartupEmbed);
	})
})

process.on('unhandledRejection', error => {
	console.error('Uncaught Promise Rejection', error);
	(client.channels.cache.get(config.botLog) as TextChannel).send(`**Uncaught Promise Rejection**\n\`\`\`console\n${error}\`\`\``)
});

//this is the code for the /commands folder
client.on('message', message => {
	if(message.channel.type == "dm" || message.author.bot || config.prefix.filter(p => message.content.startsWith(p)).length == 0)
		return;

	const usedPrefix = config.prefix.find(p => message.content.startsWith(p))
	const args = message.content.slice(usedPrefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if ((command.disallowedChannels && command.disallowedChannels.includes(message.channel.id)) || (command.allowedChannels && !command.allowedChannels.includes(message.channel.id)) || command.staffOnly == true && !message.member.roles.cache.some(role => config.staffRoles.includes(role.id)))
		return message.channel.send(`**Invalid permissions**: You don't appear to have the correct permissions to run this commands, or it may be disabled in this channel.`);

	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.channel.send('Uh oh, something went wrong while running that command. Contact TechGeekGamer#7205 if the issue persists.');
	}
});

//Member join
client.on('guildMemberAdd', member => {
	if(config.userLogging == false)return;
	(member.guild.channels.cache.get(config.userLog) as TextChannel).send(`:white_check_mark: Join: <@${member.id}> | ${member.user.tag}\n:calendar_spiral: Creation: ${member.user.createdAt}\n:label: User ID: ${member.id}\n:hash: Server Member Count: ${member.guild.memberCount}`)
}
);

//Member leave
client.on('guildMemberRemove', member => {
	if(config.userLogging == false)return;
	(client.channels.cache.get(config.userLog) as TextChannel).send(`:arrow_left: Leave: <@${member.id}> | ${member.user.tag}\n:label: User ID: ${member.id}\n:hash: Server Member Count: ${member.guild.memberCount}`)
});

//Log deleted messages
client.on('messageDelete', message => {
	(message.guild.channels.cache.get(config.modLog) as TextChannel).send(`:wastebasket: **Message Delete**:\nfrom ${message.author.tag} (${message.author.id}) | in <#${message.channel.id}>:\n\`${message.content}\``)
});

//Log message edits
client.on('messageUpdate', (oldMessage, newMessage) => {
	if(oldMessage.author.id == newMessage.author.id && !newMessage.author.bot && oldMessage.content != newMessage.content)
		(newMessage.guild.channels.cache.get(config.modLog) as TextChannel).send(`:pencil: **Message Edit**:\nfrom ${newMessage.author.tag} (${newMessage.author.id}) | in <#${newMessage.channel.id}>:\n\`${oldMessage.content}\`\n → \n\`${newMessage.content}\``)
})

//Login
client.login(config.token);