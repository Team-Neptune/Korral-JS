import Command from "../classes/Command";
export default new Command({
    commandName:"purge",
    subCommandGroup:"mod",
    staffOnly:true,
    async execute(interaction){
        let deleteNum = interaction.options.getNumber("amount");
        if(deleteNum > 99 || deleteNum < 1)
            return interaction.reply({
                content:`You must have a value of 1-99`,
                ephemeral:true
            });
        await interaction.deferReply({ephemeral:true})
        try {
            let channel = interaction.guild.channels.cache.get(interaction.channelId)
            if(channel.isText()){
                await channel.bulkDelete(deleteNum)
                return interaction.editReply({
                    content:`Successfully deleted ${deleteNum.toString()} messages from <#${channel.id}>`
                })
            }
            interaction.editReply({
                content:`Invalid channel type (${channel.type.toString()})`
            })
        } catch {
            interaction.editReply({
                content:"Something went wrong. Try again later."
            })
        }
    }
})
