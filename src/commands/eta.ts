import Command from "../classes/Command";

export default new Command({
    commandName:"eta",
    subCommandGroup:"meme",
    execute(interaction){
        const messages = [
            "Soon:tm:",
            "June 15th",
            "Germany",
            "jelbrek wil lunch tomorrr",
            ":egg:",
            "chese",
            "when hax learns vuejs",
            "when techgeekgamer learns stuff",
        ]
        const index = Math.floor(Math.random() * messages.length)
        const msg = messages[index]
        interaction.reply({
            content:msg
        })
    }
})