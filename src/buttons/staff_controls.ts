import { ThreadChannel } from "discord.js";
import { config } from "../../config";
import { TicketType } from "../../typings";
import ButtonCommand from "../classes/ButtonCommand";

export default new ButtonCommand({
  customId:"staff_controls",
  checkType:"STARTS_WITH",
  staffOnly:true,
  async execute(interaction){
    let threadStarter = interaction.customId.split("staff_controls_")[1];
    let threadData = interaction.client.getSupportThreadData(threadStarter);
    let randomChars = (Math.random() + 1).toString(36).substring(7).toString();

    interaction.reply({
        content:`**Staff Ticket Controls**`,
        components:[
            {
                type:"ACTION_ROW",
                components:[
                    {
                        "type":"BUTTON",
                        "style":"SECONDARY",
                        "customId":`collecter_${randomChars}_switch_ticket_type-${interaction.message?.id}`,
                        "label":`Toggle Ticket Type`
                    },
                    {
                        "type":"BUTTON",
                        "style":"SECONDARY",
                        "customId":`collecter_${randomChars}_toggle_restricted_ticket-${interaction.message?.id}`,
                        "label":`Toggle Restricted Management to ${interaction.user.tag}`
                    }
                ]
            }
        ],
        ephemeral:true
    })


    let collector = interaction.channel.createMessageComponentCollector({
        componentType:"BUTTON",
        message:await interaction.fetchReply(),
        time:300000,
        filter(button){
            return button.user.id == interaction.user.id && button.customId.startsWith(`collecter_${randomChars}`)
        }
    })

    collector.on("collect", async (collected) => {
        if(!collected) return;
        let staffControlsMessageInteraction = collected;
        let starterMessageId = staffControlsMessageInteraction.customId.split("-")[1];
        let threadData = interaction.client.getSupportThreadData(threadStarter);
        
        // Switch to Public/Private ticket
        if(staffControlsMessageInteraction.customId.includes("switch_ticket_type")){
            let newType:TicketType;
            if(threadData.type == "PUBLIC")
                newType = "PRIVATE";
            if(threadData.type == "PRIVATE")
                newType = "PUBLIC";
            
            let res = await interaction.client.updateSupportThread({
                newType,
                userId:threadData.userId,
                threadId:threadData.threadChannelId
            })
            if(res === false){
                staffControlsMessageInteraction.update({
                    embeds:[
                        {
                            description:`Failed to update support thread data. Failed to change ticket type to ${newType == 'PUBLIC' ? "Public" : "Private"}.`,
                            color:"RED"
                        }
                    ]
                })
            }
            if(res == true){
                staffControlsMessageInteraction.update({
                    embeds:[
                        {
                            description:`Successfully changed ticket type to ${newType == 'PUBLIC' ? "Public" : "Private"}.`,
                            color:"GREEN"
                        }
                    ]
                })
                interaction.channel.messages.cache.get(starterMessageId)?.edit({
                    content:interaction.message.content.replace(newType == "PUBLIC"?":lock: *This is a private ticket, so only staff may reply.*":":unlock: *This is a public ticket, everyone may view and reply to it..*", newType == "PRIVATE"?":lock: *This is a private ticket, so only staff may reply.*":":unlock: *This is a public ticket, everyone may view and reply to it..*")
                })
                interaction.channel?.send({
                    embeds:[
                        {
                            description:`${newType == "PUBLIC" ? ":unlock:" : ":lock:"} Ticket has been switched to a ${newType == 'PUBLIC' ? "Public" : "Private"} Ticket.`,
                            color:newType == "PUBLIC" ? "GREEN" : "RED",
                            footer:{
                                iconURL:`https://cdn.discordapp.com/avatars/${interaction.member?.user.id}/${interaction.member?.user.avatar}${interaction.member?.user.avatar.startsWith("a_")?".gif":".png"}`,
                                text:`${interaction.member?.user.username}#${interaction.member?.user.discriminator}`
                            }
                        }
                    ]
                })
            }
            return;
        }

        // Lock Ticket Management
        if(staffControlsMessageInteraction.customId.includes("toggle_restricted_ticket")){
            let locked: string | undefined;
            if(typeof threadData.locked == 'undefined')
                locked = staffControlsMessageInteraction.user?.id;
            if(typeof threadData.locked == 'string')
                locked = undefined;
            console.log("old", threadData.locked)
            console.log("new", locked)
            let res = await interaction.client.updateSupportThread({
                userId:threadData.userId,
                threadId:threadData.threadChannelId,
                locked
            })
            if(res === false){
                staffControlsMessageInteraction.update({
                    embeds:[
                        {
                            description:`Failed to update support thread data. Failed to ${typeof locked == 'string'?'restrict':'unrestrict'} ticket management ${typeof locked == 'string'?'to':'from'} ${interaction.user?.tag}.`,
                            color:"RED"
                        }
                    ]
                })
            }
            if(res == true){
                staffControlsMessageInteraction.update({
                    embeds:[
                        {
                            description:`Successfully ${typeof locked == 'string'?'restricted':'unrestricted'} ticket management ${typeof locked == 'string'?'to':'from'} ${interaction.user?.tag}.`,
                            color:"GREEN"
                        }
                    ]
                })
            }
            return;
        }
    })
  }
})