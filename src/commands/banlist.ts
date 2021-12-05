import Command from "../classes/Command";
import { Message, TextChannel } from "discord.js";
const message_guild_id = "703301751171973190"
const message_channel_id = "703302552594284594"
const message_id = "824322420529823764"

export default new Command({
    execute(interaction){
        interaction.deferReply({ephemeral:false}).then(async () => {
            let channel = interaction.client.guilds.cache.get(message_guild_id).channels.cache.get(message_channel_id) as TextChannel;
            let messages = await channel.messages.fetch({
                "around":message_id,
                "limit":1
            })
            interaction.followUp({
                content:`${messages.first().content}\n\n[Jump to Message](https://discord.com/channels/${message_guild_id}/${message_channel_id}/${message_id})`
            })
        })
    }
})
