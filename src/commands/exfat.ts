import Command from "../classes/Command";

export default new Command({
    commandName:"exfat",
    subCommandGroup:"switch",
    execute(interaction){
        interaction.reply({
            content:"The standard exFAT driver is bad and shouldn't be used.\n\nIf your PC doesn't allow you to format your card to FAT32 you can do that in hekate:\nTools -> Arch bit · RCM · Touch · Partition -> Partition"
        })
    }
})