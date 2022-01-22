
import { exec } from 'child_process'
import Command from "../classes/Command";

export default new Command({
    commandName:"pull",
    subCommandGroup:"bot",
    staffOnly:true,
    async execute(interaction){
        await interaction.deferReply()
        exec("git pull", (error, stdout, stderr) => {
            interaction.editReply({
                content:`\`\`\`stdout:\n${stdout}\n\nstderr:\n${stderr}\n\nerror:\n${error}\`\`\``
            })
        }); 
    }
})
