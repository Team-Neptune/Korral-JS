import { GuildMemberRoleManager, MessageEmbed, TextChannel } from "discord.js";
import { config } from "../../config";
import ButtonCommand from "../classes/ButtonCommand";

export default new ButtonCommand({
    customId:"close_ticket",
    checkType:"STARTS_WITH",
    async execute(interaction){
        let ticketUserId = interaction.customId.split("close_ticket_")[1];
        let supportThread = interaction.client.getSupportThreadData(ticketUserId)
        let currentUserId = interaction.member.user.id;
        let threadChannelId = supportThread.threadChannelId;
        var secondsSinceCreation = (Date.now() - supportThread.createdMs) / 1000;
        var remainingTime = config.closingTicketsSettings?.ticketsMinimumAge - secondsSinceCreation;
        console.log(interaction.member.roles)
        if(currentUserId != ticketUserId && !(interaction.member.roles as GuildMemberRoleManager).cache.find(role => config.staffRoles.includes(role.id) || config.supportRoleId == role.id))
            return interaction.reply({
                content:`You can't close a ticket that isn't yours.`,
                ephemeral:true
            })
        if(config.closingTicketsSettings?.ticketsMinimumAge > secondsSinceCreation && !(interaction.member.roles as GuildMemberRoleManager).cache.find(role => config.staffRoles.includes(role.id) || config.supportRoleId == role.id))
            return interaction.reply({
                content:`Sorry, this ticket has to remain open for **${remainingTime > 60? Math.floor(remainingTime / 60) : Math.floor(remainingTime)}** more ${remainingTime > 60 ? `minute${Math.floor(remainingTime / 60) == 1 ? `` : `s`}` : `second${Math.floor(remainingTime) <= 1 ? `` : `s`}`} before it can be closed.`,
                ephemeral:true
            })
        interaction.reply({
            content:`<#${threadChannelId}> will be locked soon.`,
            ephemeral:true
        })
        .then(() => {
            let embeds:MessageEmbed[] = [
                new MessageEmbed(                {
                    "description":`🔒 Ticket has been closed by <@${currentUserId}>`,
                    "color":16711680
                })
            ];
            if(config.closingTicketsSettings?.closeMessage)
                embeds.push(new MessageEmbed({
                    "description":config.closingTicketsSettings.closeMessage,
                    "footer":{
                        text:"The message above is set by the server"
                    }
                }));
            (interaction.client.channels.cache.get(threadChannelId) as TextChannel).send({
                embeds
            })
            .then(() => {
                return interaction.client.closeSupportThread({
                    userId:ticketUserId,
                    channelId:threadChannelId
                })
            })
        })
    }
})