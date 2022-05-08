import { GuildMemberRoleManager, InteractionReplyOptions } from "discord.js";
import { config } from "../../config";
import Command from "../classes/Command";

export default new Command({
  commandName: "prompt",
  subCommandGroup: "tickets",
  async execute(interaction) {
    let user = interaction.options.getUser("user");
    let msgText: string = interaction.options.getString("message", false);
    let ticket = interaction.client.getSupportThreadData(user.id);
    if (!ticket || !ticket.active)
      return interaction.reply({
        content: `Unable to find a ticket with that user`,
        ephemeral: true,
      });
    let isStaff = (
      interaction.member.roles as GuildMemberRoleManager
    ).cache.find(
      (role) =>
        config.staffRoles.includes(role.id) || config.supportRoleId == role.id
    );
    if (!isStaff)
      return interaction.reply({
        content: `This is a staff only command.`,
        ephemeral: true,
      });
    if (ticket.threadChannelId != interaction.channelId)
      return interaction.reply({
        content: `This command must be sent in the ticket channel`,
        ephemeral: true,
      });
    if (ticket.locked && ticket.locked != interaction.user.id)
      return interaction.reply({
        content: `This ticket's management has been restricted to <@${ticket.locked}>. Please contact them to perform this action.`,
        ephemeral: true,
      });

    let randomChars = (Math.random() + 1).toString(36).substring(7).toString();

    let reply: InteractionReplyOptions = {
      content: `Hey <@${user.id}>,\n\n${
        msgText ||
        `<@${interaction.user.id}> has requested that this ticket be closed. If you're done with your question, you can close it with the button below. If you are not finished, please let us know so we don't close your ticket for inactivity.`
      }`,
      embeds: msgText
        ? [
            {
              footer: {
                iconURL: interaction.user.displayAvatarURL({
                  dynamic: true,
                  size: 256,
                }),
                text: `Prompted by ${interaction.user.tag}`,
              },
              color:
                (interaction.member.roles as GuildMemberRoleManager).color
                  .hexColor || interaction.user.hexAccentColor,
            },
          ]
        : [],
      components: [
        {
          type: "ACTION_ROW",
          components: [
            {
              type: "BUTTON",
              label: "Close Ticket",
              style: "DANGER",
              customId: `close_ticket_${user.id}`,
            },
            {
              type: "BUTTON",
              label: "No, don't close it yet",
              style: "SECONDARY",
              customId: `collecter_${randomChars}_dismiss_prompt`,
            },
          ],
        },
      ],
      allowedMentions: {
        users: [user.id],
      },
    };

    if (msgText == "-") reply.content = null;

    await interaction.reply(reply);
    let fetchedReply = await interaction.fetchReply();

    let collector = interaction.channel.createMessageComponentCollector({
      componentType: "BUTTON",
      message: fetchedReply,
      time: 300000,
      max: 1,
      filter(button) {
        let isStaff = (
          interaction.member.roles as GuildMemberRoleManager
        ).cache.find(
          (role) =>
            config.staffRoles.includes(role.id) ||
            config.supportRoleId == role.id
        )
          ? true
          : false;
        return (
          button.customId.startsWith(`collecter_${randomChars}`) &&
          (isStaff || button.user.id == user.id)
        );
      },
    });

    collector.once("collect", async (collected) => {
      if (!collected)
        return collected.update({
          components: [
            {
              type: "ACTION_ROW",
              components: [
                {
                  type: "BUTTON",
                  label: "Close Ticket",
                  style: "DANGER",
                  customId: `close_ticket_${user.id}`,
                },
                {
                  type: "BUTTON",
                  label: "No, don't close it yet",
                  style: "SECONDARY",
                  customId: `collecter_${randomChars}_dismiss_prompt`,
                  disabled: true,
                },
              ],
            },
          ],
        });
      if (collected.customId == `collecter_${randomChars}_dismiss_prompt`)
        return collected.update({
          embeds: [
            ...fetchedReply.embeds,
            {
              color: "RED",
              footer: {
                iconURL: collected.user.displayAvatarURL({ dynamic: true }),
                text: `Dismissed by ${collected.user.tag} (${collected.user.id})`,
              },
            },
          ],
          components: [
            {
              type: "ACTION_ROW",
              components: [
                {
                  type: "BUTTON",
                  label: "Close Ticket",
                  style: "DANGER",
                  customId: `close_ticket_${user.id}`,
                  disabled: true,
                },
                {
                  type: "BUTTON",
                  label: "No, don't close it yet",
                  style: "SECONDARY",
                  customId: `collecter_${randomChars}_dismiss_prompt`,
                  disabled: true,
                },
              ],
            },
          ],
        });
    });
  },
});
