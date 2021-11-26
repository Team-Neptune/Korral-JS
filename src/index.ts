import fetch from 'node-fetch'
import { TextChannel, Client, Collection, MessageEmbed, MessageButton, ThreadChannel } from 'discord.js'
import Command from './classes/Command';
import {config} from '../config'
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { PrivateThread, PrivateThreadSettings, PublicThread } from '../typings';
import ButtonCommand from './classes/ButtonCommand';

const client = new Client({intents:["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"], allowedMentions:{"parse":[]}});
client.commands = new Collection();
client.messageCommands = new Collection();
client.buttonCommands = new Collection();

let hasActiveTickets = {};

client.createSupportThread = async (shortDesc:string, userId:string, privateTicket:boolean) => {
	hasActiveTickets[userId] = true;
	const channel = client.channels.cache.get(config.supportChannelId) as TextChannel;
	const createdChannel = await channel.threads.create({
		name:`${privateTicket?"🔒":"🔓"} - ${shortDesc}`,
		autoArchiveDuration:1440,
		type:"GUILD_PUBLIC_THREAD"
	})
	return createdChannel;
}
client.closeSupportThread = async (channelId:string, userId:string) => {
    hasActiveTickets[userId] = false;
	var channel = (client.channels.cache.get(channelId) as ThreadChannel)
	await channel.setLocked(true, "Ticket has ended")
	return channel
}

//Message Commands
import {botCommands} from './msg_commands/bot'
import {moderationCommands} from './msg_commands/moderation'
import {userCommands} from './msg_commands/user'
import {supportCommands} from './msg_commands/support'
import {memeCommands} from './msg_commands/meme'
import {customCommands} from './msg_commands/custom'

botCommands.forEach(c => client.messageCommands.set(c.name, c))
moderationCommands.forEach(c => client.messageCommands.set(c.name, c))
userCommands.forEach(c => client.messageCommands.set(c.name, c))
supportCommands.forEach(c => client.messageCommands.set(c.name, c))
memeCommands.forEach(c => client.messageCommands.set(c.name, c))
customCommands.forEach(c => client.messageCommands.set(c.name, c))

// Load commands/buttons
let buttonCommandFiles = readdirSync(`./src/buttons`)
.filter(file => file.endsWith('.ts'));

for (let commandFileName of buttonCommandFiles) {
    try {
        import(`./buttons/${commandFileName.split(".")[0].toString()}`).then(commandImport => {
            let command:ButtonCommand = commandImport.default;
			client.buttonCommands.set(commandFileName.split(".")[0].toString(), command)
        });
    } catch (err) {
        console.error(err)
    }
}

let commandFiles = readdirSync(`./src/commands`)
.filter(file => file.endsWith('.ts'));

for (let commandFileName of commandFiles) {
    try {
        import(`./commands/${commandFileName.split(".")[0].toString()}`).then(commandImport => {
            let command:Command = commandImport.default;
			client.commands.set(commandFileName.split(".")[0].toString(), command)
        });
    } catch (err) {
        console.error(err)
    }
}

// Required files
let requiredFiles = ["warnings.json", "userNotes.json"]
for (let index = 0; index < requiredFiles.length; index++) {
	const element = requiredFiles[index];
	if(!existsSync(`./${element}`)){
		writeFileSync(`./${element}`, JSON.stringify({}))
	}
}

client.once('ready', () => {
	console.log(`Ready as ${client.user.tag} (${client.user.id}) | ${client.guilds.cache.size} ${client.guilds.cache.size==1?"guild":"guilds"}`);
	console.log(`Supports: Interactions & Message Commands (Deprecated)`)
	const StartupEmbed = new MessageEmbed()
		.setColor('#00FF00')
		.setDescription(`**${client.user.tag}** is ready. Currently in ${client.guilds.cache.size} ${client.guilds.cache.size==1?"guild":"guilds"}.`)
		.setTimestamp()
	client.channels.fetch(config.botLog).then((channel:TextChannel) => {
		channel.send({embeds:[StartupEmbed]});
	})
	.catch(console.error)
})

process.on('unhandledRejection', error => {
	console.error('Uncaught Promise Rejection', error);
	(client.channels.cache.get(config.botLog) as TextChannel).send(`**Uncaught Promise Rejection**\n\`\`\`console\n${error}\`\`\``)
});

//Code for the /commands folder (Slash Commands)
client.on("interactionCreate", interaction => {
	if(interaction.isCommand()){
		const command = client.commands.get(interaction.commandName);
	
		if (command) {
		
			try {
				command.execute(interaction);
			} catch (error) {
				console.error(error);
				interaction.reply({content:'Uh oh, something went wrong while running that command. Please open an issue on [GitHub](https://github.com/Team-Neptune/Korral-JS) if the issue persists.'});
			}
		} else {
			interaction.reply({
				content:`That command was not found.`,
				ephemeral:true
			})
		}
	}

	if(interaction.isButton()){
		const command = client.buttonCommands.find(bc => bc.checkType == "EQUALS" && interaction.customId == bc.customId) || client.buttonCommands.find(bc => bc.checkType == "STARTS_WITH" && interaction.customId.startsWith(bc.customId));
	
		if (command) {
		
			try {
				command.execute(interaction);
			} catch (error) {
				console.error(error);
				interaction.reply({content:'Uh oh, something went wrong while running that command. Please open an issue on [GitHub](https://github.com/Team-Neptune/Korral-JS) if the issue persists.'});
			}
		} else {
			interaction.reply({
				content:`That button was not found.`,
				ephemeral:true
			})
		}
	}
});

//Code for the /msg_commands folder (Message Commands - deprecated)
client.on('messageCreate', message => {
	if(message.channel.type != "DM" && !message.author.bot && config.prefix.find(p => message.content.startsWith(p))){
		const usedPrefix = config.prefix.find(p => message.content.startsWith(p))
		const args = message.content.slice(usedPrefix.length).split(/ +/);
		const commandName = args.shift().toLowerCase();
		const command = client.messageCommands.get(commandName) || client.messageCommands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	
		if (command) {
			if ((command.disallowedChannels && command.disallowedChannels.includes(message.channel.id)) || (command.allowedChannels && !command.allowedChannels.includes(message.channel.id)) || command.staffOnly == true && !message.member.roles.cache.some(role => config.staffRoles.includes(role.id))){
				message.channel.send({content:`**Invalid permissions**: You don't appear to have the correct permissions to run this commands, or it may be disabled in this channel.`});
			}
		
			try {
				command.execute(message, args);
			} catch (error) {
				console.error(error);
				message.channel.send({content:'Uh oh, something went wrong while running that command. Please open an issue on [GitHub](https://github.com/Team-Neptune/Korral-JS) if the issue persists.'});
			}
		}
	}
});

// // Support channel (Remove thread creation messages)
// client.on("messageCreate", (message) => {
// 	if(message.channelId == config.supportChannelId && message.type == "THREAD_CREATED" && message.channel.type == "GUILD_TEXT")
// 		if(message.deletable)
// 			message.delete()
// })

let privateThreads:PrivateThread = {}
let publicThreads:PublicThread = {}
if(existsSync("./privateThreads.json"))
	privateThreads = JSON.parse(readFileSync("./privateThreads.json").toString());
if(existsSync("./publicThreads.json"))
	publicThreads = JSON.parse(readFileSync("./publicThreads.json").toString());
function saveThreadsData(){
	writeFileSync("./publicThreads.json", JSON.stringify(publicThreads))
	writeFileSync("./privateThreads.json", JSON.stringify(privateThreads))
}

function keepThreadsOpen(){
	(client.channels.cache.get(config.supportChannelId) as TextChannel).threads.fetchActive(true).then(threads => {
		threads.threads.each(channel => {
			if(publicThreads[channel.id] || privateThreads[channel.id]){
				let threadStarter = (publicThreads[channel.id] || privateThreads[channel.id]).ownerId;
				let closeTicketButton = new MessageButton()
				.setStyle("SECONDARY")
				.setCustomId(`close_ticket_${threadStarter}`)
				.setLabel("Close Ticket")
				.setEmoji("🔒");
				channel.send({
					embeds:[
						{
							description:`This message has been sent to keep this ticket open. If you no longer need this ticket, you can close it with the button below.`
						}
					],
					components:[
						{
							"type":1,
							"components":[
								closeTicketButton
							]
						}
					]
				});
			}
		})
	})
}

setInterval(keepThreadsOpen, 22 * 60 * 60 * 1000)
// 22 Hours

// Support threads
client.on("messageCreate", (message) => {
	if(message.channel.isThread() == false) return;

	// Setting thread/ticket to "public"
	if(message.channel.type == "GUILD_PUBLIC_THREAD" && message.channel.parentId == config.supportChannelId && message.author.id == client.user.id && message.type == "DEFAULT" && message.content.includes("public ticket")){
		let authorizedUsers = message.mentions.users.map(u => u.id);
		let authorizedRoles = config.staffRoles;
		authorizedUsers.push(client.user.id);
		authorizedRoles.push(config.supportRoleId)

		publicThreads[message.channel.id] = {
			ownerId:authorizedUsers[0]
		}
		return saveThreadsData();
	}

	// Setting thread/ticket to "private"
	if(message.channel.type == "GUILD_PUBLIC_THREAD" && message.channel.parentId == config.supportChannelId && message.author.id == client.user.id && message.type == "DEFAULT" && message.content.includes("private ticket")){
		let authorizedUsers = message.mentions.users.map(u => u.id);
		let authorizedRoles = config.staffRoles;
		authorizedUsers.push(client.user.id);
		authorizedRoles.push(config.supportRoleId)

		privateThreads[message.channel.id] = {
			authorizedRoles,
			authorizedUsers,
			ownerId:authorizedUsers[0]
		}
		return saveThreadsData();
	}

	//Not found in private threads
	if(!privateThreads[message.channel.id]) return;

	//Unauthorized message in "private" thread
	if(message.channel.type == "GUILD_PUBLIC_THREAD" && message.channel.parentId == config.supportChannelId && message.type == "DEFAULT" && !message.author.bot && !message.author.system){
		let thisTicketAllowed:PrivateThreadSettings = {
			authorizedRoles:privateThreads[message.channel.id].authorizedRoles,
			authorizedUsers:privateThreads[message.channel.id].authorizedUsers,
			ownerId:privateThreads[message.channel.id].ownerId
		}
		if(!thisTicketAllowed.authorizedUsers.includes(message.author.id) && !message.member.roles.cache.find(r => thisTicketAllowed.authorizedRoles.includes(r.id))){
			message.delete();
			message.author.send({
				embeds:[
					{
						description:`Hey there <@${message.author.id}>, <#${message.channel.id}> is a private ticket. It's viewable to all, but only staff and ticket starter can speak. Please note: Repeatedly attempting to talk in a thread you aren't authorized to be in can result is being muted and/or restricted from using threads.`,
						color:"RED",
						footer:{
							text:`${message.guild.name} (${message.guildId})`,
							iconURL:message.guild.iconURL({dynamic:true})
						}
					}
				]
			}).catch(console.error)
			message.channel.members.remove(message.author.id, `Not authorized for this ticket`)
			return;
		}
	}

	// Add member to authorized
	if(message.channel.type == "GUILD_PUBLIC_THREAD" && message.channel.parentId == config.supportChannelId && message.type == "DEFAULT" && !message.author.bot && !message.author.system){
		let thisTicketAllowed:PrivateThreadSettings = {
			authorizedRoles:privateThreads[message.channel.id].authorizedRoles,
			authorizedUsers:privateThreads[message.channel.id].authorizedUsers,
			ownerId:privateThreads[message.channel.id].ownerId
		}
		if(thisTicketAllowed.authorizedUsers.includes(message.author.id) || message.member.roles.cache.find(r => thisTicketAllowed.authorizedRoles.includes(r.id)) && message.mentions.users.size > 0){
			message.mentions.users = message.mentions.users.filter(u => !privateThreads[message.channel.id].authorizedUsers.includes(u.id));
			if(message.mentions.users.size == 0) return;
			message.mentions.users.each(u => {
				if(!privateThreads[message.channel.id].authorizedUsers.includes(u.id)){
					privateThreads[message.channel.id].authorizedUsers.push(u.id);
				}
			})
			message.reply({
				embeds:[
					{
						description:`✅ Added ${message.mentions.users.map(u => `<@${u.id}>`).join(", ")} to this ticket.`,
						color:"GREEN"
					}
				]
			})
		}
	}
})

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