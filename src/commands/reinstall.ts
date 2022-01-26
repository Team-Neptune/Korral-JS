import Command from "../classes/Command";
import DeepSea from "../deepsea";

export default new Command({
    commandName:"reinstall",
    subCommandGroup:"switch",
    execute(interaction){
        let deepsea = new DeepSea()
        let releases = deepsea.get()
        let normalDownload = releases.find(r => {
            console.log(r)
            return r?.name?.includes("normal")
        })
        if(!normalDownload)
            return interaction.reply({
                content:`Unable to find a normal release. This should not happen.`
            })
        interaction.reply({
            content:`**How to manually (re)install DeepSea**\n1. Delete all folders except \`Nintendo\` and \`emummc\` (if they exist)\n2. Download the [latest package](<https://github.com/Team-Neptune/DeepSea/releases/download/${normalDownload.latestTag}/${normalDownload.name}>)\n3. Extract contents of the zip to the SD card\n4. Use the included Hekate payload\n\n**Note:** Make sure you delete the folders and not just overwrite them, as this could lead to problems.`
        })
    }
})
