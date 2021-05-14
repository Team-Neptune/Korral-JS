import {Command} from '../info'
import {config} from '../../config'
import { TextChannel, MessageEmbed } from 'discord.js'
import {writeFileSync, existsSync} from 'fs'
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
            if(!message.mentions.members.first())
                return message.channel.send(`You need to mention at least **one** member.`)
            // all requirements are met
            var warnings = require('.../warnings.json')
            var notes = require('../userNotes.json')
    
            message.mentions.members.forEach(mentionedUser => {
                if (!warnings[mentionedUser.id] && !notes[mentionedUser.id])
                    return message.channel.send(`${mentionedUser.user.tag} does not have any warnings or notes.`);
        
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
    
            delete require.cache[require.resolve(`.../warnings.json`)]
            delete require.cache[require.resolve(`../userNotes.json`)]
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
    
            if (!existsSync(`../warnings.json`)) {
                return message.channel.send(`'warnings.json' doesn't exist. Please do at least one warning to create the file.`)
            }
    
    
            if (!args[1])
                return message.channel.send(`Please choose a (or different) warning to delete.`);
    
            var warningNr = (args[1] as unknown as number)-1;
    
            // all requirements are met
    
            var userLog = require('.../warnings.json')
            if (!userLog[mentionedUser.id]) {
                message.channel.send(`This user has no warnings.`);
                return;
            }
    
    
            if (!userLog[mentionedUser.id][warningNr])
                return message.channel.send(`Warning doesn't exist.`)
    
    
            userLog[mentionedUser.id].splice(warningNr, 1); // remove the warning
            writeFileSync('../warnings.json', JSON.stringify(userLog))
    
            message.channel.send(`Warning removed.`);
            delete require.cache[require.resolve(`.../warnings.json`)]
        }
    },
    {
        name: 'note',
        description: 'Adds a note to a user.',
        usage: '<user> <note>',
        staffOnly: true,
        execute(message, args) {
            const mentionedUser = message.mentions.members.first();
            if(!mentionedUser)
                return message.channel.send(`No user was mentioned.`);
            
            if (!args[1])
                return message.channel.send(`Please provide a note.`)
            var removed = args.splice(0, 1)
            let reason = args.join(' ')
    
            // all requirements are met
            var notes = require('../userNotes.json')
    
            if (!notes[mentionedUser.id])
                notes[mentionedUser.id] = [];
    
            notes[mentionedUser.id].push(reason);
    
            writeFileSync('./userNotes.json', JSON.stringify(notes))
            message.channel.send(`<@${mentionedUser.id}> had a note added. User has ${notes[mentionedUser.id].length} note(s).`)
            delete require.cache[require.resolve(`.../warnings.json`)]
        }
    },
    {
        name: 'purge',
        description: 'Deletes multiple messages at once.',
        usage: '<amount>',
        cooldown: 0,
        staffOnly:true,
        execute(message, args) {
            if(!args[0])
                return message.channel.send(`Please provide the amount of messages to delete`)
            if((args[0] as unknown as number) >= 99)
                return message.channel.send(`You can only delete up to 99 messages.`)
            message.channel.bulkDelete((args[0] as unknown as number))
            .then(() => {
                message.channel.send(`Deleted ${args[0]} messages.`).then(m => {
                    setTimeout(() => {
                        m.delete()
                    }, 5000);
                })
                .catch(() => {
                    message.channel.send(`Failed to delete messages. They may be older than 20 days.`)
                })
            })
        },
    },
    {
        name: 'warn',
        description: 'Warns a user.',
        usage: '<user> <reason>',
        staffOnly: true,
        execute(message, args) {
            const mentionedUser = message.mentions.members.first()
            if(!mentionedUser)
                return message.channel.send(`Please mention a member.`)
    
            if (!existsSync(`../warnings.json`))
                return message.channel.send(`'warnings.json' doesn't exist. Please do at least one warning to create the file.`)
    
            if (!args[1])
                return message.channel.send(`Please set a warning.`)
            var removed = args.splice(0, 1)
            let reason = args.join(' ')
    
            // all requirements are met
    
            if (message.author.id == mentionedUser.id)
                return message.channel.send(`You can't perform this action on yourself.`);
    
            var warnings = require('.../warnings.json')
    
            if (mentionedUser.roles.cache.some(role => config.staffRoles.includes(role.id)))
                return message.channel.send(`You can't perform that action on this user.`);
    
            if (!warnings[mentionedUser.id])
                warnings[mentionedUser.id] = [];
    
            warnings[mentionedUser.id].push(reason);
    
            writeFileSync('../warnings.json', JSON.stringify(warnings))
            var eventMessage = `You were warned on ${message.guild.name}.\nThe given reason is: ${reason}\n\nPlease read the rules. This is warning #${(warnings[mentionedUser.id].length)}.`
            switch (warnings[mentionedUser.id].length) {
                case 1:
                    // only base message
                    mentionedUser.send(eventMessage);
                    break;
                case 2:
                    eventMessage = eventMessage + "\n\n __**The next warn will result in an automatic kick.**__";
                    mentionedUser.send(eventMessage)
                    break;
                case 3:
                    eventMessage = eventMessage + "\n\nYou were kicked because of this warning. You can rejoin right away, but two more warnings will result in an automatic ban.";
                    mentionedUser.send(eventMessage)
                    mentionedUser.kick(`Auto kick: ${reason}`)
                    break;
                case 4:
                    eventMessage = eventMessage + "\n\nYou were kicked because of this warning. You can rejoin right away, but two more warnings will result in an automatic ban.";
                    mentionedUser.send(eventMessage)
                    mentionedUser.kick(`Auto kick: ${reason}`)
                    break;
                case 5:
                    eventMessage = eventMessage + "\n\nYou were kicked because of this warning. You can rejoin right away, but **one more warning will result in an automatic ban.**";
                    mentionedUser.send(eventMessage)
                    mentionedUser.kick(`Auto kick: ${reason}`)
                    break;
                case 6:
                    eventMessage = eventMessage + "\n\nYou were banned because of this warning. This ban will not expire.";
                    mentionedUser.send(eventMessage)
                    mentionedUser.ban({ reason: `Auto ban: ${reason}` })
                    break;
                default:
                // code block
                // nothing will happen by default
            }


            message.channel.send(`<@${mentionedUser.id}> got warned. User has ${warnings[mentionedUser.id].length} warning(s).`);
            (message.guild.channels.cache.get(config.modLog) as TextChannel).send(`<@${message.author.id}> warned <@${mentionedUser.id}> (${mentionedUser.user.tag}) - warn #${warnings[mentionedUser.id].length}\n Reason: "${reason}"`)
            delete require.cache[require.resolve(`.../warnings.json`)]
    
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
            message.mentions.channels.first().send(text)
        }
    },
    {
        name: 'userinfo',
        description: 'Views info about the mentioned member(s).',
        staffOnly: true,
        execute(message, args) {
            if(!message.mentions.members.first())
                return message.channel.send(`Please mention a member.`)
            message.mentions.members.forEach(mentionedMember => {
                const embed = new MessageEmbed()
                embed.setDescription(`Username: ${mentionedMember.user.tag}\nID: ${mentionedMember.user.id}\nAvatar: [here](${mentionedMember.user.displayAvatarURL({dynamic:true})})\nBot: ${mentionedMember.user.bot}\nCreation: ${mentionedMember.user.createdAt}\nDisplay Name: ${mentionedMember.nickname || "None."}\nJoined: ${mentionedMember.joinedAt}\nHighest Role: ${mentionedMember.roles.highest || "None."}`)
                message.channel.send(embed)
            });
        }
    },
    {
        name: 'userlogid',
        description: 'Views the user warn log',
        staffOnly: true,
        execute(message, args) {
            if (message.mentions.members.first())
                return message.channel.send(`Please use userlog command instead.`);
    
            if (!existsSync(`../warnings.json`))
                return message.channel.send(`'warnings.json' doesn't exist. Please do at least one warning to create the file.`)
    
            // all requirements are met
            var warnings = require('.../warnings.json')
    
            if (!warnings[(args[0] as unknown as number)])
                return message.channel.send(`This user does not have any userlog entries`);
    
            const embed = new MessageEmbed()
            warnings[(args[0] as unknown as number)].forEach(function (warning, index) {
                embed.addField('Warning: ' + (parseInt(index) + 1), warning)
            });
            message.channel.send(embed)
    
            delete require.cache[require.resolve(`.../warnings.json`)]
        }
    }
]