import { config } from "../../config";
import Command from "../classes/Command";
import { existsSync, writeFileSync, readFileSync } from 'fs';
import { GuildMember, GuildMemberRoleManager, MessageEmbed, TextChannel } from "discord.js";

export default new Command({
  staffOnly:true,
  commandName:"note",
  subCommandGroup:"mod",
  async execute(interaction){
    const mentionedUser = interaction.options.getUser("user");
    if(!mentionedUser)
        return interaction.reply({
          content:`No user was mentioned.`,
          ephemeral:true
        });
    let reason = interaction.options.getString("text")

    // all requirements are met
    var notes = JSON.parse(readFileSync(config.noteJsonLocation).toString())

    if (!notes[mentionedUser.id])
        notes[mentionedUser.id] = [];

    notes[mentionedUser.id].push(reason);

    writeFileSync('./userNotes.json', JSON.stringify(notes))
    interaction.reply({
      content:`<@${mentionedUser.id}> had a note added. User has ${notes[mentionedUser.id].length} note(s).`,
      ephemeral:true
    })
  }
})