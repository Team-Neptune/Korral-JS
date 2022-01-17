import { config } from "../../config";
import Command from "../classes/Command";
import { existsSync, writeFileSync, readFileSync } from 'fs';
import { GuildMember, GuildMemberRoleManager, MessageEmbed, TextChannel } from "discord.js";

export default new Command({
  staffOnly:true,
  commandName:"info",
  subCommandGroup:"user",
  async execute(interaction){
    let mentionedUser = interaction.options.getUser("user")
    let mentionedMember = interaction.guild.members.cache.get(mentionedUser.id)
    const embed = new MessageEmbed()
    .setAuthor(mentionedUser.tag, mentionedUser.displayAvatarURL({dynamic:true}))
    .setDescription(`**Username**: ${mentionedUser.tag}\n**ID**: ${mentionedUser.id}\n**Avatar**: [here](${mentionedUser.displayAvatarURL({dynamic:true})})\n**Bot**: ${mentionedUser.bot}\n**Creation**: <t:${Math.floor(mentionedUser.createdTimestamp / 1000)}>\n**Display Name**: ${mentionedMember.nickname || "None."}\n**Joined**: <t:${Math.floor(mentionedMember.joinedTimestamp / 1000)}>\n**Highest Role**: ${`<@&${mentionedMember.roles.highest}>` || "None."}`)
    interaction.reply({embeds:[embed], ephemeral:true})
  }
})