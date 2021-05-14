import {MessageEmbed} from 'discord.js'
import {Command} from '../info'
import {writeFileSync, existsSync} from 'fs'
export const userCommands:Array<Command> = [
    {
        "name":"avatar",
        "description":"Grabs the current users avatar",
        staffOnly:false,
        execute(message, args){
            const member = message.mentions.members.first() || message.member
            const avatarEmbed = new MessageEmbed()
            .setColor(member.roles.highest?member.roles.highest.color:"")
            .setAuthor(member.user.tag)
            .setImage(member.user.displayAvatarURL({"size":4096, "dynamic":true}));
            message.channel.send(avatarEmbed)
        }
    },
    {
        name: 'clap',
        description: 'Has the bot speak with clap.',
        usage: '<text>',
        cooldown: 0,
        staffOnly:true,
        execute(message, args) {    
            const text = args.join(' 👏 ');
            message.channel.send(`**${message.author.tag}** `+'👏 '+text+' 👏')
            message.delete()
        }
    },
    {
        name: 'membercount',
        description: 'Counts the members in the current server',
        execute(message, args) {
            message.channel.send(`${message.guild.name} has ${message.guild.memberCount} members!`);
        },
        staffOnly:false
    },
    {
        name: 'source',
        description: 'Displays the source of the bot',
        staffOnly:false,
        execute(message, args) {
            message.channel.send(`You can find my source at https://github.com/Team-Neptune/Korral-JS. Serious PRs and issues welcome!`);
        },
    },
    {
        name: 'ping',
        description: 'Ping!',
        staffOnly:false,
        execute(message, args) {
            message.channel.send("Your ping is `" + `${Date.now() - message.createdTimestamp}` + " ms`");
        },
    }
]