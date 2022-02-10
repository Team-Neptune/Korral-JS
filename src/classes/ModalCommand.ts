import { Client } from "discord.js";

class ModalCommand {
    customId:string
    staffOnly?:boolean
    constructor(options:ModalCommand){
        this.customId = options.customId;
        this.staffOnly = options.staffOnly;
        /** Until d.js properly implements Modals, raw payload is used + client second arg */
        this.execute = options.execute;
    };
    /** Until d.js properly implements Modals, raw payload is used + client second arg */
    execute(interaction:any, client:Client){}
}
export default ModalCommand;