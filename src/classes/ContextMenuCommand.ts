import { ButtonInteraction, ContextMenuInteraction } from "discord.js";

class ContextMenuCommand {
    commandName:string
    constructor(options:ContextMenuCommand){
        this.commandName = options.commandName;
        this.execute = options.execute;
    };
    execute(interaction:ContextMenuInteraction){}
}
export default ContextMenuCommand;