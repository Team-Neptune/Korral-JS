import { TextChannel, ThreadChannel } from "discord.js";
import { config } from "../../config";
import Command from "../classes/Command";

export default new Command({
  commandName: "staff_create",
  subCommandGroup: "tickets",
  staffOnly: true,
  execute(interaction) {
    // 1-90 char only
    let supportRoleOnly =
      interaction.options.data.find((o) => o.name == "private")?.value ==
        true || false;
    let threadStarter = interaction.member.user.id;
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
                    custom_id: "user",
                    style: 1,
                    label: "User ID for ticket starter",
                    required: true,
                    value: interaction.options.getUser("user", false)?.id,
                  },
                ],
              },
              {
                type: 1,
                components: [
                  {
                    type: 4,
                    custom_id: "question1",
                    style: 2,
                    label: "Issue description",
                    placeholder: "What do you know about the user's issue?",
                    required: false,
                  },
                ],
              },
            ],
            title: "Staff: Open Support Ticket",
            custom_id: "open_ticket_modal",
          },
        },
      })
      .then((err) => {
        console.log(err);
      });
  },
});
