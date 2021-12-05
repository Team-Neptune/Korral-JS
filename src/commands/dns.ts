import Command from "../classes/Command";

export default new Command({
    execute(interaction){
        interaction.reply({
            content:"**90DNS**:\n**1st IP**: `207.246.121.77`\n**2nd IP**: `163.172.141.219`\n\n**Aquaticdns**:\n**1st IP**: `3.22.16.243`\n**2nd IP**: `207.246.121.77`\n\n**Note**: You will need to setup the DNS IPs on each network you connect to."
        })
    }
})
