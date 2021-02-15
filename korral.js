console.log('Loading, please wait a moment.')

config = require('./storage/config.json')
fs = require('fs')
fetch = require("node-fetch");
Discord = require('discord.js');
client = new Discord.Client();
client.commands = new Discord.Collection();
client.tempStorage = {};


commandFiles = fs.readdirSync('./commands/enabled').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/enabled/${file}`);
	client.commands.set(command.name, command);
}

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

client.once('ready', () => {
	console.log('Ready!');
});

client.once('reconnecting', () => {
	console.log('Reconnecting!');
});

client.once('disconnect', () => {
	console.log('Disconnect!');
});


client.on('message', message => {

	if (message.author.bot) return;
	if (message.content.startsWith(config.bot.prefix)){
		let args = message.content.slice(config.bot.prefix.length).split(/ +/);
		let commandName = args.shift().toLowerCase();
		let command = client.commands.get(commandName);
		try {
			command.execute(message, args, client);
		} catch (error) {
			message.channel.send('There was an error trying to execute that command!');
		}
	} else { // this is for autoresponses by a bot on a given message
		let args = message.content.split(/ +/);
		try {
			let command = client.commands.get("autoresponse")
			command.execute(message, args, client);
		} catch (error) {
			console.log("autoresponse error")
		}
	}
});

client.login(config.bot.token)
	.then(function () {
		console.log("Authentication Complete!");
	})
	.catch(function (err) {
		console.log('Authentication Failed!'.red);
		console.log("Error During Authentication!" + " ~ " + JSON.stringify(err));
		client.destroy()
			.then(() => {
				process.exit();
			});
	});