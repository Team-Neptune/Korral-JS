import { config } from "../../config";
import ModalCommand from "../classes/ModalCommand";

export default new ModalCommand({
  customId: "closed_ticket_staff",
  staffOnly: true,
  async execute(interaction, client) {
    let reasonForClosing: string =
      interaction.data.components[0]?.components[0]?.value;
    let threadStarterId: string =
      interaction.data.components[1]?.components[0]?.value;
    let supportThreadData = client.getSupportThreadData(threadStarterId);
    // @ts-expect-error
    client.api
      // @ts-expect-error
      .interactions(interaction.id)(interaction.token)
      .callback.post({
        data: {
          type: 6,
        },
      });
    if (!reasonForClosing || reasonForClosing?.trim() === "") return;
    try {
      let ticketChannel = client.channels.cache.get(
        supportThreadData.threadChannelId
      );
      if (ticketChannel?.isThread()) {
        let ticketStarter = client.users.cache.get(supportThreadData.userId);
        let ticketCloser = client.users.cache.get(interaction.member.user.id);
        await ticketStarter.send({
          embeds: [
            {
              title: "Ticket Closed",
              description: `Hey <@${ticketStarter.id}>, your ticket has been closed by <@${ticketCloser.id}>.`,
              fields: [
                {
                  name: `Reason`,
                  value: reasonForClosing,
                },
                {
                  name: `Ticket`,
                  value: `[${ticketChannel.name}](https://discord.com/channels/${ticketChannel.guildId}/${ticketChannel.id})`,
                  inline: true,
                },
              ],
            },
          ],
        });
        await ticketChannel.send({
          embeds: [
            {
              title: "Ticket Closure Reason",
              description: reasonForClosing,
              footer: {
                text: ticketCloser.tag,
                iconURL: ticketCloser.displayAvatarURL({ dynamic: true }),
              },
            },
          ],
        });
        let modLogs = client.channels.cache.get(config.modLog);
        if (modLogs.isText())
          await modLogs.send({
            embeds: [
              {
                title: "Ticket Closure",
                footer: {
                  text: ticketCloser.tag,
                  iconURL: ticketCloser.displayAvatarURL({ dynamic: true }),
                },
                fields: [
                  {
                    name: `Reason`,
                    value: reasonForClosing,
                  },
                  {
                    name: `Ticket`,
                    value: `[${ticketChannel.name}](https://discord.com/channels/${ticketChannel.guildId}/${ticketChannel.id})`,
                    inline: true,
                  },
                  {
                    name: `Closer`,
                    value: `<@${ticketCloser.id}> (${ticketCloser.tag})`,
                    inline: true,
                  },
                ],
              },
            ],
          });
        await ticketChannel.setLocked(true);
        await ticketChannel.setArchived(true);
      }
    } catch (err) {
      console.error(err);
    }
  },
});
