import { SDLayoutOS } from "../../typings";
import Command from "../classes/Command";
const images = {
    "macos":{
      "correct":"https://cdn.discordapp.com/attachments/649724928542900264/830211676355559424/correct_sd.png",
      "incorrect":"https://cdn.discordapp.com/attachments/649724928542900264/830211690813063208/incorrect_sd.png"
    },
    "win10":{
      "correct":"https://cdn.discordapp.com/attachments/824901291490803733/872709292682256425/correct_sd_windows.png",
      "incorrect":"https://cdn.discordapp.com/attachments/824901291490803733/872709305688789063/incorrect_sd_windows.png"
    }
}

export default new Command({
  commandName:"sd",
  subCommandGroup:"switch",
    execute(interaction){
          let os:SDLayoutOS = (interaction.options.getString("os", false)?.toString() || "win10") as SDLayoutOS;
          let symptoms = [`Missing lp0 lib`, `Missing or old minerva lib`, `Update bootloader`, `Missing pkg1`, `Text-based version of hekate`]
          interaction.reply({
              content:`If you're getting experiencing one of the following:\n${symptoms.map(s => `*${s}*`).join("\n")}\n\nYour SD card layout may be incorrect. Please confirm that you **extracted** the contents of the \`sd\` folder onto your SD card root.`,
              embeds:[
                {
                    "title":"✅ Correct Layout",
                    "image":{
                      "url":`${images[os].correct}`
                    }
                },
                {
                    "title":"❌ Incorrect Layout",
                    "image":{
                      "url":`${images[os].incorrect}`
                    }
                }
              ]
          })
    }
})