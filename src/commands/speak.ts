import { MessageOptions } from "discord.js";
import Command from "../classes/Command";

export default new Command({
  commandName: "speak",
  subCommandGroup: "utility",
  staffOnly: true,
  execute(interaction) {
    let text = interaction.options.getString("text");
    let disable_ping: boolean =
      interaction.options.getBoolean("disable_ping", false) || false;

    let responseMessage: MessageOptions = {
      content: text,
    };

    interaction.reply({
      content: `👍`,
      ephemeral: true,
    });

    if (disable_ping)
      responseMessage.allowedMentions = {
        parse: [],
      };

    interaction.channel.send(responseMessage);
  },
});
