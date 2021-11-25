import {exec} from 'child_process'
import { MessageCommand } from '../../typings';
export const botCommands:MessageCommand[] = [
    {
        name: 'gitpull',
        aliases: ['pull'],
        description: 'Pulls latest files for the bot from GitHub.',
        staffOnly:true,
        execute(message, args) {
            exec("git pull", (error, stdout, stderr) => {
                message.channel.send(`\`\`\`stdout:\n${stdout}\n\nstderr:\n${stderr}\n\nerror:\n${error}\`\`\``)
            });      
        }
    },
    {
        name: 'restart',
        description: 'Restart the bot',
        aliases: ['kill', 'reboot', 'die'],
        staffOnly:true,
        execute(message, args){
            message.channel.send('Bye! :wave:')      
            setTimeout(function(){ 
                process.exit()
            }, 3000);
        }
    }
]