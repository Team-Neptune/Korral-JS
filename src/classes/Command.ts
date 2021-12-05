import { CommandInteraction, MessageInteraction } from "discord.js";

class Command {
    staffOnly?:boolean
    constructor(options:Command){
        this.staffOnly = options.staffOnly;
        this.execute = options.execute;
    };
    execute(interaction:CommandInteraction){}
}
export default Command;