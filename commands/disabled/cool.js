module.exports = {
    name: 'cool',
    description: 'Cools the user',
    execute(message, args) {
        if (!fs.existsSync('./memeValues.json')){
            fs.writeFileSync('./memeValues.json', '{}')
            coolMember()
        }else{
            coolMember()
        }
        function coolMember(){
            const user = message.mentions.users.first() || message.author;
                memeValues = require('../memeValues.json')
                if(!memeValues[`${user.id}warm`]){
                    memeValues[`${user.id}warm`] =  Math.ceil(Math.random() * -80)
                    fs.writeFile('./memeValues.json', JSON.stringify(memeValues), (err) => {
                        if(err)console.log(err)
                    })
                }else{
                    memeValues[`${user.id}warm`] = memeValues[`${user.id}warm`] - Math.ceil(Math.random() * 80)
                    fs.writeFile('./memeValues.json', JSON.stringify(memeValues), (err) => {
                        if(err)console.log(err)
                    })
                }
                message.channel.send( `<@${user.id}> ` + 'cooled. User is now ' + memeValues[`${user.id}warm`] + `°C (${Math.ceil((memeValues[`${user.id}warm`] * 1.8)+32)}°F, ${Math.ceil((memeValues[`${user.id}warm`] + 273.15))}K)`);
        }

    },
};