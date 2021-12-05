import { ButtonInteraction, ContextMenuInteraction } from "discord.js";

class ContextMenuCommand {
    commandName:string
    staffOnly?:boolean
    constructor(options:ContextMenuCommand){
        this.commandName = options.commandName;
        this.staffOnly = options.staffOnly;
        this.execute = options.execute;
    };
    execute(interaction:ContextMenuInteraction){}
}
export default ContextMenuCommand;