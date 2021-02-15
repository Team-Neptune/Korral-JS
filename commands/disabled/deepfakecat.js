module.exports = {
name: 'deepfakecat',
description: 'Displays an image of a deep faked fox',
execute(message, args) {
    const Discord = require('discord.js');
    const client = new Discord.Client();
    if (message.author.bot) return;
    var request = require('request');

    request({url: 'https://api.thecatapi.com/v1/images/search?&page=10&order=Desc', json: true}, function(err, res, json) {
      if (err) {
        throw err;
      }
      const newJSON = JSON.stringify(json)
      newJSON.replace('[', '')
      newJSON.replace(']', '')
      console.log(json);
      console.log(newJSON);
const exampleEmbed = new Discord.MessageEmbed()
.setTitle('Deep faked cat')
.setImage(newJSON["url"])
.setTimestamp()
message.channel.send(exampleEmbed)

})
}};