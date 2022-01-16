import { CommandInteraction, MessageInteraction } from "discord.js";

class Command {
    staffOnly?:boolean
    commandName?:string
    subCommandGroup?:string
    constructor(options:Command){
        this.staffOnly = options.staffOnly;
        this.subCommandGroup = options.subCommandGroup;
        this.commandName = options.commandName;
        this.execute = options.execute;
    };
    execute(interaction:CommandInteraction){}
}
export default Command;