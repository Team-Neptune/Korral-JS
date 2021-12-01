import { ButtonInteraction } from "discord.js";

type CustomIdCheckType = "STARTS_WITH" | "EQUALS"
class ButtonCommand {
    customId:string
    checkType:CustomIdCheckType
    staffOnly?:boolean
    constructor(options:ButtonCommand){
        this.customId = options.customId;
        this.checkType = options.checkType;
        this.staffOnly = options.staffOnly;
        this.execute = options.execute;
    };
    execute(interaction:ButtonInteraction){}
}
export default ButtonCommand;