import { config } from "../../config";
import Command from "../classes/Command";
import { existsSync, writeFileSync, readFileSync } from 'fs';
import { GuildMember, GuildMemberRoleManager, MessageEmbed, TextChannel } from "discord.js";

export default new Command({
  staffOnly:true,
  commandName:"log",
  subCommandGroup:"user",
  async execute(interaction){
    let mentionedUser = interaction.options.getUser("user")
    var warnings = JSON.parse(readFileSync(config.warningJsonLocation).toString())
    var notes = JSON.parse(readFileSync(config.noteJsonLocation).toString())
    if (!warnings[mentionedUser.id] && !notes[mentionedUser.id])
      return interaction.reply({
        content:`${mentionedUser.tag} does not have any warnings or notes.`,
        ephemeral:true
      });
    const embed = new MessageEmbed()
    embed.setAuthor(mentionedUser.tag, mentionedUser.displayAvatarURL({dynamic:true}))
    if(warnings[mentionedUser.id])
      warnings[mentionedUser.id].forEach(function (warning, index) {
        embed.addField('Warning: ' + (parseInt(index) + 1), warning)
      });
    if(notes[mentionedUser.id])
      notes[mentionedUser.id].forEach(function (warning, index) {
        embed.addField('Note: ' + (parseInt(index) + 1), warning)
      });
    interaction.reply({embeds:[embed], ephemeral:true})
  }
})