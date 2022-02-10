import { ThreadChannel } from "discord.js";
import { config } from "../../config";
import ButtonCommand from "../classes/ButtonCommand";

export default new ButtonCommand({
  customId:"open_ticket",
  checkType:"EQUALS",
  async execute(interaction){
    let threadStarter = interaction.member.user.id
    let supportRoleOnly = false;
    let threadStarterMember = await interaction.guild.members.fetch(threadStarter);
    let topic = {
      value:`${threadStarterMember.nickname || threadStarterMember.user.tag}`
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
                  placeholder: 'FW 13.2.1, Atmosphere 1.2.6, DeepSea 3.5.0',
                  min_length:12,
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
                  label: 'Do you use Hekate or Fusee-Primary?',
                  placeholder: 'Hekate / Fusee Primary',
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
                  label: 'Do you have an error code/screen?',
                  placeholder: 'Error Code 0000-0000 / Send screenshot when ticket opened',
                  min_length:8,
                  max_length:50,
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
                  placeholder: 'SDSetup / DeepSea / Other',
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