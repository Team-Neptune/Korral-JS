import Command from "../classes/Command";

export default new Command({
    commandName: "patches",
    subCommandGroup: "switch",
    execute(interaction) {
        interaction.reply({
            content: `Sigpatches are not supported in this server as they are used to promote piracy; however, more information regarding sigpatches can be found online. We will not provide assistance with locating these patches.`
        })
    }
})
