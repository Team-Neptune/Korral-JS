module.exports = {
    name:"es",
    description: 'Shows helpful patch stuff',
    aliases: ['patches'],
    execute(message, args, client){
        const config = require('../config.json')
        if(!args[0]){
            message.channel.send(`For pirated eshop-games you need ES signature patches. As their only purpose is to allow piracy we're not providing any help with installation of said patches or pirated games afterwards`)
        }else if(args[0] == '--yes' && message.member.roles.cache.some(role => config.staffRoles.includes(role.id))){
            message.channel.send(`Patches? You want 🩹?  Ohhhhhh you mean you want like the patches patches that patch stuff for switch.. hmmmmmmmm 🤔 why do u need these patches.. idc, or do i.... 🤷‍♂️ ok kbye i guess`)
        }else if(args[0] == '--hax' && message.member.roles.cache.some(role => config.staffRoles.includes(role.id)))[
            message.channel.send(`:canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: :canned_food: `)
        ]
    }
}