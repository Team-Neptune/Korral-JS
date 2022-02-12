import fetch from 'node-fetch'
import { TextChannel, Client, Collection, MessageEmbed, MessageButton, ThreadChannel, GuildMemberRoleManager, ApplicationCommand, Interaction } from 'discord.js'
import Command from './classes/Command';
import {config} from '../config'
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { ActiveTickets, PrivateThread, PrivateThreadSettings, PublicThread, TicketType } from '../typings';
import ButtonCommand from './classes/ButtonCommand';
import DeepSea from './deepsea'

const client = new Client({intents:["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"]});
client.commands = new Collection();
client.messageCommands = new Collection();
client.buttonCommands = new Collection();
client.ctxCommands = new Collection();

let activeTickets:ActiveTickets = {};
if(existsSync("./activeTickets.json"))
	activeTickets = JSON.parse(readFileSync("./activeTickets.json").toString());
function saveActiveTicketsData(){
	writeFileSync("./activeTickets.json", JSON.stringify(activeTickets))
}

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

client.createSupportThread = async (options:{shortDesc:string, userId:string, privateTicket:boolean}) => {
	const channel = client.channels.cache.get(config.supportChannelId) as TextChannel;
	const createdChannel = await channel.threads.create({
		name:`${options.privateTicket?"🔒":"🔓"} - ${options.shortDesc}`,
		autoArchiveDuration:1440,
		type:"GUILD_PUBLIC_THREAD"
	})
	activeTickets[options.userId] = {
		active:true,
		threadChannelId:createdChannel.id,
		userId:options.userId,
		createdMs:Date.now(),
		type:options.privateTicket?"PRIVATE":"PUBLIC"
	};
	if(options.privateTicket){
		let authorizedUsers = [options.userId];
		let authorizedRoles = config.staffRoles;
		authorizedUsers.push(client.user.id);
		authorizedRoles.push(config.supportRoleId)

		privateThreads[createdChannel.id] = {
			authorizedRoles,
			authorizedUsers,
			ownerId:authorizedUsers[0]
		}
		saveThreadsData();
	} else {
		let authorizedUsers = [options.userId];
		let authorizedRoles = config.staffRoles;
		authorizedUsers.push(client.user.id);
		authorizedRoles.push(config.supportRoleId)

		publicThreads[createdChannel.id] = {
			ownerId:authorizedUsers[0]
		}
		saveThreadsData();
	}
	saveActiveTicketsData();
	return createdChannel;
}

client.updateSupportThread = async (options:{userId:string, threadId:string, newType?:TicketType, newName?:string}) => {
	if(!publicThreads[options.threadId] && !privateThreads[options.threadId])
		return false;
	let threadChannel = client.channels.cache.get(options.threadId) as ThreadChannel;
	let newThreadChannelName:string = threadChannel.name;

	if(options.newType){
		activeTickets[options.userId].type = options.newType;
		saveActiveTicketsData()
	}

	if(options.newType == "PUBLIC"){
		publicThreads[options.threadId] = publicThreads[options.threadId] || privateThreads[options.threadId];

		privateThreads[options.threadId] = undefined;

		newThreadChannelName = newThreadChannelName.replace("🔒", "🔓")
		// await threadChannel.setName(threadChannel.name
		// 	.replace("🔓", "🔒")
		// 	.replace(threadChannel.name.split(" - ")[1], options.newName || threadChannel.name.split(" - ")[1])
		// )
		saveThreadsData()
	}

	if(options.newType == "PRIVATE"){
		let authorizedUsers = [options.userId, client.user.id];
		let authorizedRoles = [...config.staffRoles, config.supportRoleId];
		
		privateThreads[options.threadId] = privateThreads[options.threadId] || {
			authorizedRoles,
			authorizedUsers,
			ownerId:options.userId
		};
		publicThreads[options.threadId] = undefined;

		newThreadChannelName = newThreadChannelName.replace("🔓", "🔒")
		saveThreadsData()
	}

	if(options.newName){
		newThreadChannelName = newThreadChannelName.replace(threadChannel.name.split(" - ")[1], options.newName)
	}

	if((options.newType != activeTickets[options.userId].type) && newThreadChannelName != threadChannel.name){
		try {
			threadChannel.setName(newThreadChannelName).then(console.log).catch(console.error)
		} catch(err){
			console.error(err)
		}
	}

	return true;
};

client.closeSupportThread = async (options:{userId:string, channelId?:string, noApi?:boolean}) => {
	var channel = (client.channels.cache.get(options.channelId || activeTickets[options.userId]?.threadChannelId) as ThreadChannel)
	if(!options.noApi){
		await channel.setLocked(true, "Ticket has been closed")
		await channel.setArchived(true, "Ticket has been closed")
		let supportChannelMessages = await (client.channels.cache.get(config.supportChannelId) as TextChannel).messages.fetch();
		supportChannelMessages.find(message => message.thread?.id == activeTickets[options.userId].threadChannelId)?.delete()
	}
	activeTickets[options.userId].active = false;
	saveActiveTicketsData();
	return channel
}

client.getSupportThreadData = (userId:string) => {
	return activeTickets[userId];
}

import ContextMenuCommand from './classes/ContextMenuCommand';
import commands from './commands';

async function setupApplicationCommands(guildId?:string):Promise<Collection<string, ApplicationCommand>> {
	if(guildId)
		return await client.guilds.cache.get(guildId).commands.set(commands)
	return await client.application.commands.set(commands)
}

async function loadButtonCommands(){
	let buttonCommandFiles = readdirSync(`./src/buttons`)
	.filter(file => file.endsWith('.ts'));
	
	for (var buttonFileName of buttonCommandFiles) {
		try {
			var commandImport = await import(`./buttons/${buttonFileName.split(".")[0].toString()}`);
			var command:ButtonCommand = commandImport.default;
			await client.buttonCommands.set(command.customId, command)
		} catch (err) {
			console.error(err)
		}
	}
}

async function loadSlashCommands(){
	let commandFiles = readdirSync(`./src/commands`)
	.filter(file => file.endsWith('.ts'));
	
	for (var commandFileName of commandFiles) {
		try {
			var commandImport = await import(`./commands/${commandFileName.split(".")[0].toString()}`);
			var command:Command = commandImport.default;
			await client.commands.set(commandFileName.split(".")[0].toString(), command)
		} catch (err) {
			console.error(err)
		}
	}
}

async function loadCtxCommands(){
	let commandFiles = readdirSync(`./src/ctx`)
	.filter(file => file.endsWith('.ts'));
	
	for (var commandFileName of commandFiles) {
		try {
			var commandImport = await import(`./ctx/${commandFileName.split(".")[0].toString()}`);
			var command:ContextMenuCommand = commandImport.default;
			await client.ctxCommands.set(command.commandName, command)
		} catch (err) {
			console.error(err)
		}
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
	console.log(`Supports: Interactions`)
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

//Code for interactions (Slash Commands, Buttons, CTX comamnds)
client.on("interactionCreate", interaction => {
	if(!interaction.channel){
		console.log(`MISSING INTERACTION.CHANNEL`, `Channel ID: ${interaction.channelId}`, `ID: ${interaction.id}`, `Guild ID: ${interaction.guildId}`, `User ID: ${interaction.member?.user.id}`);
		return;
	};
	console.log(interaction.member.user.id, interaction.member.roles)
	let isStaff = (interaction.member?.roles as GuildMemberRoleManager)?.cache?.find(role => config.staffRoles.includes(role.id));

	if(interaction.isMessageComponent() && interaction.customId.startsWith("collecter")) return;

	function logStaffCommands(interaction:Interaction, command?:Command){
		if(config.staffCommandLogging == false)
			return;
		let modLogEntries = [
			`:tools: Staff Command: <@${interaction.user.id}> | ${interaction.user.tag}`,
			`:label: User ID: ${interaction.user.id}`
		];
		if(interaction.isButton()){
			modLogEntries.push(`:keyboard: Command: ${interaction.customId}`);
			(interaction.guild.channels.cache.get(config.modLog) as TextChannel).send({
				content:modLogEntries.join("\n"),
				allowedMentions:{
					parse:[]
				}
			})
		}
		if(interaction.isCommand()){
			if(!command) return;
			modLogEntries.push(`:keyboard: Command: ${command.commandName}`);
			(interaction.guild.channels.cache.get(config.modLog) as TextChannel).send({
				content:modLogEntries.join("\n"),
				allowedMentions:{
					parse:[]
				}
			})
		}
		if(interaction.isContextMenu()){
			modLogEntries.push(`:keyboard: Command: ${interaction.commandName}`);
			(interaction.guild.channels.cache.get(config.modLog) as TextChannel).send({
				content:modLogEntries.join("\n"),
				allowedMentions:{
					parse:[]
				}
			})
		}
	}

	// Normal Slash Command
	if(interaction.isCommand() && !(interaction.options.getSubcommandGroup(false) || interaction.options.getSubcommand(false))){
		console.log(interaction)
		const command = client.commands.get(interaction.commandName);
	
		if (command) {
		
			try {
				if(command.staffOnly && !isStaff)
					return interaction.reply({
						content:`This is a staff only command.`,
						ephemeral:true
					})
				if(command.staffOnly){
					logStaffCommands(interaction, command)
				}
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

	// Slash Command with subcommand/subcommand groups
	if(interaction.isCommand() && (interaction.options.getSubcommandGroup(false) || interaction.options.getSubcommand(false))){
		let commandName = interaction.options.getSubcommand(false);
		let subCommandGroup = interaction.options.getSubcommandGroup(false) || interaction.commandName;

		const command = client.commands.find(command => command.subCommandGroup == subCommandGroup 
			&& command.commandName == commandName);

			console.log("cmd", command)
		if (command) {
		
			try {
				if(command.staffOnly && !isStaff)
					return interaction.reply({
						content:`This is a staff only command.`,
						ephemeral:true
					})
				if(command.staffOnly){
					logStaffCommands(interaction, command)
				}
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
		const command = client.buttonCommands.find(bc => bc.checkType == "STARTS_WITH" && interaction.customId.startsWith(bc.customId)) || client.buttonCommands.find(bc => bc.checkType == "EQUALS" && interaction.customId == bc.customId);
		if (command) {
		
			try {
				if(command.staffOnly && !isStaff)
					return interaction.reply({
						content:`This is a staff only command.`,
						ephemeral:true
					})
				if(command.staffOnly){
					logStaffCommands(interaction)
				}
				command.execute(interaction);
			} catch (error) {
				console.error(command.customId, error);
				interaction.reply({content:'Uh oh, something went wrong while running that command. Please open an issue on [GitHub](https://github.com/Team-Neptune/Korral-JS) if the issue persists.'});
			}
		} else {
			interaction.reply({
				content:`That button was not found.`,
				ephemeral:true
			})
		}
	}

	if(interaction.isContextMenu()){
		const command = client.ctxCommands.get(interaction.commandName);
		if (command) {
		
			try {
				if(command.staffOnly && !isStaff)
					return interaction.reply({
						content:`This is a staff only command.`,
						ephemeral:true
					})
				if(command.staffOnly){
					logStaffCommands(interaction)
				}
				command.execute(interaction);
			} catch (error) {
				console.error(command, error);
				interaction.reply({content:'Uh oh, something went wrong while running that command. Please open an issue on [GitHub](https://github.com/Team-Neptune/Korral-JS) if the issue persists.'});
			}
		} else {
			interaction.reply({
				content:`That Context Menu command was not found.`,
				ephemeral:true
			})
		}
	}
});

// // Support channel (Remove thread creation messages when thread is manually deleted)
client.on("threadDelete", async (thread) => {
	let supportThreadUserId = Object.keys(activeTickets).find(userId => activeTickets[userId].active == true && activeTickets[userId].threadChannelId == thread.id);
	if(!supportThreadUserId) return;
	client.closeSupportThread({
		userId:supportThreadUserId,
		noApi:true
	});
	let supportChannelMessages = await (client.channels.cache.get(config.supportChannelId) as TextChannel).messages.fetch();
	supportChannelMessages.find(message => message.thread?.id == activeTickets[supportThreadUserId].threadChannelId)?.delete();

})

function keepThreadsOpen(){
	(client.channels.cache.get(config.supportChannelId) as TextChannel).threads.fetchActive(true).then(({threads}) => {
		threads.each(channel => {
			if(publicThreads[channel.id] || privateThreads[channel.id]){
				let threadStarter = client.getSupportThreadData((publicThreads[channel.id] || privateThreads[channel.id]).ownerId);
				let closeTicketButton = new MessageButton()
				.setStyle("SECONDARY")
				.setCustomId(`close_ticket_${threadStarter.userId}`)
				.setLabel("Close Ticket")
				.setEmoji("🔒");
				channel.send({
					content:`<@${threadStarter.userId}>`,
					embeds:[
						{
							description:`Hey there! This message has been set to keep this ticket from closing automatically. If you have already resolved your issue/don't need support anymore, you can close it with the button below. Thanks!`
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

		console.log(message.content.includes("--"), (thisTicketAllowed.authorizedUsers.includes(message.author.id) || message.member.roles.cache.find(r => thisTicketAllowed.authorizedRoles.includes(r.id))), message.mentions.users.size > 0)

		if(!message.content.includes("--") && (thisTicketAllowed.authorizedUsers.includes(message.author.id) || message.member.roles.cache.find(r => thisTicketAllowed.authorizedRoles.includes(r.id))) && message.mentions.users.size > 0){
			message.mentions.users = message.mentions.users.filter(u => !privateThreads[message.channel.id].authorizedUsers.includes(u.id));
			if(message.mentions.users.size == 0) return;
			message.mentions.users.each(u => {
				if(!privateThreads[message.channel.id].authorizedUsers.includes(u.id)){
					privateThreads[message.channel.id].authorizedUsers.push(u.id);
				}
			})
			saveThreadsData()
			message.reply({
				embeds:[
					{
						description:`✅ Added ${message.mentions.users.map(u => `<@${u.id}>`).join(", ")} to this ticket.`,
						color:"GREEN"
					}
				]
			})
		}

		if(message.content.includes("--") && (thisTicketAllowed.authorizedUsers.includes(message.author.id) || message.member.roles.cache.find(r => thisTicketAllowed.authorizedRoles.includes(r.id))) && message.mentions.users.size > 0){
			console.log(message.mentions.users, "BEFORE")
			message.mentions.users = message.mentions.users.filter(u => privateThreads[message.channel.id].authorizedUsers.includes(u.id));
			console.log(message.mentions.users, "AFTER")
			if(message.mentions.users.size == 0) return;
			privateThreads[message.channel.id].authorizedUsers = privateThreads[message.channel.id].authorizedUsers.filter(authorizedUserId => !message.mentions.users.has(authorizedUserId));
			saveThreadsData()
			message.reply({
				embeds:[
					{
						description:`❌ Removed ${message.mentions.users.map(u => `<@${u.id}>`).join(", ")} from this ticket.`,
						color:"RED"
					}
				]
			})
		}
	}
})
// Welcome message
client.on("message", (message) => {
    if(message.type === "GUILD_MEMBER_JOIN")
        message.channel.send({
            content:`**o/** Welcome, <@${message.author.id}>!`,
            embeds:[
                {
                    description:`*Welcome to **${message.guild.name}***\n\nIf you come in need of support with anything Atmosphere/SDSetup/DeepSea related, you may go to <#${config.supportChannelId}> and open a ticket by pressing the **Open Ticket** button. We hope you enjoy your stay here!`
                }
            ]
        })
})

//Member join
client.on('guildMemberAdd', member => {
	if(config.userLogging == false)return;
	(member.guild.channels.cache.get(config.userLog) as TextChannel).send(`:white_check_mark: Join: <@${member.id}> | ${member.user.tag}\n:calendar_spiral: Creation: ${member.user.createdAt}\n:label: User ID: ${member.id}\n:hash: Server Member Count: ${member.guild.memberCount}`)
}
);

//Member leave
client.on('guildMemberRemove', async (member) => {
	let threadData = client.getSupportThreadData(member.id)
	if(threadData?.active){
		try {
			let threadChannel = member.client.channels.cache.get(threadData.threadChannelId) as ThreadChannel;
			await threadChannel.send({
				embeds:[
					new MessageEmbed({
						"description":`🔒 Ticket has been closed due to thread starter leaving the server.`,
						"color":16711680
					})
				]
			})
			await client.closeSupportThread({
				userId:threadData.userId,
				channelId:threadData.threadChannelId,
				noApi:false
			})
		} catch {}
	}
	if(config.userLogging == false)return;
	(client.channels.cache.get(config.userLog) as TextChannel).send(`:arrow_left: Leave: <@${member.id}> | ${member.user.tag}\n:label: User ID: ${member.id}\n:hash: Server Member Count: ${member.guild.memberCount}`)
});

//Log deleted messages
client.on('messageDelete', message => {
	if(message.author.id == client.user.id)return;
	if(config.modLogBlacklisted?.includes(message.channelId)) return;
	(message.guild.channels.cache.get(config.modLog) as TextChannel).send(`:wastebasket: **Message Delete**:\nfrom ${message.author.tag} (${message.author.id}) | in <#${message.channel.id}>:\n\`${message.content}\``)
});

//Log message edits
client.on('messageUpdate', (oldMessage, newMessage) => {
	if(oldMessage.author.id == client.user.id)return;
	if(config.modLogBlacklisted?.includes(newMessage.channelId)) return;
	if(oldMessage.author.id == newMessage.author.id && !newMessage.author.bot && oldMessage.content != newMessage.content)
		(newMessage.guild.channels.cache.get(config.modLog) as TextChannel).send(`:pencil: **Message Edit**:\nfrom ${newMessage.author.tag} (${newMessage.author.id}) | in <#${newMessage.channel.id}>:\n\`${oldMessage.content}\`\n → \n\`${newMessage.content}\``)
})

// Update the cached DeepSea release data
async function setupDeepsea() {
	var deepsea = new DeepSea()
	var res = await deepsea.update()
	console.log(`Cached DeepSea has been updated`)
}

// Update cached data every 60 minutes (1 Hour)
setInterval(() => {
	setupDeepsea()
}, 60 * 60 * 1000)

async function startBot(){
	await loadButtonCommands();
	await loadSlashCommands();
	await loadCtxCommands();
	await setupDeepsea();
	await client.login(config.token);
	if(!existsSync("./commands_setup.flag")){
		await setupApplicationCommands(config.testingGuildId || undefined)
		writeFileSync("./commands_setup.flag", "Commands successfully created")
	}
	console.log(`Statup functions have been executed!`)
}

startBot()