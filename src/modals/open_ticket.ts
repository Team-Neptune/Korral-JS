import { ThreadChannel } from "discord.js";
import { config } from "../../config";
import ModalCommand from "../classes/ModalCommand";
interface PromptedQuestion {
    question:string
    response:string
}

export default new ModalCommand({
    customId:"open_ticket_modal",
    staffOnly:false,
    async execute(interaction, client){
        console.log("INTERACTION_CREATE_open_ticket_modal", interaction)
        let threadStarter = interaction.member.user.id;
        let supportRoleOnly = false;
        let threadStarterMember = await client.guilds.cache.get(interaction.guild_id).members.fetch(threadStarter);

        client.createSupportThread({
            shortDesc:`${threadStarterMember.nickname || threadStarterMember.user.tag}`, 
            userId:threadStarter, 
            privateTicket:supportRoleOnly
        })
        .then(channel => {                
            const promptedQuestions = [
            `Firmware + Atmosphere / DeepSea version`,
            `Do you use Hekate or Fusee-Primary?`,
            `Do you have an error code/screen?`,
            `Coming for support with SDSetup or DeepSea?`,
            `Describe your issue and what led up to it`
            ];
            let questionResponses:PromptedQuestion[] = promptedQuestions.map((question, index) => {
                return {
                    question,
                    response:interaction.data.components[index]?.components[0]?.value || "Not provided"
                }
            });
            (client.channels.cache.get(channel.id) as ThreadChannel).send({
            "content":`${supportRoleOnly?"\n:lock: *This is a private ticket, so only staff may reply.*":"\n:unlock: *This is a public ticket, everyone may view and reply to it..*"}\n\nHey <@${threadStarter}>, <@&${config.supportRoleId}> will be with you as soon as they're able to. Here are the responses you gave in the prompt:\n\n${questionResponses.map(q => `**${q.question}:**\n${q.response}`).join("\n\n")}\n\n*(Disclaimer: You may not receive an answer instantly. Many of us have lives outside of Discord and will respond whenever we're able to, whenever that is.)*`,
            "components":[
                {
                    "type":1,
                    "components":[
                        {
                        "type":2,
                        "style":2,
                        "customId":`close_ticket_${threadStarter}`,
                        "label":"Close Ticket",
                        "emoji":"🔒"
                        },
                        {
                        "type":"BUTTON",
                        "style":"SECONDARY",
                        "customId":`staff_controls_${threadStarter}`,
                        "label":"Staff Controls",
                        "emoji":"🛠"
                        }
                    ]
                }
            ]
            }).then(async () => {
                await client.updateSupportThread({
                    threadId:channel.id,
                    userId:threadStarter
                });
                // @ts-ignore
                client.api.interactions(interaction.id)(interaction.token).callback.post({
                    data:{
                        type:4,
                        data:{
                            content:`Ticket is ready in <#${channel.id}>`,
                            flags:64
                        }
                    }
                })
            })
        })
    }
})