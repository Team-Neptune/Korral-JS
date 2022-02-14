import { config } from "../../config";
import ModalCommand from "../classes/ModalCommand";

export default new ModalCommand({
    customId:"closed_ticket_feedback",
    async execute(interaction, client){
        let feedbackContent:string = interaction.data.components[0]?.components[0]?.value;
        let supportThreadData = client.getSupportThreadData(interaction.member?.user.id || interaction.user.id);
        console.log(interaction.data.components)
        // @ts-ignore
        client.api.interactions(interaction.id)(interaction.token).callback.post({
            data:{
                type:6
            } 
        })
        if(!config.closingTicketsSettings?.incomingFeedbackChannel) return;
        if(!feedbackContent || feedbackContent?.trim() === '') return;
        let feedbackChannel = client.channels.cache.get(config.closingTicketsSettings?.incomingFeedbackChannel);
        let ticketChannel = await client.channels.fetch(supportThreadData.threadChannelId);
        if(feedbackChannel?.isText() && ticketChannel?.isThread()){
            feedbackChannel.send({
                embeds:[
                    {
                        title:"Ticket Feedback",
                        description:feedbackContent || "*No response given*",
                        fields:[
                            {
                                name:`Ticket`,
                                value:`[${ticketChannel.name}](https://discord.com/channels/${ticketChannel.guildId}/${ticketChannel.id}) (${supportThreadData.threadChannelId})`,
                                inline:true
                            },
                            {
                                name:`User`,
                                value:`<@${supportThreadData.userId}> (${supportThreadData.userId})`,
                                inline:true
                            }
                        ]
                    }
                ]
            })
        }
    }
})