import { ColorResolvable, MessageEmbed, TextChannel } from "discord.js";
import { config } from "../../config";
import Command from "../classes/Command";
export default new Command({
  staffOnly:true,
  commandName:"review_me",
  subCommandGroup:"mod",
  async execute(interaction){
    let randomChars = (Math.random() + 1).toString(36).substring(7).toString();
    let mentionedUser = interaction.options.getUser("user")
    let reasonForReview = interaction.options.getString("reason")
    const embed = new MessageEmbed()
    .setTitle("Review Requested")
    .setDescription(reasonForReview)
    .setFooter(`Review requested from ${interaction.user.tag}`, interaction.user.displayAvatarURL({dynamic:true}))
    await interaction.reply({content:`<@${mentionedUser.id}>`, embeds:[embed], components:[{type:"ACTION_ROW", components:[
      {type:"BUTTON", style:"DANGER", customId:`collecter_${randomChars}_review_1`, label:"1"},
      {type:"BUTTON", style:"SECONDARY", customId:`collecter_${randomChars}_review_2`, label:"2"},
      {type:"BUTTON", style:"SECONDARY", customId:`collecter_${randomChars}_review_3`, label:"3"},
      {type:"BUTTON", style:"SECONDARY", customId:`collecter_${randomChars}_review_4`, label:"4"},
      {type:"BUTTON", style:"SUCCESS", customId:`collecter_${randomChars}_review_5`, label:"5"},
    ]}]})
    let fetchedReply = await interaction.fetchReply();
    let collector = interaction.channel.createMessageComponentCollector({
      componentType:"BUTTON",
      message:fetchedReply,
      time:300000,
      max:1,
      filter(button){
          return button.user.id == mentionedUser.id && button.customId.startsWith("collecter")
      }
  })

  collector.on("end", async (collected) => {
    if(!collected?.first()){
      interaction.editReply({
        components:[
          {
            type:"ACTION_ROW",
            components:[
              {type:"BUTTON", style:"DANGER", customId:`collecter_${randomChars}_review_1`, label:"1", disabled:true},
              {type:"BUTTON", style:"SECONDARY", customId:`collecter_${randomChars}_review_2`, label:"2", disabled:true},
              {type:"BUTTON", style:"SECONDARY", customId:`collecter_${randomChars}_review_3`, label:"3", disabled:true},
              {type:"BUTTON", style:"SECONDARY", customId:`collecter_${randomChars}_review_4`, label:"4", disabled:true},
              {type:"BUTTON", style:"SUCCESS", customId:`collecter_${randomChars}_review_5`, label:"5", disabled:true},
            ]
          }
        ]
      })
      return;
    };
    let selected = collected.first();
    let reviewNum = selected.customId.split(`collecter_${randomChars}_review_`)[1];
    let reviewColor:ColorResolvable;
    switch (reviewNum) {
      case "1":
        reviewColor = "RED"
        break;
      case "2":
      case "3":
      case "4":
        reviewColor = "YELLOW"
        break;
      case "5":
        reviewColor = "GREEN"
        break;
      default:
        reviewColor = "WHITE"
        break;
    }
    selected.update({
      components:[
        {
          type:"ACTION_ROW",
          components:[
            {type:"BUTTON", style:"DANGER", customId:`collecter_${randomChars}_review_1`, label:"1", disabled:true},
            {type:"BUTTON", style:"SECONDARY", customId:`collecter_${randomChars}_review_2`, label:"2", disabled:true},
            {type:"BUTTON", style:"SECONDARY", customId:`collecter_${randomChars}_review_3`, label:"3", disabled:true},
            {type:"BUTTON", style:"SECONDARY", customId:`collecter_${randomChars}_review_4`, label:"4", disabled:true},
            {type:"BUTTON", style:"SUCCESS", customId:`collecter_${randomChars}_review_5`, label:"5", disabled:true},
          ]
        }
      ],
      embeds:[
        embed,
        {
          description:`**Thanks for the *${reviewNum.toString()}* review, <@${selected.user.id}>**`,
          color:reviewColor
        }
      ]
    })
    if(config.closingTicketsSettings?.incomingFeedbackChannel){
      (interaction.client.channels.cache.get(config.closingTicketsSettings?.incomingFeedbackChannel) as TextChannel).send({
        embeds:[
          {
            title:"Reviewer",
            description:`<@${interaction.user.id}> received a **${reviewNum}** review from <@${selected.user.id}>`,
            color:reviewColor
          },
          {
            title:"Review Question",
            description:`>>> ${reasonForReview}`,
            color:reviewColor
          },
          
        ],
        components:[
          {
            type:"ACTION_ROW",
            components:[
              {
                type:"BUTTON",
                style:"LINK",
                label:"Jump to Context",
                url:`https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${fetchedReply.id}`
              }
            ]
          }
        ]
      })
    }
  })
  }
})