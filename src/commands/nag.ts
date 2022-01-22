import Command from "../classes/Command";

export default new Command({
    commandName:"nag",
    subCommandGroup:"switch",
    execute(interaction){
        switch (interaction.options.getString("type")) {
            case "gl":
                interaction.reply({
                    content:"1. Open Goldleaf\n2. Select `Console and Goldleaf settings`\n3. Select on `Firmware and Updates`\n4. Select `Delete pending`"
                });
                break;
            case "mm":
                interaction.reply({
                    content:"1. Turn off your switch\n2. If you have autoRCM enabled you should push hekate and select a launch option before doing the next step\n3. Press and hold Volume down and then hold the power button\n4. Keep pressing the Power button, but let go of Volume Down and press and hold Volume Up\n5. Let go of the power button and keep holding Volume Up untill you see safemode appear on the screen.\nAfter you see Maintenance Mode pop up on your switch screen. Don't select anything and turn your switch off again"
                })
                break;
            default:
                interaction.reply({
                    content:"😬 An invalid option was provided. Please open an issue on [GitHub](https://github.com/Team-Neptune/Korral-Interactions) if the issue persists."
                })
        }
    }
})