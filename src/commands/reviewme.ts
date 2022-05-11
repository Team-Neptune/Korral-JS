import { ColorResolvable, MessageEmbed, TextChannel } from "discord.js";
import { config } from "../../config";
import Command from "../classes/Command";
export default new Command({
  staffOnly: true,
  commandName: "review_me",
  subCommandGroup: "mod",
  async execute(interaction) {
    if (!config.incomingReviewChannel)
      return interaction.reply({
        content: `Error: \`config.incomingReviewChannel\` not present`,
      });
    let randomChars = (Math.random() + 1).toString(36).substring(7).toString();
    let mentionedUser = interaction.options.getUser("user");
    let reasonForReview = interaction.options.getString("reason");

    if (mentionedUser.id == interaction.user.id)
      return interaction.reply({
        content: `You can't request a review from yourself.`,
        ephemeral: true,
      });

    const embed = new MessageEmbed()
      .setTitle("Review Requested")
      .setDescription(reasonForReview)
      .setFooter(
        `Review requested from ${interaction.user.tag}`,
        interaction.user.displayAvatarURL({ dynamic: true })
      );
    await interaction.reply({
      content: `<@${mentionedUser.id}>`,
      embeds: [embed],
      components: [
        {
          type: "ACTION_ROW",
          components: [
            {
              type: "BUTTON",
              style: "DANGER",
              customId: `collecter_${randomChars}_review_1`,
              label: "1",
            },
            {
              type: "BUTTON",
              style: "SECONDARY",
              customId: `collecter_${randomChars}_review_2`,
              label: "2",
            },
            {
              type: "BUTTON",
              style: "SECONDARY",
              customId: `collecter_${randomChars}_review_3`,
              label: "3",
            },
            {
              type: "BUTTON",
              style: "SECONDARY",
              customId: `collecter_${randomChars}_review_4`,
              label: "4",
            },
            {
              type: "BUTTON",
              style: "SUCCESS",
              customId: `collecter_${randomChars}_review_5`,
              label: "5",
            },
          ],
        },
      ],
    });
    let fetchedReply = await interaction.fetchReply();
    let collector = interaction.channel.createMessageComponentCollector({
      componentType: "BUTTON",
      message: fetchedReply,
      time: 300000,
      filter(button) {
        return (
          button.user.id == mentionedUser.id &&
          button.customId.startsWith(`collecter_${randomChars}`)
        );
      },
    });

    let sentReviewEmbedMessageId: string;
    let sentReviewEmbedChannelId: string;

    collector.on("collect", async (collected) => {
      let selected = collected;
      let reviewNum = selected.customId.split(
        `collecter_${randomChars}_review_`
      )[1];

      if (reviewNum == "comment") {
        // @ts-expect-error
        interaction.client.api
          // @ts-expect-error
          .interactions(collected.id)(collected.token)
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
                        custom_id: "reviewer_comment",
                        style: 2,
                        label: "What would you like to say?",
                        required: true,
                      },
                    ],
                  },
                ],
                title: "Review: Add Comment",
                custom_id: `add_comment_modal_${sentReviewEmbedMessageId}-${sentReviewEmbedChannelId}-${selected.user.id}`,
              },
            },
          });
        return;
      }

      let reviewColor: ColorResolvable;
      switch (reviewNum) {
        case "1":
          reviewColor = "RED";
          break;
        case "2":
        case "3":
        case "4":
          reviewColor = "YELLOW";
          break;
        case "5":
          reviewColor = "GREEN";
          break;
        default:
          reviewColor = "WHITE";
          break;
      }
      selected.update({
        components: [
          {
            type: "ACTION_ROW",
            components: [
              {
                type: "BUTTON",
                style: "DANGER",
                customId: `collecter_${randomChars}_review_1`,
                label: "1",
                disabled: true,
              },
              {
                type: "BUTTON",
                style: "SECONDARY",
                customId: `collecter_${randomChars}_review_2`,
                label: "2",
                disabled: true,
              },
              {
                type: "BUTTON",
                style: "SECONDARY",
                customId: `collecter_${randomChars}_review_3`,
                label: "3",
                disabled: true,
              },
              {
                type: "BUTTON",
                style: "SECONDARY",
                customId: `collecter_${randomChars}_review_4`,
                label: "4",
                disabled: true,
              },
              {
                type: "BUTTON",
                style: "SUCCESS",
                customId: `collecter_${randomChars}_review_5`,
                label: "5",
                disabled: true,
              },
            ],
          },
          {
            type: "ACTION_ROW",
            components: [
              {
                type: "BUTTON",
                style: "SECONDARY",
                customId: `collecter_${randomChars}_review_comment`,
                label: "Leave a comment",
                emoji: "📝",
              },
            ],
          },
        ],
        embeds: [
          embed,
          {
            description: `**Thanks for the *${reviewNum.toString()}* review, <@${
              selected.user.id
            }>**`,
            color: reviewColor,
          },
        ],
      });
      let channel = interaction.client.channels.cache.get(
        config.incomingReviewChannel
      );
      if (channel.isText()) {
        // sentReviewEmbedMessageId
        let { id, channelId } = await channel.send({
          embeds: [
            {
              title: "Reviewer",
              description: `<@${interaction.user.id}> received a **${reviewNum}** review from <@${selected.user.id}>`,
              color: reviewColor,
            },
            {
              title: "Review Question",
              description: `>>> ${reasonForReview}`,
              color: reviewColor,
            },
          ],
          components: [
            {
              type: "ACTION_ROW",
              components: [
                {
                  type: "BUTTON",
                  style: "LINK",
                  label: "Jump to Context",
                  url: `https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${fetchedReply.id}`,
                },
              ],
            },
          ],
        });
        sentReviewEmbedMessageId = id;
        sentReviewEmbedChannelId = channelId;
      }
    });
    collector.on("end", (collected) => {
      if (!collected.first())
        interaction.editReply({
          components: [
            {
              type: "ACTION_ROW",
              components: [
                {
                  type: "BUTTON",
                  style: "DANGER",
                  customId: `collecter_${randomChars}_review_1`,
                  label: "1",
                  disabled: true,
                },
                {
                  type: "BUTTON",
                  style: "SECONDARY",
                  customId: `collecter_${randomChars}_review_2`,
                  label: "2",
                  disabled: true,
                },
                {
                  type: "BUTTON",
                  style: "SECONDARY",
                  customId: `collecter_${randomChars}_review_3`,
                  label: "3",
                  disabled: true,
                },
                {
                  type: "BUTTON",
                  style: "SECONDARY",
                  customId: `collecter_${randomChars}_review_4`,
                  label: "4",
                  disabled: true,
                },
                {
                  type: "BUTTON",
                  style: "SUCCESS",
                  customId: `collecter_${randomChars}_review_5`,
                  label: "5",
                  disabled: true,
                },
              ],
            },
            {
              type: "ACTION_ROW",
              components: [
                {
                  type: "BUTTON",
                  style: "SECONDARY",
                  customId: `collecter_${randomChars}_review_comment`,
                  label: "Leave a comment",
                  emoji: "📝",
                  disabled: true,
                },
              ],
            },
          ],
        });
    });
  },
});
