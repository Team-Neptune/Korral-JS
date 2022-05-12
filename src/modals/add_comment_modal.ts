import { InteractionWebhook, TextChannel } from "discord.js";
import ModalCommand from "../classes/ModalCommand";

export default new ModalCommand({
  customId: "add_comment_modal",
  staffOnly: false,
  async execute(interaction, client) {
    let originalMessageId: string = interaction.data.custom_id
      .split("add_comment_modal_")[1]
      ?.split("-")[0];
    let originalChannelId: string = interaction.data.custom_id
      .split("add_comment_modal_")[1]
      ?.split("-")[1];
    let originalUserId: string = interaction.data.custom_id
      .split("add_comment_modal_")[1]
      ?.split("-")[2];
    if (
      !originalMessageId ||
      !originalChannelId ||
      !originalUserId ||
      originalUserId != interaction.member.user.id
    )
      return (
        //@ts-expect-error
        client.api
          //@ts-expect-error
          .interactions(interaction.id)(interaction.token)
          .callback.post({
            data: {
              type: 4,
              data: {
                content: "Something went wrong, try again later.",
                flags: 64,
              },
            },
          })
      );
    try {
      let originalMessage = await (
        (await client.channels.cache.get(originalChannelId)) as TextChannel
      ).messages.fetch(originalMessageId);
      let interactionUser =
        client.users.cache.get(interaction.member.user.id) ||
        (await client.users.fetch(interaction.member.user.id));
      if (originalMessage) {
        originalMessage.edit({
          embeds: [
            ...originalMessage.embeds,
            {
              title: "Reviewer Comment",
              description: interaction.data.components[0].components[0].value,
              color: 16777215,
              footer: {
                text: interactionUser.tag,
                iconURL: interactionUser.displayAvatarURL({ dynamic: true }),
              },
            },
          ],
        });
        // @ts-expect-error
        client.api
          // @ts-expect-error
          .interactions(interaction.id)(interaction.token)
          .callback.post({
            data: {
              type: 7,
              data: {
                components: [
                  {
                    type: 1,
                    components: interaction.message.components[0].components,
                  },
                  {
                    type: 1,
                    components:
                      interaction.message.components[1].components.map((c) => {
                        c.disabled = true;
                        return c;
                      }),
                  },
                ],
                embeds: [
                  ...interaction.message.embeds,
                  {
                    description:
                      interaction.data.components[0].components[0].value,
                    color: 16777215,
                    footer: {
                      text: interactionUser.tag,
                      icon_url: interactionUser.displayAvatarURL({
                        dynamic: true,
                      }),
                    },
                  },
                ],
              },
            },
          });
      }
    } catch {}
  },
});
