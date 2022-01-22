import Command from "../classes/Command";
import { Message, TextChannel } from "discord.js";
const message_guild_id = "703301751171973190"
const message_channel_id = "703302552594284594"
const message_id = "824322420529823764"

export default new Command({
    commandName:"speak",
    subCommandGroup:"utility",
    staffOnly:true,
    execute(interaction){
        let text = interaction.options.getString("text")
        interaction.reply({
            content:`👍`,
            ephemeral:true
        })
        interaction.channel.send({
            content:text
        })
    }
})
