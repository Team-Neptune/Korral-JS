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
    },
    "winxp":{
      "correct":"https://cdn.discordapp.com/attachments/824901291490803733/872709375775637554/correct_sd_windowsxp.PNG",
      "incorrect":"https://cdn.discordapp.com/attachments/824901291490803733/872709387356102666/incorrect_sd_windowsxp.PNG"
    },
    "mint20":{
      "correct":"https://cdn.discordapp.com/attachments/824901291490803733/872718048333811732/unknown.png",
      "incorrect":"https://cdn.discordapp.com/attachments/824901291490803733/872717930238996530/unknown.png"
    }
}

export default new Command({
    execute(interaction){
          let os:SDLayoutOS = interaction.options.getString("os")?.toString() as SDLayoutOS;
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