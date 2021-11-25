import Command from "../classes/Command";

export default new Command({
    execute(interaction){
        interaction.reply({
            content:`https://cdn.discordapp.com/attachments/710631969993654334/872967960946413618/select_tools_menu.png`,
            components:[
                {
                    "type":1,
                    "components":[
                      {
                        "customId":`hekatesdmount_page_2_${interaction.member.user.id}`,
                        "label":"Next Step",
                        "type":2,
                        "style":2
                      }
                    ]
                }
            ]
        })
    }
})