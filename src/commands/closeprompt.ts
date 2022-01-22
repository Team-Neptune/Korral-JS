import { GuildMemberRoleManager } from "discord.js";
import { config } from "../../config";
import Command from "../classes/Command";

export default new Command({
    commandName:"close",
    subCommandGroup:"tickets",
    execute(interaction){
        let user = interaction.options.getUser("user")
        let ticket = interaction.client.getSupportThreadData(user.id)
        if(!ticket)
            return interaction.reply({
                content:`Unable to find a ticket with that user`,
                ephemeral:true
            })
        let isStaff = (interaction.member.roles as GuildMemberRoleManager).cache.find(role => config.staffRoles.includes(role.id) || config.supportRoleId == role.id);
        if(!isStaff)
            return interaction.reply({
                content:`This is a staff only command.`,
                ephemeral:true
            })
        if(ticket.threadChannelId != interaction.channelId)
            return interaction.reply({
                content:`This command must be sent in the ticket channel`,
                ephemeral:true
            })
        interaction.reply({
            content:`Hey <@${user.id}>,\n\n<@${interaction.user.id}> has requested that this ticket be closed. If you're done with your question, you can close it with the button below. If you are not finished, please let us know so we don't close your ticket for inactivity.`,
            components:[
                {
                    type:"ACTION_ROW",
                    components:[
                        {
                            type:"BUTTON",
                            label:"Close Ticket",
                            style:"DANGER",
                            customId:`close_ticket_${user.id}`
                        }
                    ]
                }
            ]
        })
        
    }
})
