module.exports = {
    name: 'resetmeme',
    description: 'Resets a user\'s meme stats',
    staff:true,
    execute(message, args) {
        if (!fs.existsSync('./memeValues.json')){
            message.channel.send('`memeValues.json` doesn\'t exist.')
        }else{
            resetMember()
        }
        function resetMember(){
            const user = message.mentions.users.first() || message.author;
                memeValues = require('../memeValues.json')
                if(memeValues[`${user.id}warm`]){
                    delete memeValues[`${user.id}warm`]
                    message.channel.send( `<@${user.id}> had their meme stats reset.`);
                }else{
                    message.channel.send('No meme stats can be found this user.')
                }
        }

    },
};