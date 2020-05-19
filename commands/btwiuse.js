module.exports = {
	name: 'btwiuse',
	description: 'Displays info of the bot',
	execute(message, args) {
        const Discord = require('discord.js');
		const client = new Discord.Client();
		if (message.author.bot) return;
		const { exec } = require("child_process");
		//Check for Windows I guess
        exec("ver", (error, stdout, stderr) => {
			if(!stderr){
				 os = stdout
				exec("node -v", (error, stdout, stderr) => {
					if(!stderr)nodeVersion = stdout
					infoAboutSystem(os, nodeVersion)
			})
		}else{
			exec("uname -srvo", (error, stdout, stderr) => {
				 os = stdout
				exec("node -v", (error, stdout, stderr) => {
					if(!stderr) nodeVersion = stdout
					infoAboutSystem(os, nodeVersion)
			})
			})
		}
	})
		function infoAboutSystem(os, nodeVersion){message.channel.send(`BTW I use Node ${nodeVersion} on ${os}`);}
	},
};