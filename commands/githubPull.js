module.exports = {
  name: 'gitpull',
  aliases: ['pull'],
  description: 'Pulls latest files for the bot from GitHub.',
  mod:true,
  botmanager:true,
  essential:true,
	execute(message, args, client) {
      try {
        const { exec } = require("child_process");
        exec("git pull", (error, stdout, stderr) => {
          respond('', `\`\`\`stdout:\n${stdout}\n\nstderr:\n${stderr}\n\nerror:\n${error}\`\`\``, message.channel)
      });      
    }catch(error) {
    respond('Error', 'Something went wrong.\n'+error+`\nMessage: ${message}\nArgs: ${args}\n`, message.channel)
    errorlog(error)
    // Your code broke (Leave untouched in most cases)
    console.error('an error has occured', error);
    }
    }}