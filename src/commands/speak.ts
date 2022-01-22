import Command from "../classes/Command";

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
