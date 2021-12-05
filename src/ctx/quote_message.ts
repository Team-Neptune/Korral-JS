import { config } from "../../config";
import ContextMenuCommand from "../classes/ContextMenuCommand";

export default new ContextMenuCommand({
    commandName:"Quote Message",
    staffOnly:true,
    execute(interaction){
        if(interaction.channel.isThread() && interaction.channel.archived == true)
            return interaction.reply({
                content:`That is an archived thread. Messages cannot be quoted from the thread until it has been unarchived.`,
                ephemeral:true
            })
        const quoteChannel = interaction.client.channels.cache.get(config.messageQuoteChannelId);
        const quotedMessage = interaction.options.getMessage("message", false)
        if(!quoteChannel)
            return interaction.reply({
                content:"`config.messageQuoteChannelId` is not set or the provided channel id is invalid.",
                ephemeral:true
            })
        interaction.deferReply({
            ephemeral:true
        }).then(() => {
            if(quoteChannel.isText()){
                quoteChannel.send({
                    content:quotedMessage.content || "*No content*",
                    embeds:[
                        ...quotedMessage.embeds,
                        {
                            description:`This is a quoted message by <@${quotedMessage.author.id}> (${quotedMessage.author.id}) in <#${interaction.channelId}> (${interaction.channelId})\n[Jump to message](https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${quotedMessage.id})`,
                            color:"GREY",
                            footer:{
                                iconURL:`https://cdn.discordapp.com/avatars/${quotedMessage.author.id}/${quotedMessage.author.avatar}`,
                                text:`${quotedMessage.author.username}#${quotedMessage.author.discriminator}`
                            }
                        }
                    ],
                    allowedMentions:{
                        parse:[]
                    }
                }).then(() => {
                    interaction.editReply({
                        content:`Message has been quoted in <#${quoteChannel}>.`
                    })
                })
            }
        })
    }
})