
import { exec } from 'child_process'
import Command from "../classes/Command";

export default new Command({
    commandName:"build",
    subCommandGroup:"bot",
    staffOnly:true,
    async execute(interaction){
        await interaction.deferReply()
        exec("npm run build", (error, stdout, stderr) => {
            interaction.editReply({
                content:`\`\`\`stdout:\n${stdout}\n\nstderr:\n${stderr}\n\nerror:\n${error}\`\`\``
            })
        }); 
    }
})
