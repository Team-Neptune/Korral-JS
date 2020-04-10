module.exports = {
	name: 'updates',
	description: 'Checks for updates on the bot',
	execute(message, args) {
        if (message.author.bot) return;
        const Discord = require('discord.js');
		const client = new Discord.Client();
        const embed = new Discord.MessageEmbed()
        const fs = require('fs');
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
            message.channel.send(UpdateAvailableEmbed);
            }
                    try {
                        fs.unlinkSync(`./version.txt`)
                        fs.unlinkSync(`./changelog.txt`)
                          } catch(err) {
                        console.error(err)
              }
        })})})})
    }};