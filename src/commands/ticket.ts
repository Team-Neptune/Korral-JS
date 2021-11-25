import { TextChannel, ThreadChannel } from "discord.js";
import { config } from "../../config";
import Command from "../classes/Command";

export default new Command({
    execute(interaction){
        // 1-90 char only
        let topic = interaction.options.data.find(o => o.name == "topic");
        let supportRoleOnly = interaction.options.data.find(o => o.name == "private")?.value == true  || false;
        let threadStarter = interaction.member.user.id;
        if(topic.value.toString().length > 90 || topic.value.toString().length < 1)
            return interaction.reply({
                content:`Topic must be 1-90 characters`,
                ephemeral:true
            })
        interaction.deferReply({
            "ephemeral":true
        }).then(() => {
            interaction.client.createSupportThread(topic.value.toString(), threadStarter, supportRoleOnly)
            .then(channel => {                
                const questions = [
                    `- Firmware and CFW / Atmosphere / DeepSea version`,
                    `- Do you use hekate or fusee-primary?`,
                    `- If you have an error screen with ID or code, what does it say? A screenshot/picture could be helpful.`,
                    `- What, if anything, have you tried to fix the issue?`,
                    `- Are you coming for support with SDSetup or DeepSea?`
                ];
                (interaction.client.channels.cache.get(channel.id) as ThreadChannel).send({
                    "content":`Hey <@${threadStarter}>,\n<@&${config.supportRoleId}> will be here to support you shortly. In the meantime, to make it easier for us and others help you with your issue, please tell us a few things about your setup, like:\n\n${questions.join("\n")}\n\n*(Disclaimer: You may not receive an answer instantly. Many of us have lives outside of Discord and will respond whenever we're able to, whenever that is.)*\n${supportRoleOnly?"\n:lock: *This is a private ticket, so only staff may reply.*":"\n:unlock: *This is a public ticket, everyone may view and reply to it..*"}`,
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
                                }
                            ]
                        }
                    ]
                }).then(r => {
                    interaction.followUp({
                        content:`Ticket is ready in <#${channel.id}>`,
                        ephemeral:true
                    })
                })
            })
            .catch(err => {
                if(typeof err == "string")
                  interaction.followUp({
                      content:err,
                      ephemeral:true
                  })
            })
        })
    }
})