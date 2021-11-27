import { TextChannel } from "discord.js";
import { config } from "../../config";
import ButtonCommand from "../classes/ButtonCommand";

export default new ButtonCommand({
    customId:"close_ticket",
    checkType:"STARTS_WITH",
    execute(interaction){
        let ticketUserId = interaction.customId.split("close_ticket_")[1];
        let supportThread = interaction.client.getSupportThreadData(ticketUserId)
        let currentUserId = interaction.member.user.id;
        let threadChannelId = supportThread.threadChannelId;
        if(currentUserId != ticketUserId && (interaction.member.roles as string[])?.find(roleId => config.staffRoles.includes(roleId) || config.supportRoleId == roleId))
            return interaction.reply({
                content:`You can't close a ticket that isn't yours.`,
                ephemeral:true
            })
        interaction.reply({
            content:`<#${threadChannelId}> will be locked soon.`,
            ephemeral:true
        })
        .then(() => {
            (interaction.client.channels.cache.get(threadChannelId) as TextChannel).send({
                embeds:[
                    {
                        "description":`🔒 Ticket has been closed by <@${currentUserId}>`,
                        "color":16711680
                    }
                ]
            })
            .then(() => {
                return interaction.client.closeSupportThread(ticketUserId)
            })
        })
    }
})