module.exports = {
    name: 'help',
    description: 'help with things',
    execute(message, args) {

        info = [
            {
                "words": ["nag"],
                "text": "This means you have a firmware update downloaded but not installed.\nYou can remove that message by deleting the firmware update from within Switch AiO Updater."
            },
            {
                "words":["patch", "loader", "patches", "es", "fs", "acid"],
                "text": "There are different kinds of patches:\n\n- **FS-Patches**: Allow the installation of custom (unsigned/modified) NSP's like forwarders or converted XCI's.\n- **Acid-Patches**: Allow the installation of defect NSPs. Should be avoided but are usually included in FS-Patches.\n- **ES-Patches**: Allow the installation of fake (unsinged/modified) tickets, which allow you to start illegal nsp games\n- **Loader-Patches**: Is the term for a package that includes the above. Nothing extra.\n\n**We do not provide support for those patches.** If you really want them, they can be installed via Switch AiO Updater."
            },
            {
                "words":["update"],
                "text": "If you have any problems with updating deepsea, make sure to delte `Atmosphere`, `Bootloader` & `sept` before manually downloading our latest release from github and writing it back on your SD."
            },
            {
                "words":["fat", "fat32", "exfat", "format", "formatting"],
                "text": "Nintendos exFat implementation is **really** bad. Its known to break sdcards at any time. Yes, even if you had it for a year flawlessly. Please make sure to format your sdcard in fat32 to avoid future issues."
            }
        ];

        if(args.length == 0){
            text = "Aviable arguments (help <arg>):\n";
            hargs = []
            info.forEach(element => {
                hargs = hargs.concat(element.words)
            })
            text = text + "```" + hargs.join(', ') + "```";
            message.channel.send(text);
        } else {
            info.forEach(element => {
                element.words.forEach(word => {
                    if(word == args[0]){
                        message.channel.send(element.text)
                        return;
                    }
                })
            });
        }
    }
};
