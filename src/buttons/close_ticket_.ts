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
        console.log(interaction.member.roles)
        if(currentUserId != ticketUserId && !(interaction.member.roles as GuildMemberRoleManager).cache.find(role => config.staffRoles.includes(role.id) || config.supportRoleId == role.id))
            return interaction.reply({
                content:`You can't close a ticket that isn't yours.`,
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
            if(config.ticketCloseMessage)
                embeds.push(new MessageEmbed({
                    "description":config.ticketCloseMessage,
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