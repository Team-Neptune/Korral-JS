import {MessageEmbed} from 'discord.js'
import {Command} from '../../typings'
import {writeFileSync, existsSync} from 'fs'
export const memeCommands:Array<Command> = [
    {
        name: 'eggsfat',
        description: 'Yes',
        staffOnly:false,
        execute(message, args) {
            const embed = new MessageEmbed()
            .setURL('https://en.wikipedia.org/wiki/Egg')
            .setThumbnail('https://cdn.vox-cdn.com/thumbor/TGJMIRrhzSrTu1oEHUCVrizhYn0=/1400x1400/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/13689000/instagram_egg.jpg')
            .setTitle('🥚')
            .setDescription('🥚 🥚🥚🥚🥚🥚🥚 🥚🥚🥚🥚 🥚🥚🥚 🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚 🥚🥚 🥚🥚🥚🥚🥚 🥚🥚🥚🥚 🥚🥚🥚🥚 🥚🥚 🥚🥚🥚🥚🥚 🥚🥚 🥚🥚🥚🥚🥚🥚🥚🥚')
            message.channel.send({content:'🥚🥚🥚 🥚🥚🥚🥚🥚 🥚🥚🥚🥚🥚🥚🥚 🥚🥚🥚🥚🥚 🥚🥚🥚🥚 🥚🥚🥚 🥚🥚🥚🥚🥚🥚 🥚🥚🥚 🥚🥚🥚🥚 🥚🥚🥚🥚🥚 \n 🥚🥚 🥚🥚🥚🥚🥚🥚🥚 🥚🥚 🥚🥚🥚🥚🥚 🥚🥚🥚 🥚🥚🥚🥚🥚🥚🥚🥚 🥚🥚🥚🥚 🥚🥚🥚🥚🥚 🥚🥚🥚🥚 🥚🥚🥚🥚🥚🥚 \n 🥚🥚🥚🥚🥚🥚 🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚 🥚🥚 🥚🥚🥚🥚 🥚🥚 🥚🥚🥚🥚 🥚🥚 🥚🥚🥚🥚 🥚🥚 🥚🥚🥚🥚🥚🥚🥚🥚 \n 🥚🥚🥚 🥚🥚🥚🥚🥚🥚 🥚🥚 🥚🥚 🥚🥚🥚🥚🥚🥚 🥚🥚 🥚🥚🥚🥚🥚🥚🥚🥚 🥚🥚 🥚🥚🥚🥚 🥚🥚 🥚🥚🥚🥚 🥚🥚 \n 🥚🥚🥚🥚 🥚🥚🥚🥚 🥚🥚🥚🥚 🥚🥚 🥚🥚🥚🥚 🥚🥚🥚 🥚🥚🥚 🥚🥚🥚 🥚🥚🥚🥚🥚🥚 🥚🥚🥚🥚🥚 🥚🥚🥚🥚 \n 🥚🥚🥚 🥚🥚🥚🥚🥚🥚🥚🥚 🥚🥚🥚🥚🥚🥚 🥚🥚🥚🥚🥚 🥚🥚🥚🥚🥚🥚🥚 🥚🥚🥚 🥚🥚🥚 🥚🥚🥚 🥚 🥚🥚🥚🥚 \n 🥚🥚🥚🥚 🥚🥚🥚🥚🥚🥚🥚🥚🥚 🥚🥚 🥚🥚🥚🥚🥚🥚 🥚🥚🥚', embeds:[embed]})
        },
    },
    {
		name: 'eta',
		description: '@tomger eta wen',
		staffOnly: false,
		execute(message, args) {
			const messages = [
				'Soon:tm:',
				'June 15th',
				'Germany',
				'jelbrek wil lunch tomorrr',
				':egg:',
			]
			const index = Math.floor(Math.random() * messages.length)
			const msg = messages[index]
			message.channel.send(msg+`${message.guild.id == "703301751171973190"?`\n*Note: ${message.guild.name} has a slash command version of this command available. Eventually, support for the non-slash command version may be removed.*`:""}`)
	    }
    },
    {
        name: 'shrek',
        description: 'Yes',
        staffOnly:false,
        execute(message, args) {
            message.channel.send('⢀⡴⠑⡄⠀⠀⠀⠀⠀⠀⠀⣀⣀⣤⣤⣤⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ \n⠸⡇⠀⠿⡀⠀⠀⠀⣀⡴⢿⣿⣿⣿⣿⣿⣿⣿⣷⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀ \n⠀⠀⠀⠀⠑⢄⣠⠾⠁⣀⣄⡈⠙⣿⣿⣿⣿⣿⣿⣿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀ \n⠀⠀⠀⠀⢀⡀⠁⠀⠀⠈⠙⠛⠂⠈⣿⣿⣿⣿⣿⠿⡿⢿⣆⠀⠀⠀⠀⠀⠀⠀ \n⠀⠀⠀⢀⡾⣁⣀⠀⠴⠂⠙⣗⡀⠀⢻⣿⣿⠭⢤⣴⣦⣤⣹⠀⠀⠀⢀⢴⣶⣆ \n⠀⠀⢀⣾⣿⣿⣿⣷⣮⣽⣾⣿⣥⣴⣿⣿⡿⢂⠔⢚⡿⢿⣿⣦⣴⣾⠁⠸⣼⡿ \n⠀⢀⡞⠁⠙⠻⠿⠟⠉⠀⠛⢹⣿⣿⣿⣿⣿⣌⢤⣼⣿⣾⣿⡟⠉⠀⠀⠀⠀⠀ \n⠀⣾⣷⣶⠇⠀⠀⣤⣄⣀⡀⠈⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀ \n⠀⠉⠈⠉⠀⠀⢦⡈⢻⣿⣿⣿⣶⣶⣶⣶⣤⣽⡹⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀ \n⠀⠀⠀⠀⠀⠀⠀⠉⠲⣽⡻⢿⣿⣿⣿⣿⣿⣿⣷⣜⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀ \n⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣷⣶⣮⣭⣽⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀ \n⠀⠀⠀⠀⠀⠀⣀⣀⣈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀⠀⠀⠀⠀⠀ \n⠀⠀⠀⠀⠀⠀⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀ \n⠀⠀⠀⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀ \n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠻⠿⠿⠿⠿⠛⠉');
        }
    },
    {
        name: 'warm',
        description: 'warms the user',
        staffOnly:false,
        execute(message, args) {
            if (!existsSync('./memeValues.json'))
                writeFileSync('./memeValues.json', '{}')
            const user = message.mentions.users.first() || message.author;
            let memeValues = require('../memeValues.json')
            if(!memeValues[`${user.id}warm`])
                memeValues[`${user.id}warm`] =  Math.ceil(Math.random() * 80)
            memeValues[`${user.id}warm`] = memeValues[`${user.id}warm`] + Math.ceil(Math.random() * 80)
            writeFileSync('./memeValues.json', JSON.stringify(memeValues))
            message.channel.send( `<@${user.id}> ` + 'warmed. User is now ' + memeValues[`${user.id}warm`] + `°C (${Math.ceil((memeValues[`${user.id}warm`] * 1.8)+32)}°F, ${Math.ceil((memeValues[`${user.id}warm`] + 273.15))}K)`);
        }
    }
]