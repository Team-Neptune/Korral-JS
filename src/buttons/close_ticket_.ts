import { GuildMemberRoleManager, MessageEmbed, ThreadChannel } from "discord.js";
import { config } from "../../config";
import ButtonCommand from "../classes/ButtonCommand";

const userPingReplaceRegExp = new RegExp(/\!{(USER_PING)\}!/, "g");

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
        let isStaff = (interaction.member.roles as GuildMemberRoleManager).cache.find(role => config.staffRoles.includes(role.id) || config.supportRoleId == role.id);
        console.log(interaction.member.roles)
        if(currentUserId != ticketUserId && !isStaff)
            return interaction.reply({
                content:`You can't close a ticket that isn't yours.`,
                ephemeral:true
            })
        if(config.closingTicketsSettings?.ticketsMinimumAge > secondsSinceCreation && !isStaff)
            return interaction.reply({
                content:`Sorry, this ticket has to remain open for **${remainingTime > 60? Math.floor(remainingTime / 60) : Math.floor(remainingTime)}** more ${remainingTime > 60 ? `minute${Math.floor(remainingTime / 60) == 1 ? `` : `s`}` : `second${Math.floor(remainingTime) <= 1 ? `` : `s`}`} before it can be closed.`,
                ephemeral:true
            })
        if(supportThread.locked && supportThread.locked != interaction.user.id && !(currentUserId == supportThread.userId))
            return interaction.reply({
                content:`This ticket's management has been restricted to <@${supportThread.locked}>. Please contact them to perform this action.`,
                ephemeral:true
            })
        
        if(config.closingTicketsSettings?.incomingFeedbackChannel && currentUserId === supportThread.userId){
            // @ts-ignore
            interaction.client.api.interactions(interaction.id)(interaction.token).callback.post({
                data:{
                type: 9,
                data: {
                    components: [
                        {
                            type: 1,
                            components:[
                                {
                                    type: 4,
                                    custom_id: 'feedback_content',
                                    style: 2,
                                    label: 'How was your experience in the ticket?',
                                    placeholder: 'This is shared with the server admin',
                                    min_length:10,
                                    required:false
                                }
                            ]
                        }
                    ],
                    title: 'Ticket Feedback',
                    custom_id: 'closed_ticket_feedback'
                    }
                }
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
                        "description":config.closingTicketsSettings.closeMessage.replace(userPingReplaceRegExp, `<@${ticketUserId}>`),
                        "footer":{
                            text:"The message above is set by the server"
                        }
                    }));
    
                let threadChannel = interaction.client.channels.cache.get(threadChannelId) as ThreadChannel;
                threadChannel?.send({
                    embeds
                })
                return interaction.client.closeSupportThread({
                    userId:ticketUserId,
                    channelId:threadChannelId,
                    noApi:threadChannel?false:true
    
                }).catch(console.error)
            })
        }
    }
})