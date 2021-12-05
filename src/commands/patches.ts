import Command from "../classes/Command";

export default new Command({
    execute(interaction){
        interaction.reply({
            content:`For pirated eshop-games, forwarders and other unofficial stuff you need signature patches. You can download them seperatly via the included "Switch AIO updater" homebrew. As their general purpose is to allow piracy we're not providing any help with installation or problems of said patches or pirated games afterwards.`
        })
    }
})