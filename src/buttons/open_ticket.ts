import { ThreadChannel } from "discord.js";
import { config } from "../../config";
import ButtonCommand from "../classes/ButtonCommand";

export default new ButtonCommand({
  customId:"open_ticket",
  checkType:"EQUALS",
  execute(interaction){
    let threadStarter = interaction.member.user.id
    let supportRoleOnly = false;
    let topic = {
      value:`${interaction.member.user.username}#${interaction.member.user.discriminator}`
    }
    if(topic.value.length > 90 || topic.value.length < 1)
      return interaction.reply({
        content:`Topic must be 1-90 characters`,
        ephemeral:true
      })
    interaction.deferReply({ephemeral:true}).then(() => {
      let currentThread = interaction.client.getSupportThreadData(threadStarter);
      if(currentThread?.active || false)
        return interaction.followUp({
          content:`You already have a ticket opened. Please use your current ticket or close your current ticket to open a new one.`,
          components:[
            {
              type:"ACTION_ROW",
              components:[
                {
                  type:"BUTTON",
                  label:"View Current Ticket",
                  style:"LINK",
                  url:`https://discord.com/channels/${interaction.guildId}/${currentThread?.threadChannelId}`
                },
                {
                  type:"BUTTON",
                  label:"Close Current Ticket",
                  style:"DANGER",
                  customId:`close_ticket_${threadStarter}`
                }
              ]
            }
          ]
        })
      interaction.client.createSupportThread({
        shortDesc:topic.value.toString(), 
        userId:threadStarter, 
        privateTicket: supportRoleOnly
      })
      .then(channel => {                
        const questions = [
          `- Firmware and CFW / Atmosphere / DeepSea version`,
          `- Do you use hekate or fusee-primary?`,
          `- If you have an error screen with ID or code, what does it say? A screenshot/picture could be helpful.`,
          `- What, if anything, have you tried to fix the issue?`,
          `- Are you coming for support with SDSetup or DeepSea?`
        ];
        (interaction.client.channels.cache.get(channel.id) as ThreadChannel).send({
          "content":`${supportRoleOnly?"\n:lock: *This is a private ticket, so only staff may reply.*":"\n:unlock: *This is a public ticket, everyone may view and reply to it..*"}\n\nHey <@${threadStarter}>, to make it easier for us and others help you with your issue, please tell us a few things about your setup, like:\n\n${questions.join("\n")}`
        }).then(r => {
          r.channel.awaitMessages({
            max:1,
            filter(message){
              return message.author.id == threadStarter;
            }
          }).then(() => {
            (interaction.client.channels.cache.get(channel.id) as ThreadChannel).send({
              "content":`Thanks! <@&${config.supportRoleId}> will be here to support you shortly.\n\n*(Disclaimer: You may not receive an answer instantly. Many of us have lives outside of Discord and will respond whenever we're able to, whenever that is.)*`,
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
            })
          })
          interaction.followUp({
            content:`Ticket is ready in <#${channel.id}>`,
            ephemeral:true
          })
        })
      })
    })
  }
})