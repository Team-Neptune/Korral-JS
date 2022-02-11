import { config } from "../../config";
import ButtonCommand from "../classes/ButtonCommand";

export default new ButtonCommand({
  customId:"open_ticket_prompt",
  checkType:"EQUALS",
  execute(interaction){
    let threadStarter = interaction.member.user.id;
    let currentThread = interaction.client.getSupportThreadData(threadStarter);
    if(currentThread?.active || false)
      return interaction.reply({
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
        ],
        ephemeral:true
      })
    if(config.openingTicketPrompt?.enabled){
      return interaction.reply({
        content:config.openingTicketPrompt.message,
        embeds:[
          {
            description:"To continue opening this ticket, press the *Proceed* button below.",
            color:"GREY"
          }
        ],
        components:[
          {
            type:"ACTION_ROW",
            components:[
              {
                type:"BUTTON",
                style:"SUCCESS",
                label:"Proceed",
                customId:"open_ticket"
              }
            ]
          }
        ],
        ephemeral:true
      })
    }
    // `config.openingTicketPrompt` disabled
    const command = interaction.client.buttonCommands.find(bc => bc.checkType == "STARTS_WITH" && "open_ticket".startsWith(bc.customId)) || interaction.client.buttonCommands.find(bc => bc.checkType == "EQUALS" && "open_ticket" == bc.customId);
    command?.execute(interaction);
  }
})