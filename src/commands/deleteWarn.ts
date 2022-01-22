import Command from "../classes/Command";
import { readFileSync, existsSync, writeFileSync } from 'fs'
import { config } from "../../config";
import { GuildMemberRoleManager, TextChannel } from "discord.js";

export default new Command({
    commandName:"deletewarn",
    staffOnly:true,
    subCommandGroup:"mod",
    async execute(interaction){
        const mentionedUser = interaction.options.getUser("user")

        if (!existsSync(config.warningJsonLocation)) 
            return interaction.reply({
                content:`'warnings.json' doesn't exist. Please do at least one warning to create the file.`,
                ephemeral:true
            })

        var warningNr = interaction.options.getNumber("warn_number");

        // all requirements are met

        var userLog = JSON.parse(readFileSync(config.warningJsonLocation).toString())
        if (!userLog[mentionedUser.id])
            return interaction.reply({
                content:`This user has no warnings.`,
                ephemeral:true
            });


        if (!userLog[mentionedUser.id][warningNr])
            return interaction.reply({
                content:`Warning doesn't exist.`,
                ephemeral:true
            })


        userLog[mentionedUser.id].splice(warningNr, 1); // remove the warning
        writeFileSync(config.warningJsonLocation, JSON.stringify(userLog))

        interaction.reply({
            content:`Warning removed.`,
            ephemeral:true
        });
    }
})