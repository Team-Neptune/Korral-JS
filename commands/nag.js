module.exports = {
    name:"nag",
    description: 'Shows helpful stuff about nags',
    execute(message, args, client){
        const Discord = require('discord.js')
        const goldleafContent = "1. Open Goldleaf\n2. Select `Console and Goldleaf settings`\n3. Select on `Firmware and Updates`\n4. Select `Delete pending`"
        const settingsContent = "1. Turn off your switch\n2. If you have autoRCM enabled you should push hekate and select a launch option before doing the next step\n3. Press and hold Volume down and then hold the power button\n4. Keep pressing the Power button, but let go of Volume Down and press and hold Volume Up\n5. Let go of the power button and keep holding Volume Up untill you see safemode appear on the screen"
        function sendEmbed(type = "Error: `type` wasn't provided.", content = "Error: `content` wasn't provided.", methodChosen = true){
            const embed = new Discord.MessageEmbed()
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
}