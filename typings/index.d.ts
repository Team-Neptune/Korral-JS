import {Message, Collection} from 'discord.js'
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

type WarnAction = "NONE" | "KICK" | "BAN"

interface WarnBehavior {
  message:string,
  action:WarnAction
}

export interface Config {
  "prefix": Array<string>,
  "token": string,
  "botLog": string,
  "modLog": string,
  "userLog":string,
  "userLogging":boolean,
  "staffRoles":Array<string>,
  /** The behavior of warnings (first item in array is action for the first warning) */
  warnBehavior:Array<WarnBehavior>,
  supportChannelId:string,
  supportRoleId:string
}

declare module 'discord.js' {
    interface Client {
      commands: Collection<string, Command>
    }
}