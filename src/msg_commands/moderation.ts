import {config} from '../../config'
import { TextChannel, MessageEmbed } from 'discord.js'
import {writeFileSync, existsSync} from 'fs'
import { MessageCommand } from '../../typings'
export const moderationCommands:MessageCommand[] = [
    {
        name: 'deletewarn',
        aliases: ['delwarn'],
        description: 'Deletes a warning',
        staffOnly: true,
        execute(message, args) {
            const mentionedUser = message.mentions.members.first()
            if(!mentionedUser)
                return message.channel.send(`No user was mentioned.`);
    
            if (!existsSync(`./warnings.json`)) {
                return message.channel.send(`'warnings.json' doesn't exist. Please do at least one warning to create the file.`)
            }
    
    
            if (!args[1])
                return message.channel.send(`Please choose a (or different) warning to delete.`);
    
            var warningNr = (args[1] as unknown as number)-1;
    
            // all requirements are met
    
            var userLog = require('../../warnings.json')
            if (!userLog[mentionedUser.id]) {
                message.channel.send(`This user has no warnings.`);
                return;
            }
    
    
            if (!userLog[mentionedUser.id][warningNr])
                return message.channel.send(`Warning doesn't exist.`)
    
    
            userLog[mentionedUser.id].splice(warningNr, 1); // remove the warning
            writeFileSync('./warnings.json', JSON.stringify(userLog))
    
            message.channel.send(`Warning removed.`);
        }
    },
    {
        name: 'say',
        description: 'Has the bot speak in the channel it is ran in.',
        usage: '<text>',
        cooldown: 0,
        staffOnly:true,
        execute(message, args) {	
          message.delete()
          message.channel.send(args.join(" "))
        }
    }
]