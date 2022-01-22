import Command from "../classes/Command";

export default new Command({
  commandName:"cpr",
  subCommandGroup:"switch",
    execute(interaction){
        let target = interaction.options?.data.find(o => o.name == 'target')?.value?.toString() || false;
        interaction.reply({
            content:`${target ? `*Target: <@${target}>*\n` : ``}\nTeam Neptune has developed a payload (CommonProblemResolver) that can fix a few of the common issues you can encounter with your switch.`,
            allowedMentions:target ? { users: [target] } : undefined,
            components:[
                {
                    "type":1,
                    "components":[
                      {
                        "type":2,
                        "style":5,
                        "url":"https://gbatemp.net/threads/payload-cpr-fix-your-switch-without-a-pc.590341/",
                        "label":"Learn more"
                      },
                      {
                        "type":2,
                        "style":5,
                        "url":"https://github.com/Team-Neptune/CommonProblemResolver",
                        "label":"Source Code"
                      },
                      {
                        "type":2,
                        "style":5,
                        "url":"https://github.com/Team-Neptune/CommonProblemResolver/releases/latest",
                        "label":"Latest Release"
                      }
                    ]
                }
            ]
        })
    }
})