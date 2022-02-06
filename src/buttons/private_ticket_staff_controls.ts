import { BaseMessageComponentOptions, MessageActionRow, MessageActionRowOptions, MessageEmbed, OverwriteResolvable, TextChannel } from "discord.js";
import { config } from "../../config";
import ButtonCommand from "../classes/ButtonCommand";

const userPingReplaceRegExp = new RegExp(/\!{(USER_PING)\}!/, "g");

export default new ButtonCommand({
  customId:"private_ticket_staff_controls",
  checkType:"STARTS_WITH",
  staffOnly:true,
  async execute(interaction){
      if(!interaction.channel.isText())
        return interaction.reply({
            content:`This is only for text channels`,
            ephemeral:true
        })
    let thisChannel:TextChannel = interaction.guild.channels.cache.get(interaction.channelId) as TextChannel;
    let threadStarter = interaction.customId.split("private_ticket_staff_controls_")[1];
    let randomChars = (Math.random() + 1).toString(36).substring(7).toString();

    let components:(MessageActionRow | (Required<BaseMessageComponentOptions> & MessageActionRowOptions))[] = [
        {
            type:"ACTION_ROW",
            components:[
                {
                    "type":"BUTTON",
                    "style":"SECONDARY",
                    "customId":`collecter_${randomChars}_lock_channel-${interaction.message?.id}`,
                    "label":`Archive Channel`,
                    "disabled":thisChannel.permissionOverwrites.cache.find(po => po.id == thisChannel.guildId && po.deny.has("SEND_MESSAGES"))?true:false
                }
            ]
        }
    ];

    interaction.reply({
        content:`**Staff Private Ticket Controls**`,
        components,
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
        let starterMessageId = collected.customId.split("-")[1];
        
        // Archive
        if(collected.customId.includes("lock_channel")){
            let thisChannel:TextChannel = interaction.guild.channels.cache.get(collected.channelId) as TextChannel;

            if(thisChannel.isText()){
                let staffOverrides:OverwriteResolvable[] = config.staffRoles.map((roleId) => {
                    return {
                        type:"role",
                        allow:["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
                        deny:["SEND_MESSAGES", "ADD_REACTIONS"],
                        id:roleId
                    }
                })

                let embeds:MessageEmbed[] = [
                    new MessageEmbed(                {
                        "description":`🔒 Private Ticket Channel has been closed by <@${interaction.user.id}>`,
                        "color":16711680
                    })
                ];
                if(config.closingTicketsSettings?.closeMessage)
                    embeds.push(new MessageEmbed({
                        "description":config.closingTicketsSettings.closeMessage.replace(userPingReplaceRegExp, `<@${threadStarter}>`),
                        "footer":{
                            text:"The message above is set by the server"
                        }
                    }));
                
                await interaction.channel.send({embeds})


                let res = await thisChannel.permissionOverwrites.set([
                    ...staffOverrides,
                    {
                        type:"role",
                        id:interaction.guildId,
                        deny:["VIEW_CHANNEL", "SEND_MESSAGES", "ADD_REACTIONS"]
                    },
                    {
                        type:"member",
                        id:interaction.client.user.id,
                        allow:["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY", "ATTACH_FILES", "EMBED_LINKS", "MANAGE_MESSAGES", "MANAGE_CHANNELS"]
                    }
                ]);

                if(!res){
                    collected.update({
                        embeds:[
                            {
                                description:`Failed to archive channel.`,
                                color:"RED"
                            }
                        ]
                    })
                }
                if(res){
                    components[0].components[0].disabled = true;
                    await interaction.channel.messages.cache.get(starterMessageId)
                    collected.update({
                        components,
                        embeds:[
                            {
                                description:`Successfully archived channel.`,
                                color:"GREEN"
                            }
                        ]
                    })
                }
            }
            return;
        }
    })
  }
})