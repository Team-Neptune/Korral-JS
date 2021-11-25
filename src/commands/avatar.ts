import Command from "../classes/Command";

export default new Command({
    execute(interaction){
      const user = interaction.options.getUser("user", false)
      const size = interaction.options.getString("size", false)
      const gif = interaction.options.getBoolean("gif", false)
      const avatarURL = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${gif && user.avatar.startsWith("a_") ? "gif" : "webp"}?size=${size}`
      if (user.avatar == null) {
        return interaction.reply({
            content:"This user doesn't have an avatar."
        })
      }
      interaction.reply({
          content:avatarURL,
          components:[
            {
              type:1,
              components:[
                {
                  type:2,
                  style:5,
                  url:avatarURL,
                  label:"Open in browser"
                }
              ]
            }
          ]
      })
    }
})