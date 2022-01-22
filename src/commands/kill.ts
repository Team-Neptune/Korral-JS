
import { exec } from 'child_process'
import Command from "../classes/Command";

export default new Command({
    commandName:"kill",
    subCommandGroup:"bot",
    staffOnly:true,
    async execute(interaction){
        await interaction.reply({
            content:`Killing bot...`
        })
        process.exit()
    }
})
