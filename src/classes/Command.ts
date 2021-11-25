import { CommandInteraction, MessageInteraction } from "discord.js";

class Command {
    constructor(options:Command){
        this.execute = options.execute;
    };
    execute(interaction:CommandInteraction){}
}
export default Command;