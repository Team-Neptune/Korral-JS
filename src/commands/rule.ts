import { readFileSync } from "fs";
import Command from "../classes/Command";

export default new Command({
  commandName:"rule",
  subCommandGroup:"utility",
    execute(interaction){
        const ruleNum = interaction.options.getInteger("number");
        const target = interaction.options.getUser("target", false)?.id || false;
        let showMemeVideo = Math.floor(Math.random() * 10) == 3;
        let rules = JSON.parse(readFileSync("./tn_rules.json").toString());
        if (!rules[`${ruleNum}`])
          return interaction.reply({
              content:`**Invalid rule**\nRule not found.`
          });
        const rule = rules[`${ruleNum}`];
        if(showMemeVideo && ruleNum == 3)
          return interaction.reply({
              content:`https://cdn.discordapp.com/attachments/649724928542900264/666015709532520470/Video.mp4`
          })
          .then(() => {
            interaction.followUp({
                content:`${target ? `*Target: <@${target}>*\n` : ``}**${rule.title}**\n${rule.content}`,
                allowedMentions:target ? { users: [target] } : undefined
            });
          })
        interaction.reply({
            content:`${target ? `*Target: <@${target}>*\n` : ``}**${rule.title}**\n${rule.content}`,
            allowedMentions:target ? { users: [target] } : undefined
        });
    }
})