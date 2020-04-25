const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const { MessageEmbed } = require('discord.js');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const {prefix, token, SetStatusCommand} = require ('./config.json');
const {BotLog, MessageLog, RequirePermissions, ModLog} = require('./info.json');
const {BootSuccessful} = require('./strings.json');
global.version = '1.0.0'


//Bootup check
client.once('ready', () => {
	client.emit('CheckForNewDay')
	console.log('Ready!');
	console.log('Version: '+version)
	var today = new Date();
	var date = today.getMonth()+1+'-'+(today.getDate())+'-'+today.getFullYear();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	global.dateTime = date+' '+time;
		const StartupEmbed = new Discord.MessageEmbed()
			.setColor('#00FF00')
			.setTitle('Bot Started')
			.setDescription(`${BootSuccessful}`)
			.addFields(
				{ name: 'Current date/time: ', value: dateTime, inline: true },
					)
			.setTimestamp()
			.setFooter('Komet-JS | Version '+version)
		global.modlog = client.channels.cache.get(`${BotLog}`);
		modlog.send(StartupEmbed);
				//Check for updates
				const https = require('https');
				const file = fs.createWriteStream("version.txt"); 
				const request = https.get("https://hax4dazy.github.io/Komet-JS/version/latestversion.txt", function(response) {
				response.pipe(file);
				const changedfile = fs.createWriteStream("changelog.txt"); 
				const changedrequest = https.get("https://hax4dazy.github.io/Komet-JS/version/changelog.txt", function(changedresponse) {
				changedresponse.pipe(changedfile);
				fs.readFile('./changelog.txt', function(err, data){
				const changelog = data.toString()
				fs.readFile('./version.txt', function(err, data){
					const latestversion = data.toString().replace(/[\r\n]+/g, '');
				 	if(version != latestversion){
					const UpdateAvailableEmbed = new Discord.MessageEmbed()
					.setTitle('Update Available')
					.setColor('ffa500')
					.setDescription(`An update is available.\nLatest version: ${latestversion}\nYour version: ${version}`)
					.addField('Changelog',changelog,false)
					.setTimestamp()
					.setFooter('Komet-JS | Version '+version)
					modlog.send(UpdateAvailableEmbed);
					}
							try {
								fs.unlinkSync(`./version.txt`)
								fs.unlinkSync(`./changelog.txt`)
					  			} catch(err) {
								console.error(err)
					  }
				})})})})
									 
});


process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

//Error
client.on('error', error => {
	console.error('an error has occured', error);

});

//Sets bot status
client.on('message', message => {
	if (message.author.bot)return;
	if (!message.content.startsWith(`${prefix}${SetStatusCommand}`))return;
	if (message.channel.type == 'dm')return;
	if(RequirePermissonsToUseDmCommand == true){
	if (message.member.roles.cache.some(role => role.id === `${StaffRoleID}`)){}else{message.reply(nopermreply);return;}}
	const args = message.content.slice((prefix+SetStatusCommand).length).split(/ +/);
	const activity = args.join(' ')
	client.user.setActivity(activity, { type: 'WATCHING' });
	fs.writeFileSync('./statusmessage.config', activity, 'utf-8');
	message.channel.send('Bot activity set to `WATCHING '+activity+'`.')
})

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
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

//Member join
client.on('guildMemberAdd', member => {
	var today = new Date();
	var date = today.getMonth()+1+'-'+(today.getDate())+'-'+today.getFullYear();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	global.dateTime = date+' '+time;
	const channel = member.guild.channels.cache.find(ch => ch.id === `${ModLog}`);
	const guild = member.guild
	if (!channel) return;
	const MemberJoinEmbed = new Discord.MessageEmbed()
	.setColor('#00FF00')
	.setTitle('Member Join')
	.addFields(
		{ name: 'Username', value: member.user.tag, inline: false },
		{ name: 'Member ID', value: member.id, inline: false },
		{ name: 'Account creation date', value: member.user.createdAt, inline: false },
		{ name: 'Server join date', value: dateTime, inline: false },
		{ name: 'Server member count', value: `${guild.memberCount}`, inline: false },
	)
	.setTimestamp()
	channel.send(MemberJoinEmbed)
	}
);

//Member leave
client.on('guildMemberRemove', member => {
	var today = new Date();
	var date = today.getMonth()+1+'-'+(today.getDate())+'-'+today.getFullYear();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	global.dateTime = date+' '+time;
	const channel = member.guild.channels.cache.find(ch => ch.id === `${ModLog}`);
	const guild = member.guild
	if (!channel) return;
	const MemberLeaveEmbed = new Discord.MessageEmbed()
	.setColor('#ff0000')
	.setTitle('Member Leave')
	.addFields(
		{ name: 'Username', value: member.user.tag, inline: false },
		{ name: 'Member ID', value: member.user.id, inline: false },
		{ name: 'Account creation date', value: member.user.createdAt, inline: false },
		{ name: 'Server leave date', value: dateTime, inline: false },
		{ name: 'Server member count', value: `${guild.memberCount}`, inline: false },
	)
	.setTimestamp()
	channel.send(MemberLeaveEmbed)
});

//Log deleted messages
client.on('messageDelete', async message => {
	const fetchedLogs = await message.guild.fetchAuditLogs({
		limit: 1,
		type: 'MESSAGE_DELETE',
	});
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
	const channel = client.channels.cache.get(`${ModLog}`);
	channel.send(DeletionEmbed)}

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
		const channel = client.channels.cache.get(`${ModLog}`);
		channel.send(DeletionEmbed)
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
		const channel = client.channels.cache.get(`${ModLog}`);
		channel.send(DeletionEmbed)
		return;
	}
});

