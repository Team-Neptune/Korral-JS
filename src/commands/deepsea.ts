import Command from "../classes/Command";
import DeepSea from "../deepsea"

export default new Command({
    execute(interaction){
      let deepsea = new DeepSea()
      let releases = deepsea.get()
      let fields = [
        {
          "name":"Version",
          "value":`[${releases[0].latestTag}](<https://github.com/Team-Neptune/DeepSea/releases/tag/${releases[0].latestTag}>)`,
          "inline":true
        },
        {
          "name":"Released",
          "value":`<t:${new Date(releases[0].releaseDate).getTime()/1000}:D>`,
          "inline":true
        },
        {
          "name":"Total downloads",
          "value":`${deepsea.getTotalDownloads()}`,
          "inline":true
        },
        {
          "name": "\u200B",
          "value": "\u200B"
        }
      ]
      releases.forEach((e) => {
        fields.push({name:`${e.name.split(".")[0]}`, value:`[Download](<https://github.com/Team-Neptune/DeepSea/releases/download/${e.latestTag}/${e.name}>)`, inline:false})
      })
      fields.push({
        "name":"\u200B",
        "value":`[What is DeepSea?](https://github.com/Team-Neptune/DeepSea#readme)\n`
      })
      // Disabled until uptime reliability increases
      // fields.push({
      //   "name":"Custom package",
      //   'value':"[Build your own DeepSea package](https://builder.teamneptune.net)",
      //   "inline":false
      // })
      interaction.reply({
          embeds:[
              {
                  title:"Get Deepsea",
                  color:1084877,
                  fields:fields,
                  footer: {
                    text: "Data last fetched",
                  },
                  timestamp: new Date(deepsea.getLastFetched())
              }
          ]
      })
    }
})