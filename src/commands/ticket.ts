import { TextChannel, ThreadChannel } from "discord.js";
import { config } from "../../config";
import Command from "../classes/Command";

export default new Command({
  commandName:"create",
  subCommandGroup:"tickets",
    execute(interaction){
      // 1-90 char only
      let supportRoleOnly = interaction.options.data.find(o => o.name == "private")?.value == true  || false;
      let threadStarter = interaction.member.user.id;
      let topic = {
        value:interaction.options.getString("topic")
      }
      if(topic.value.length > 90 || topic.value.length < 1)
        return interaction.reply({
          content:`Topic must be 1-90 characters`,
          ephemeral:true
        })
      // @ts-ignore
      interaction.client.api.interactions(interaction.id)(interaction.token).callback.post({
        data:{
          type: 9,
          data: {
            components: [
              {
                type: 1,
                components: [
                  {
                    type: 4,
                    custom_id: 'question1',
                    style: 1,
                    label: 'Firmware + Atmosphere / DeepSea version',
                    placeholder: 'FW X.X.X, Atmosphere X.X.X, DeepSea X.X.X',
                    max_length:50
                  }
                ]
              },
              {
                type: 1,
                components:[
                  {
                    type: 4,
                    custom_id: 'question2',
                    style: 1,
                    label: 'Do you use Hekate or Fusee?',
                    placeholder: 'Hekate / Fusee',
                    min_length:5,
                    max_length:50
                  }
                ]
              },
              {
                type: 1,
                components:[
                  {
                    type: 4,
                    custom_id: 'question3',
                    style: 1,
                    label: 'Do you have an error code and screen?',
                    placeholder: 'Error Code 0000-0000 / Screenshot link',
                    required:false
                  }
                ]
              },
              {
                type: 1,
                components:[
                  {
                    type: 4,
                    custom_id: 'question4',
                    style: 1,
                    label: 'Coming for support with SDSetup or DeepSea?',
                    placeholder: 'SDSetup / DeepSea / Something else',
                    max_length:50
                  }
                ]
              },
              {
                type: 1,
                components:[
                  {
                    type: 4,
                    custom_id: 'question5',
                    style: 2,
                    label: 'Describe your issue and what led up to it',
                    placeholder: 'Well, I was playing Splatoon 2 until...',
                    value:topic.value,
                    min_length:20
                  }
                ]
              }
            ],
            title: 'Open Support Ticket',
            custom_id: 'open_ticket_modal'
          }
        }
      }).then((err) => {
        console.log(err)
      });
    }
})