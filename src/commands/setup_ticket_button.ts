import { TextChannel } from "discord.js";
import { config } from "../../config";
import Command from "../classes/Command";

export default new Command({
    commandName:"setup",
    subCommandGroup:"tickets",
    execute(interaction){
        interaction.reply({
            "content":`Ready to open tickets from <#${config.supportChannelId}>`,
            "ephemeral":true
        }).then(() => {
            (interaction.client.channels.cache.get(config.supportChannelId) as TextChannel).send({
                content:"**Ticket System**\n\nBefore opening a ticket, use the Discord search bar and add the `in: support` filter to look for your issue + answer.\nIf you cant find the solution to your problem, click the **Open Ticket** button below.\n\n**Want to help others?**\nClick the \"*View Open Tickets*\" button below and look under the **Public** :unlock: tickets. Feel free to view any thread, but please only join a thread if you intend to provide support.",
                components:[
                    {
                        type:1,
                        components:[
                            {
                                "customId":`open_ticket_prompt`,
                                "label":"Open Ticket",
                                "type":2,
                                "style":2,
                                "emoji":"🎟"
                            },
                            // {
                            //     "customId":`open_private_ticket`,
                            //     "label":"Open Private Ticket",
                            //     "type":2,
                            //     "style":2,
                            //     "emoji":"🔒"
                            // },
                            {
                                "customId":`view_open_tickets`,
                                "label":"View Open Tickets",
                                "type":2,
                                "style":1,
                                "emoji":"🗒️"
                            }
                        ]
                    }
                ]
            })
        })
    }
})
