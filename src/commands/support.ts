import {Command} from '../../typings'
import { MessageEmbed } from 'discord.js'
import {config} from '../../config'
export const supportCommands:Array<Command> = [
    {
        name: 'exfat',
        description: 'Displays info on why not to use exfat',
        execute(message, args) {
            const exampleEmbed = new MessageEmbed()
            .setTitle("Guiformat")
            .setURL('http://ridgecrop.co.uk/guiformat.exe')
            .setDescription('A useful tool for formatting SD cards over 32GB as FAT32 on Windows.')
            message.channel.send("The standard exFAT driver is bad and shouldn't be used.\n\nIf your PC doesn't allow you to format your card to FAT32 you can do that in hekate:\nTools -> Arch bit · RCM · Touch · Partition -> Partition", {embed:exampleEmbed})
        },
        staffOnly:false
    },
    {
        name: 'dns',
        description: "shows 90's dns options",
        staffOnly:false,
        execute(message, args) {
            const DNS = new MessageEmbed()
            .setTitle('90DNS IP adresses')
            .setDescription("These are the 90DNS IP adresses: \n `207.246.121.77` (USA) \n `163.172.141.219` (France) \n \n You will have to set up the DNS for every wifi network you connect to.")
            message.channel.send(DNS)
        },
    },
    {
        name: 'sd',
        description: 'Shows the SD command',
        staffOnly:false,
        execute(message, args) {
            const embed = new MessageEmbed()
            embed.setTitle("SD Folder")
            embed.setDescription('If you are getting an error in hekate such as: Missing lp0 lib,  Missing or old minerva lib or Update bootloader \n Please check and make sure that you **extracted the contents of the SD folder onto your SD card**')
            message.channel.send(embed)
        }
    },
    {
        name: 'guide',
        description: 'Sends links to useful guides.',
        execute(message, args) {
            message.channel.send(`**Generic starter guides:**\nBeginners Guide: https://switch.homebrew.guide/\n\n**Specific guides:**\nManually Updating/Downgrading (with HOS): https://switch.homebrew.guide/usingcfw/manualupgrade\nManually Repairing/Downgrading (without HOS): https://switch.homebrew.guide/usingcfw/manualchoiupgrade\n\n**These guides are not by us**`);
        },
        staffOnly:false
    },
    {
        name:"nag",
        description: 'Shows helpful stuff about nags',
        staffOnly:false,
        execute(message, args){
            const goldleafContent = "1. Open Goldleaf\n2. Select `Console and Goldleaf settings`\n3. Select on `Firmware and Updates`\n4. Select `Delete pending`"
            const settingsContent = "1. Turn off your switch\n2. If you have autoRCM enabled you should push hekate and select a launch option before doing the next step\n3. Press and hold Volume down and then hold the power button\n4. Keep pressing the Power button, but let go of Volume Down and press and hold Volume Up\n5. Let go of the power button and keep holding Volume Up untill you see safemode appear on the screen.\nAfter you see Maintenance Mode pop up on your switch screen. Don't select anything and turn your switch off again"
            function sendEmbed(type = "Error: `type` wasn't provided.", content = "Error: `content` wasn't provided.", methodChosen = true){
                const embed = new MessageEmbed()
                .setTitle(methodChosen?"Removing update with " + type:"Please choose a method")
                .setDescription(content)
                return message.channel.send(embed)
            }
            switch(args.join(" ").toLowerCase()){
                case "goldleaf":return sendEmbed("Goldleaf", goldleafContent)
                case "settings":return sendEmbed("Settings", settingsContent)
                //Joke option
                case "beans":return sendEmbed("Beans", "CAN I EAT THE BEANS NOW??? PLZ???")
                //Test sendEmbed()
                case "--createtesterror":return sendEmbed(undefined, undefined, undefined)
                default:return sendEmbed(null, "Please add `goldleaf` or `settings` at the end of the message.", false)
            }
        }
    },
    {
        name:"es",
        description: 'Shows helpful patch stuff',
        aliases: ['patches'],
        staffOnly:false,
        execute(message, args){
            if(!args[0]){
                message.channel.send(`For pirated eshop-games you need ES signature patches. As their only purpose is to allow piracy we're not providing any help with installation of said patches or pirated games afterwards`)
            }else if(args[0] == '--yes' && message.member.roles.cache.some(role => config.staffRoles.includes(role.id))){
                message.channel.send(`Patches? You want 🩹?  Ohhhhhh you mean you want like the patches patches that patch stuff for switch.. hmmmmmmmm 🤔 why do u need these patches.. idc, or do i.... 🤷‍♂️ ok kbye i guess`)
            }else if(args[0] == '--hax' && message.member.roles.cache.some(role => config.staffRoles.includes(role.id)))[
                message.channel.send(`:canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: `)
            ]
        }
    },
    {
        "name":"manual",
        "staffOnly":false,
        "description":"Update guide",
        execute(message, args){
            message.channel.send("1. Put sd in computer\n2. Delete the `atmosphere`, `bootloader` & `sept` folder\n3: Download our latest release from <https://github.com/Team-Neptune/DeepSea/releases/latest> and try again.")
        }
    }
]