import Command from "../classes/Command";
import { readFileSync } from 'fs'
import { config } from "../../config";
import { GuildMemberRoleManager, TextChannel } from "discord.js";

export default new Command({
    commandName:"ban",
    staffOnly:true,
    subCommandGroup:"mod",
    async execute(interaction){
        if(!interaction.guild.me.permissions.has("BAN_MEMBERS"))
            return interaction.reply({
                content:`I don't have the valid permissions to ban a member.`,
                ephemeral:true
            })
        const user = interaction.options.getUser("user");
        const member = interaction.options.getMember("user");
        
        if(!user)
            return interaction.reply({
                content:"I'm sorry this user doesn't exist",
                ephemeral:true
            })
        
        
        if((member.roles as GuildMemberRoleManager)?.cache.find(r => config.staffRoles.includes(r.id)))
            return interaction.reply({
                content:`You can not perform this action on a moderator.`,
                ephemeral:true
            })
        const reason = interaction.options.getString("reason")
        
        var warnings = JSON.parse(readFileSync(config.warningJsonLocation).toString())
        var notes = JSON.parse(readFileSync(config.noteJsonLocation).toString())

        let randomChars = (Math.random() + 1).toString(36).substring(7).toString();
        
        interaction.reply({
            content:`Are you sure you want to ban **${user.tag} (${user.id})**?\n**Reason**: ${reason}`,
            embeds:[
                {
                    title:`User Log`,
                    description:`Warns: ${warnings[user.id]?.length || "0"}\nNotes: ${notes[user.id]?.length || "0"}`
                }
            ],
            components:[
                {
                    type:"ACTION_ROW",
                    components:[
                        {
                            type:"BUTTON",
                            label:`Cancel`,
                            style:"SECONDARY",
                            customId:`collecter_${randomChars}_cancel`
                        },
                        {
                            type:"BUTTON",
                            label:`Ban ${user.tag}`,
                            style:"DANGER",
                            customId:`collecter_${randomChars}_ban_${user.id}`
                        },
                    ]
                }
            ],
            ephemeral:true
        })
        
        let collector = interaction.channel.createMessageComponentCollector({
            componentType:"BUTTON",
            message:await interaction.fetchReply(),
            time:300000,
            max:1,
            filter(button){
                return button.user.id == interaction.user.id && button.customId.startsWith(`collecter_${randomChars}`)
            }
        })

        collector.on("end", async (collected) => {
            if(!collected.first()) return;
            if(collected.first().customId == `collecter_${randomChars}_ban_${user.id}`){
                const modLogEntries = [
                    `:no_entry: Ban: <@${interaction.user.id}> banned <@${user.id}> | ${user.tag}`,
                    `:label: User ID: ${user.id}`,
                    `:pencil2: Reason: "${reason}"`
                ]
                try {
                    await user.send(`You were banned from ${interaction.guild.name}. The given reason was: "${reason}"`)   
                } catch {}

                try {
                    await interaction.guild.members.ban(user, {
                        reason
                    });
                    collected.first().update({
                        content:`Successfully banned **${user.tag} (${user.id})**.\n**Reason**: ${reason}`,
                        components:[]
                    });
    
                    (interaction.guild.channels.cache.get(config.modLog) as TextChannel).send(modLogEntries.join("\n"))
                } catch {
                    return collected.first().update({
                        content:`Failed to ban **${user.tag} (${user.id})**.`,
                        components:[]
                    })
                }
            } else if(collected.first().customId == `collecter_${randomChars}_cancel`){
                collected.first().update({
                    content:`Aborted ban of **${user.tag} (${user.id})**.`,
                    components:[]
                })
            }
        })
    }
})