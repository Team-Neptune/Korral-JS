import { config } from "../../config";
import ContextMenuCommand from "../classes/ContextMenuCommand";

export default new ContextMenuCommand({
  commandName: "(Staff) Open Ticket",
  staffOnly: true,
  execute(interaction) {
    let threadStarter = interaction.options.getUser("user", false);
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
                    value: threadStarter?.id,
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
