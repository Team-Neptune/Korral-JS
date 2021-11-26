// Hekate SD command navigation
import ButtonCommand from "../classes/ButtonCommand";

export default new ButtonCommand({
  customId:"hekatesdmount_page",
    checkType:"STARTS_WITH",
    execute(interaction){
        let pages = {
            1:"https://cdn.discordapp.com/attachments/710631969993654334/872967960946413618/select_tools_menu.png",
            2:"https://cdn.discordapp.com/attachments/710631969993654334/872967970652045362/tools_menu_select_usb_tools.png",
            3:"https://cdn.discordapp.com/attachments/710631969993654334/872967979388764250/usb_tools_select_sdcard.png"
        }
        let newPageNumber = Number(interaction.customId.split("_")[2])
        let authorID = interaction.customId.split("_")[3]
        let buttons = []
        if(pages[newPageNumber-1])
            buttons.push({
              "custom_id":`hekatesdmount_page_${newPageNumber-1}_${interaction.member.user.id}`,
              "label":"Previous Step",
              "type":2,
              "style":2
            })
        if(pages[newPageNumber+1])
            buttons.push({
              "custom_id":`hekatesdmount_page_${newPageNumber+1}_${interaction.member.user.id}`,
              "label":"Next Step",
              "type":2,
              "style":2
            })
        if(authorID != interaction.member.user.id)
            return interaction.reply({
              "content":`Hey there, this is someone elses message. However, here's your own selector and the [page](${pages[newPageNumber]}) you requested:`,
              "components":[
                {
                  "type":1,
                  "components":buttons
                }
              ],
              "ephemeral":true
            })
        interaction.update({
            "content":`${pages[newPageNumber]}`,
            "components":[
              {
                "type":1,
                "components":buttons
              }
            ]
        })
    }
})