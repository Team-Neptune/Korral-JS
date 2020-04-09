const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const { MessageEmbed } = require('discord.js');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
global.version = '1.0.0'

const {	prefix, 
	Token,
	SetStatusCommand,
} = require('./config.json');

const { BotLog, 
	MessageLog, 
	RequirePermissons, 
	StaffRoleID,
} = require('./info.json');

const { NoPermReply, 
	BootSuccessful
} = require('./strings.json');

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
				const request = https.get("https://raw.githubusercontent.com/hax4dazy/Komet-JS/master/version/latestversion.txt?token=AD4A7UU4PQGTAPHLXGRGAYC6TB27I", function(response) {
				response.pipe(file);
				const changedfile = fs.createWriteStream("changelog.txt"); 
				const changedrequest = https.get("https://raw.githubusercontent.com/hax4dazy/Komet-JS/master/version/changelog.txt?token=AD4A7UT4G7FIZEOEZCER5DC6TB3BC", function(changedresponse) {
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
client.login(Token);

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