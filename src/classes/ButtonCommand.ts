import { ButtonInteraction } from "discord.js";

type CustomIdCheckType = "STARTS_WITH" | "EQUALS"
class ButtonCommand {
    customId:string
    checkType:CustomIdCheckType
    constructor(options:ButtonCommand){
        this.customId = options.checkType;
        this.checkType = options.checkType;
        this.execute = options.execute;
    };
    execute(interaction:ButtonInteraction){}
}
export default ButtonCommand;