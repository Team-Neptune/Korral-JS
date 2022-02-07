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
            "when cheese flies",
            "when hax becomes one with the chese",
            "when deepsea becomes a cake",
            "when daniel is banned",
            "when daniel become good programmer",
            "when daniel gets a good computer",
            "when daniel plays good games",
            "when daniel stops making unstable bots",
            "when hax stops playing apex",
            "when hax stops golfing",
            "when hax finally [explains](https://cdn.discordapp.com/attachments/744457183843844147/934593115623419904/unknown.png) his message from <t:1606257486:R>"
        ]
        const index = Math.floor(Math.random() * messages.length)
        const msg = messages[index]
        interaction.reply({
            content:msg
        })
    }
})