import { BaseMessageComponentOptions, MessageActionRow, MessageActionRowOptions, OverwriteResolvable } from "discord.js";
import { config } from "../../config";
import { TicketType } from "../../typings";
import ButtonCommand from "../classes/ButtonCommand";

export default new ButtonCommand({
  customId:"staff_controls",
  checkType:"STARTS_WITH",
  staffOnly:true,
  async execute(interaction){
    let threadStarter = interaction.customId.split("staff_controls_")[1];
    let threadData = interaction.client.getSupportThreadData(threadStarter);
    let randomChars = (Math.random() + 1).toString(36).substring(7).toString();

    let components:(MessageActionRow | (Required<BaseMessageComponentOptions> & MessageActionRowOptions))[] = [
        {
            type:"ACTION_ROW",
            components:[
                {
                    "type":"BUTTON",
                    "style":"SECONDARY",
                    "customId":`collecter_${randomChars}_switch_ticket_type-${interaction.message?.id}`,
                    "label":`Toggle Ticket Type`
                },
                {
                    "type":"BUTTON",
                    "style":"SECONDARY",
                    "customId":`collecter_${randomChars}_toggle_restricted_ticket-${interaction.message?.id}`,
                    "label":`${!threadData.locked?'Restrict':'Unrestrict'} Management ${!threadData.locked?'to':'from'} ${(interaction.client.users.cache.get(threadData.locked)?.tag || threadData.locked) || interaction.user.tag}`
                }
            ]
        },
        {
            type:"ACTION_ROW",
            components:[
                {
                    "type":"BUTTON",
                    "style":"SECONDARY",
                    "customId":`collecter_${randomChars}_full_private-${interaction.message?.id}`,
                    "label":`Full Private Ticket`,
                    "disabled":threadData.externalChannelId?true:false
                }
            ]
        }
    ];

    interaction.reply({
        content:`**Staff Ticket Controls**`,
        components,
        ephemeral:true
    })


    let collector = interaction.channel.createMessageComponentCollector({
        componentType:"BUTTON",
        message:await interaction.fetchReply(),
        time:300000,
        filter(button){
            return button.user.id == interaction.user.id && button.customId.startsWith(`collecter_${randomChars}`)
        }
    })

    collector.on("collect", async (collected) => {
        if(!collected) return;
        let staffControlsMessageInteraction = collected;
        let starterMessageId = staffControlsMessageInteraction.customId.split("-")[1];
        let threadData = interaction.client.getSupportThreadData(threadStarter);
        
        // Switch to Public/Private ticket
        if(staffControlsMessageInteraction.customId.includes("switch_ticket_type")){
            let newType:TicketType;
            if(threadData.type == "PUBLIC")
                newType = "PRIVATE";
            if(threadData.type == "PRIVATE")
                newType = "PUBLIC";
            
            let res = await interaction.client.updateSupportThread({
                newType,
                userId:threadData.userId,
                threadId:threadData.threadChannelId
            })
            if(res === false){
                staffControlsMessageInteraction.update({
                    embeds:[
                        {
                            description:`Failed to update support thread data. Failed to change ticket type to ${newType == 'PUBLIC' ? "Public" : "Private"}.`,
                            color:"RED"
                        }
                    ]
                })
            }
            if(res == true){
                staffControlsMessageInteraction.update({
                    components,
                    embeds:[
                        {
                            description:`Successfully changed ticket type to ${newType == 'PUBLIC' ? "Public" : "Private"}.`,
                            color:"GREEN"
                        }
                    ]
                })
                interaction.channel.messages.cache.get(starterMessageId)?.edit({
                    content:interaction.message.content.replace(newType == "PUBLIC"?":lock: *This is a private ticket, so only staff may reply.*":":unlock: *This is a public ticket, everyone may view and reply to it..*", newType == "PRIVATE"?":lock: *This is a private ticket, so only staff may reply.*":":unlock: *This is a public ticket, everyone may view and reply to it..*")
                })
                interaction.channel?.send({
                    embeds:[
                        {
                            description:`${newType == "PUBLIC" ? ":unlock:" : ":lock:"} Ticket has been switched to a ${newType == 'PUBLIC' ? "Public" : "Private"} Ticket.`,
                            color:newType == "PUBLIC" ? "GREEN" : "RED",
                            footer:{
                                iconURL:`https://cdn.discordapp.com/avatars/${interaction.member?.user.id}/${interaction.member?.user.avatar}${interaction.member?.user.avatar.startsWith("a_")?".gif":".png"}`,
                                text:`${interaction.member?.user.username}#${interaction.member?.user.discriminator}`
                            }
                        }
                    ]
                })
            }
            return;
        }

        // Lock Ticket Management
        if(staffControlsMessageInteraction.customId.includes("toggle_restricted_ticket")){
            let locked: string | undefined;
            if(typeof threadData.locked == 'undefined')
                locked = staffControlsMessageInteraction.user?.id;
            if(typeof threadData.locked == 'string')
                locked = undefined;
            
            let res = await interaction.client.updateSupportThread({
                userId:threadData.userId,
                threadId:threadData.threadChannelId,
                locked
            })

            components[0].components = components[0].components.map(c => {
                if(c.type == "BUTTON" && c.customId.includes("toggle_restricted_ticket")){
                    c.label = `${!locked?'Restrict':'Unrestrict'} Management ${!locked?'to':'from'} ${(interaction.client.users.cache.get(locked)?.tag || locked) || interaction.user.tag}`;
                }
                return c;
            })
            
            if(res === false){
                staffControlsMessageInteraction.update({
                    embeds:[
                        {
                            description:`Failed to update support thread data. Failed to ${typeof locked == 'string'?'restrict':'unrestrict'} ticket management ${typeof locked == 'string'?'to':'from'} ${interaction.user?.tag}.`,
                            color:"RED"
                        }
                    ]
                })
            }
            if(res == true){
                staffControlsMessageInteraction.update({
                    components,
                    embeds:[
                        {
                            description:`Successfully ${typeof locked == 'string'?'restricted':'unrestricted'} ticket management ${typeof locked == 'string'?'to':'from'} ${interaction.user?.tag}.`,
                            color:"GREEN"
                        }
                    ]
                })
            }
            return;
        }

        // Open new channel
        if(staffControlsMessageInteraction.customId.includes("full_private")){
            let supportChannelId = staffControlsMessageInteraction.guild.channels.cache.get(config.supportChannelId);
            let threadChannel = staffControlsMessageInteraction.guild.channels.cache.get(threadData.threadChannelId);
            if(threadChannel.isText()){
                let staffOverrides:OverwriteResolvable[] = config.staffRoles.map((roleId) => {
                    return {
                        type:"role",
                        allow:["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY", "ATTACH_FILES", "EMBED_LINKS"],
                        id:roleId
                    }
                })

                await staffControlsMessageInteraction.deferUpdate()

                let newChannel = await supportChannelId.guild.channels.create(`Private-${threadChannel.name}`, {
                    type:"GUILD_TEXT",
                    parent:supportChannelId.parentId,
                    topic:`This channel was created by <@${interaction.user.id}> from the ticket: <#${threadData.threadChannelId}>.`,
                    reason:`${interaction.user?.tag}> from the ticket: ${threadData.threadChannelId}`
                });

                await newChannel.lockPermissions()

                await newChannel.permissionOverwrites.set([
                    ...newChannel.permissionOverwrites.cache.map(po => {
                        return {
                            id:po.id,
                            allow:po.allow,
                            deny:po.deny
                        }
                    }),
                    ...staffOverrides,
                    {
                        type:"role",
                        id:config.supportRoleId,
                        allow:["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY", "ATTACH_FILES", "EMBED_LINKS"]
                    },
                    {
                        type:"member",
                        id:threadStarter,
                        allow:["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY", "ATTACH_FILES", "EMBED_LINKS"]
                    },
                    {
                        type:"member",
                        id:interaction.client.user.id,
                        allow:["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY", "ATTACH_FILES", "EMBED_LINKS", "MANAGE_MESSAGES", "MANAGE_CHANNELS"]
                    },
                    {
                        type:"role",
                        id:staffControlsMessageInteraction.guildId,
                        deny:["VIEW_CHANNEL"]
                    }
                ])

                let res = await interaction.client.updateSupportThread({
                    externalChannelId:newChannel.id,
                    userId:threadData.userId,
                    threadId:threadData.threadChannelId
                })

                components[1].components[0].disabled = true;

                if(res == true){
                    await staffControlsMessageInteraction.editReply({
                        embeds:[
                            {
                                description:`Successfully opened external channel.`,
                                color:"GREEN"
                            }
                        ],
                        components
                    })

                    await newChannel.send({
                        content:`This channel was created by <@${interaction.user.id}> from the ticket: <#${threadData.threadChannelId}>.`,
                        components:[
                            {
                                type:"ACTION_ROW",
                                components:[
                                    {
                                        "type":"BUTTON",
                                        "style":"SECONDARY",
                                        "customId":`private_ticket_staff_controls_${threadStarter}`,
                                        "label":"Staff Controls",
                                        "emoji":"🛠"
                                    }
                                ]
                            }
                        ]
                    })
    
                    await interaction.channel?.send({
                        embeds:[
                            {
                                description:`A new channel has been opened related to this ticket, [${newChannel.name}](<https://discord.com/channels/${newChannel.guildId}/${newChannel.id}>).`,
                                color:"BLUE",
                                footer:{
                                    iconURL:`https://cdn.discordapp.com/avatars/${interaction.member?.user.id}/${interaction.member?.user.avatar}${interaction.member?.user.avatar.startsWith("a_")?".gif":".png"}`,
                                    text:`${interaction.member?.user.username}#${interaction.member?.user.discriminator}`
                                }
                            }
                        ]
                    })
                }
                
                if(res == false){
                    staffControlsMessageInteraction.editReply({
                        embeds:[
                            {
                                description:`Failed to open external channel.`,
                                color:"RED"
                            }
                        ],
                        components
                    })
                }
            }
        }
    })
  }
})