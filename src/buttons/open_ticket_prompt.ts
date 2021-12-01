import { config } from "../../config";
import ButtonCommand from "../classes/ButtonCommand";

export default new ButtonCommand({
  customId:"open_ticket_prompt",
  checkType:"EQUALS",
  execute(interaction){
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