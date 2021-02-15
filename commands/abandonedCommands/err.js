module.exports = {
    name: 'err',
    description: 'Error lookup using BETCH',
    execute(message, args) {
        const { MessageEmbed } = require('discord.js');
        const Discord = require('discord.js');
        var ErrorName = message.content.split(' ')[1];
        const ErrorSearch = message.content.replace('-', ' ').split(' ')[2]
        const ErrorSection = ErrorName.slice(0, -8)
        var request = require('request');
        console.log(`Attempting to connect to: http://err.teamatlasnx.com/api/betch/${ErrorSection}/${ErrorSearch}`)
        request({url: `http://err.teamatlasnx.com/api/betch/${ErrorSection}/${ErrorSearch}`, json: true}, function(err, res, json) {

            if(err){
                console.log(err)
            }
            console.log(json)
    	    const ErrorLookupEmbed = new Discord.MessageEmbed()
            ErrorLookupEmbed.setDescription(json["description_str"])
            message.channel.send(ErrorLookupEmbed)
        })
    },
};