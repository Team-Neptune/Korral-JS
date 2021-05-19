import {Message} from 'discord.js'
export interface Command {
  /** Command name */
  name:string,
  description:string,
  usage?:string,
  aliases?:Array<string>
  cooldown?:number,
  staffOnly:boolean,
  allowedChannels?:Array<string>,
  disallowedChannels?:Array<string>,
  execute(message:Message, args:Array<String>)
}

export interface Config {
  "prefix": Array<string>,
  "token": string,
  "botLog": string,
  "modLog": string,
  "userLog":string,
  "suspiciousWordsLog":string,
  "suspiciousWordsFilter":boolean,
  "userLogging":boolean,
  "staffRoles":Array<string>
}

declare module 'discord.js' {
    interface Client {
      commands: Collection<string, Command>
    }
}