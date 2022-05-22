import { MessageOptions, ThreadChannel } from "discord.js";
import { config } from "../../config";
import ModalCommand from "../classes/ModalCommand";

export default new ModalCommand({
  customId: "speak_large_input",
  staffOnly: true,
  async execute(interaction, client) {
    let messageText =
      interaction.data.components[0]?.components[0]?.value || "";
    let disable_ping = Boolean(
      interaction.data.components[1]?.components[0]?.value || false
    );
    // @ts-expect-error
    client.api
      //@ts-expect-error
      .interactions(interaction.id)(interaction.token)
      .callback.post({
        data: {
          type: 4,
          data: {
            content: `Sent!`,
            flags: 64,
          },
        },
      });
    let channel = client.channels.cache.get(interaction.channel_id);
    if (channel.isText()) {
      let responseMessage: MessageOptions = {
        content: messageText,
      };
      if (disable_ping)
        responseMessage.allowedMentions = {
          parse: [],
        };
      channel.send(responseMessage);
    }
  },
});
