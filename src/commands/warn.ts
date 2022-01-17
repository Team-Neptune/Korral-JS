import { config } from "../../config";
import Command from "../classes/Command";
import { existsSync, writeFileSync, readFileSync } from 'fs';
import { GuildMember, GuildMemberRoleManager, TextChannel } from "discord.js";

export default new Command({
  staffOnly:true,
  commandName:"warn",
  subCommandGroup:"user",
  async execute(interaction){
    if(!config.warnBehavior || config.warnBehavior.length == 0)
      return interaction.reply({
          content:`You need at least one *WarnBehavior* set in the config to use this command.`,
          ephemeral:true
      });
    
    const mentionedUser = interaction.options.getUser("user");

    if(!mentionedUser)
      return interaction.reply({
        content:`You need to mention a valid user.`,
        ephemeral:true
      });

    if(!existsSync(config.warningJsonLocation))
      return interaction.reply({
        content:`'warnings.json' doesn't exist. Please do at least one warning to create the file.`,
        ephemeral:true
      });

    let reason = interaction.options.getString("reason", false);

    let mentionedMember:GuildMember; 
    try {
      mentionedMember = await interaction.guild.members.fetch({
        user:mentionedUser.id
      });
    } catch(err){
      return interaction.reply({
        content:"Error: "+err,
        ephemeral:true
      });
    }
    
    const reasonRegex = new RegExp(/\!{(REASON)\}!/, "g");

    // all requirements are met

    if ((interaction.member?.user.id || interaction.user.id) == mentionedUser.id)
        return interaction.reply({
          content:`You can't perform this action on yourself.`,
          ephemeral:true
        });

    var warnings = JSON.parse(readFileSync(config.warningJsonLocation).toString())
    var mentionedUserRoles = mentionedMember.roles as GuildMemberRoleManager;

    if (mentionedUserRoles?.cache.some(role => config.staffRoles.includes(role.id)))
        return interaction.reply({
          content:`You can't perform that action on this user.`,
          ephemeral:true
        });

    if (!warnings[mentionedUser.id])
        warnings[mentionedUser.id] = [];

    warnings[mentionedUser.id].push(reason);

    writeFileSync(config.warningJsonLocation, JSON.stringify(warnings))
    const warnAction = config.warnBehavior[warnings[mentionedUser.id]?.length-1]?.action || "NONE"
    const warnMessage = config.warnBehavior[warnings[mentionedUser.id]?.length-1]?.message.replace(reasonRegex, reason) || config.warnBehavior[0]?.message.replace(reasonRegex, reason)
    switch (warnAction) {
        case "NONE":
            mentionedUser.send(warnMessage);
            break;
        case "KICK":
            mentionedUser.send(warnMessage)
            .then(() => {
                mentionedMember.kick(`Auto kick: ${reason}`)
            })
            .catch((e) => {
                console.error(e)
                mentionedMember.kick(`Auto kick: ${reason}`)
            })
            break;
        case "BAN":
            mentionedUser.send(warnMessage)
            .then(() => {
              mentionedMember.ban({reason:`Auto ban: ${reason}`})
            })
            .catch((e) => {
              console.error(e)
              mentionedMember.ban({reason:`Auto ban: ${reason}`})
            })
            break;
        default:
            break;
    }


    interaction.reply({
      content:`<@${mentionedUser.id}> got warned. User has ${warnings[mentionedUser.id].length} warning(s).`,
      ephemeral:true
    });
    (interaction.client.channels.cache.get(config.modLog) as TextChannel).send(`<@${(interaction.member?.user.id || interaction.user.id)}> warned <@${mentionedUser.id}> (${mentionedUser.tag}) - warn #${warnings[mentionedUser.id].length}\n Reason: "${reason}"`)
  }
})