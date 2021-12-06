import { GuildMemberRoleManager, MessageComponent } from "discord.js";
import { config } from "../../config";
import { TicketType } from "../../typings";
import ButtonCommand from "../classes/ButtonCommand";

export default new ButtonCommand({
    checkType:"STARTS_WITH",
    customId:"switch_ticket_type_",
    async execute(interaction){
        let userId = interaction.customId.split("switch_ticket_type_")[1];
        var threadData  = interaction.client.getSupportThreadData(userId);
        if(!threadData)
            return interaction.reply({
                content:`Unable to find that thread`,
                ephemeral:true
            })
        let isStaff = (interaction.member.roles as GuildMemberRoleManager).cache.find(role => config.staffRoles.includes(role.id) || config.supportRoleId == role.id);
        if(!isStaff)
            return interaction.reply({
                content:`This is a staff only command.`,
                ephemeral:true
            })
        let newType:TicketType;
        if(threadData.type == "PUBLIC")
            newType = "PRIVATE";
        if(threadData.type == "PRIVATE")
            newType = "PUBLIC";
        
        await interaction.deferUpdate()
        let res = await interaction.client.updateSupportThread({
            newType,
            userId:threadData.userId,
            threadId:threadData.threadChannelId
        })
        if(res === false){
            interaction.followUp({
                content:`Failed to update support thread data`,
                ephemeral:true
            })
        }
        if(res == true){
            interaction.editReply({
                content:interaction.message.content.replace(newType == "PUBLIC"?":lock: *This is a private ticket, so only staff may reply.*":":unlock: *This is a public ticket, everyone may view and reply to it..*", newType == "PRIVATE"?":lock: *This is a private ticket, so only staff may reply.*":":unlock: *This is a public ticket, everyone may view and reply to it..*"),
                components:[
                    {
                        "type":1,
                        "components":[
                          {
                            "type":2,
                            "style":2,
                            "customId":`close_ticket_${threadData.userId}`,
                            "label":"Close Ticket",
                            "emoji":"🔒"
                          },
                          {
                            "type":"BUTTON",
                            "style":"SECONDARY",
                            "customId":`switch_ticket_type_${threadData.userId}`,
                            "label":`Switch to ${newType == "PUBLIC" ? "Private" : "Public"} Ticket`
                          }
                        ]
                      }
                ]
            })
            interaction.followUp({
                embeds:[
                    {
                        description:`${newType == "PUBLIC" ? ":unlock:" : ":lock:"} Ticket has been switched to a ${newType == 'PUBLIC' ? "Public" : "Private"} Ticket.`,
                        color:newType == "PUBLIC" ? "GREEN" : "RED",
                        footer:{
                            iconURL:`https://cdn.discordapp.com/avatars/${interaction.member?.user.id}/${interaction.member?.user.avatar}${interaction.member?.user.avatar.startsWith("a_")?".gif":".png"}`,
                            text:`${interaction.member?.user.username}#${interaction.member?.user.discriminator}`
                        }
                    }
                ]
            })
        }
    }
})