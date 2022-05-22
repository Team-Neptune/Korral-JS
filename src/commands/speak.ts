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
    let use_modal: boolean =
      interaction.options.getBoolean("use_modal", false) || false;

    if (use_modal)
      return (
        // @ts-expect-error
        interaction.client.api
          // @ts-expect-error
          .interactions(interaction.id)(interaction.token)
          .callback.post({
            data: {
              type: 9,
              data: {
                components: [
                  {
                    type: 1,
                    components: [
                      {
                        type: 4,
                        custom_id: "text",
                        style: 2,
                        label: "Text",
                      },
                    ],
                  },
                  {
                    type: 1,
                    components: [
                      {
                        type: 4,
                        custom_id: "mentions_disabled",
                        style: 2,
                        label: "Disable mentions? true/false",
                      },
                    ],
                  },
                ],
                title: "Speak: Large Input",
                custom_id: "speak_large_input",
              },
            },
          })
      );

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
