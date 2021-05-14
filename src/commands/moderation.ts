import {Command} from '../info'
import {config} from '../../config'
import { TextChannel, MessageEmbed } from 'discord.js'
export const moderationCommands:Array<Command> = [
    {
        name:"ban",
        description:"Ban a member from the server.",
        aliases:["banish"],
        usage:"<member mention> <reason>",
        staffOnly:true,
        execute(message, args){
            if(!message.guild.me.permissions.has("BAN_MEMBERS"))
                return message.channel.send(`I don't have the valid permissions to ban a member.`)
            const member = message.mentions.members.first()
            var removed = args.splice(0, 1)
            const reason = args.join(" ")
            
            const modLogEntries = [
                `:no_entry: Ban: <@${message.author.id}> banned <@${member.id}> | ${member.user.tag}`,
                `:label: User ID: ${member.user.id}`,
                `:pencil2: Reason: "${reason}"`
            ]
            
            member.send(`You were banned from ${message.guild.name}. The given reason was: "${reason}"`)
            .then(() => {
                message.mentions.members.first().ban({reason: `${message.author.tag}, ${reason}`});
                (message.guild.channels.cache.get(config.modLog) as TextChannel).send(modLogEntries.join("\n"))
            })
            .catch(() => {
                (message.guild.channels.cache.get(config.modLog) as TextChannel).send(modLogEntries.join("\n"))
            })
        }
    },
    {
        name: 'userlog',
        description: 'View the userlog of a user.',
        staffOnly: true,
        execute(message, args) {
            function returnResponse(reponse:string = "Something happened but no response was defined.") {
                message.channel.send(reponse);
            }
            if(!message.mentions.members.first())
                return message.channel.send(`You need to mention at least **one** member.`)
            // all requirements are met
            var warnings = require('../warnings.json')
            var notes = require('../userNotes.json')
    
            message.mentions.members.forEach(mentionedUser => {
                if (!warnings[mentionedUser.id] && !notes[mentionedUser.id])
                    return returnResponse(`${mentionedUser.user.tag} does not have any warnings or notes.`);
        
                const embed = new MessageEmbed()
                embed.setAuthor(mentionedUser.user.tag, mentionedUser.user.displayAvatarURL({dynamic:true}))
                if(warnings[mentionedUser.id]){
                    warnings[mentionedUser.id].forEach(function (warning, index) {
                        embed.addField('Warning: ' + (parseInt(index) + 1), warning)
                    });
                }
                if(notes[mentionedUser.id]){
                    notes[mentionedUser.id].forEach(function (warning, index) {
                        embed.addField('Note: ' + (parseInt(index) + 1), warning)
                    });
                }
                message.channel.send(embed)
            });
    
            delete require.cache[require.resolve(`../warnings.json`)]
            delete require.cache[require.resolve(`../userNotes.json`)]
        }
    }
]