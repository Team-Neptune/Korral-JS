module.exports = {
    name: 'warm',
    description: 'warms the user',
    execute(message, args) {
        if (!fs.existsSync('./memeValues.json')){
            fs.writeFileSync('./memeValues.json', '{}')
            warmMember()
        }else{
            warmMember()
        }
        function warmMember(){
            const user = message.mentions.users.first() || message.author;
                memeValues = require('../memeValues.json')
                if(!memeValues[`${user.id}warm`]){
                    memeValues[`${user.id}warm`] =  Math.ceil(Math.random() * 80)
                }else{
                    memeValues[`${user.id}warm`] = memeValues[`${user.id}warm`] + Math.ceil(Math.random() * 80)
                    fs.writeFile('./memeValues.json', JSON.stringify(memeValues), (err) => {
                        if(err)console.log(err)
                    })
                }
                message.channel.send( `<@${user.id}> ` + 'warmed. User is now ' + memeValues[`${user.id}warm`] + `°C (${Math.ceil((memeValues[`${user.id}warm`] * 1.8)+32)}°F, ${Math.ceil((memeValues[`${user.id}warm`] + 273.15))}K)`);
        }

    },
};