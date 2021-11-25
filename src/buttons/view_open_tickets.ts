import { config } from "../../config";
import ButtonCommand from "../classes/ButtonCommand";

export default new ButtonCommand({
    checkType:"EQUALS",
    execute(interaction){
        interaction.guild.channels.fetchActiveThreads()
        .then(({threads:activeTickets}) => {
            activeTickets = activeTickets.filter(c => c.parentId == config.supportChannelId);
            let openTickets = {
                private:activeTickets.filter(c => c.name && c.name.startsWith("🔒")),
                public:activeTickets.filter(c => c.name && c.name.startsWith("🔓")),
                unknown:activeTickets.filter(c => c.name && (!c.name.startsWith("🔓") && !c.name.startsWith("🔒")))
            };

            const threadsAvailable = `Here are a list of active support tickets:\n${openTickets.public.size > 0?`\n**Public :unlock:**\n${openTickets.public.map(c => `<#${c.id}> (${c.name?.split(" - ")[1]})`).join("\n")}`:``}${openTickets.private.size > 0?`\n**Private :lock:**\n${openTickets.private.map(c => `<#${c.id}> (${c.name?.split(" - ")[1]})`).join("\n")}`:``}${openTickets.unknown.size >0?`\n**Unknown :grey_question:**\n${openTickets.unknown.map(c => `<#${c.id}> (${c.name?.split(" - ")[1] || c.name})`).join("\n")}`:``}`;
            const noThreadsAvailable = `❌ There are no open tickets available`;
            
            interaction.reply({
                content:activeTickets.size > 0?threadsAvailable:noThreadsAvailable,
                ephemeral:true
            });
        })
    }
})