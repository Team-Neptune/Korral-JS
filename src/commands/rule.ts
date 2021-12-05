import { readFileSync } from "fs";
import Command from "../classes/Command";

export default new Command({
    execute(interaction){
        const ruleNum = interaction.options.getInteger("number");
        const target = interaction.options.getUser("target", false)?.id || false;
        let rules = JSON.parse(readFileSync("./tn_rules.json").toString());
        if (!rules[`${ruleNum}`])
          return interaction.reply({
              content:`**Invalid rule**\nRule not found.`
          });
        const rule = rules[`${ruleNum}`];
        interaction.reply({
            content:`${target ? `*Target: <@${target}>*\n` : ``}**${rule.title}**\n${rule.content}`,
            allowedMentions:target ? { users: [target] } : undefined
        });
    }
})