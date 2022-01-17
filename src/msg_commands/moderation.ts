import {config} from '../../config'
import { TextChannel, MessageEmbed } from 'discord.js'
import {writeFileSync, existsSync} from 'fs'
import { MessageCommand } from '../../typings'
export const moderationCommands:MessageCommand[] = [
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
            if(!member)
                return message.reply({
                    content:"I'm sorry this user doesn't exist"
                })
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
        name: 'kick',
        description: 'Kicks a user from the server.',
        aliases: ['boot'],
        usage: '<user> <reason>',
        staffOnly:true,
        execute(message, args) {
            const mentionedMember = message.mentions.members.first();
                
            if (message.author.id == mentionedMember.id){
                message.channel.send(`You can't perform this action on yourself.`);
                return;
            }
            if (mentionedMember.roles.cache.some(role => role.id === `${config.staffRoles}`)){
                message.channel.send(`You can't perform that action on this user.`);
                return;
            }

            // Code hopefully works
            var remove = args.splice(0, 1)
            const reason = args.join(' ')

            message.channel.send('<@'+mentionedMember.id+'> was kicked from the server.');
            (message.guild.channels.cache.get(config.modLog) as TextChannel).send(`:boot: Kick: <@${message.author.id}> kicked <@${mentionedMember.id}> | ${mentionedMember.user.tag}\n:label: User ID: ${mentionedMember.id}\n:pencil2: Reason: "${reason}"`)
            mentionedMember.send(`You have been kicked from the server. You may rejoin at anytime.\n\nReason for kick: ${reason}`)
            mentionedMember.kick(reason)
        }
    },
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
        name: 'purge',
        description: 'Deletes multiple messages at once.',
        usage: '<amount>',
        cooldown: 0,
        staffOnly:true,
        execute(message, args) {
            let deleteNum = Number(args[0]);
            if(!args[0])
                return message.channel.send(`Please provide the amount of messages to delete`);
            if(deleteNum > 99)
                return message.channel.send(`You can only delete up to 99 messages.`);
            message.delete()
            .then(() => {
                (message.channel as TextChannel)
                .bulkDelete(deleteNum)
                .then(() => {
                    message.channel.send(`Deleted ${deleteNum.toString()} messages.`)
                    .then(m => {
                        setTimeout(() => {
                            m.delete();
                        }, 5000);
                    })
                    .catch(console.error)
                })
                .catch(() => {
                    message.channel.send(`Failed to delete messages. They may be older than 20 days.`)
                })
            })
            .catch(console.error)
        },
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
    },
    {
        name: 'echo',
        description: 'Has the bot speak in another channel.',
        usage: '<channel> <text>',
        cooldown: 0,
        staffOnly:true,
        execute(message, args) {          
            if(!message.mentions.channels.first())
                return message.channel.send('Please mention a channel.')
            var removed = args.splice(0, 1)
            let text = args.join(' ');
            (message.mentions.channels.first() as TextChannel).send(text)
        }
    },
    {
        name: 'userlogid',
        description: 'Views the user warn log',
        staffOnly: true,
        execute(message, args) {
            if (message.mentions.members.first())
                return message.channel.send(`Please use userlog command instead.`);
    
            if (!existsSync(`./warnings.json`))
                return message.channel.send(`'warnings.json' doesn't exist. Please do at least one warning to create the file.`)
    
            // all requirements are met
            var warnings = require('../../warnings.json')
    
            if (!warnings[(args[0] as unknown as number)])
                return message.channel.send(`This user does not have any userlog entries`);
    
            const embed = new MessageEmbed()
            warnings[(args[0] as unknown as number)].forEach(function (warning, index) {
                embed.addField('Warning: ' + (parseInt(index) + 1), warning)
            });
            message.channel.send({embeds:[embed]})
    
            delete require.cache[require.resolve(`../../warnings.json`)]
        }
    }
]