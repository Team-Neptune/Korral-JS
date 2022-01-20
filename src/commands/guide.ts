import Command from "../classes/Command";

export default new Command({
    commandName:"guide",
    subCommandGroup:"switch",
    execute(interaction){
        interaction.reply({
            content:`**Generic starter guides:**\n[Beginners Guide](https://switch.homebrew.guide/)\n\n**Specific guides:**\n[Manually Updating/Downgrading (with HOS)](https://switch.homebrew.guide/usingcfw/manualupgrade)\n[Manually Repairing/Downgrading (without HOS)](https://switch.homebrew.guide/usingcfw/manualchoiupgrade)\n[Creating an emuMMC](https://switch.homebrew.guide/emummc/emummc.html)\n\n**These guides were not created by Team Neptune.**`
        })
    }
})