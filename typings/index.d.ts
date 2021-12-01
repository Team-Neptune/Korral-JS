import {Message, Collection} from 'discord.js'
import ButtonCommand from '../src/classes/ButtonCommand'
import Command from '../src/classes/Command'
import ContextMenuCommand from '../src/classes/ContextMenuCommand'
export interface MessageCommand {
  /** Command name */
  name:string,
  description:string,
  usage?:string,
  aliases?:string[]
  cooldown?:number,
  staffOnly:boolean,
  allowedChannels?:string[],
  disallowedChannels?:string[],
  execute(message:Message, args:string[])
}

type WarnAction = "NONE" | "KICK" | "BAN"

interface WarnBehavior {
  message:string,
  action:WarnAction
}

export interface Config {
  /** (Message Commands: Deprecated) Prefix for using text-based commands */
  prefix: string[],
  /** Discord bot token */
  token: string,
  /** Bot errors/startup logs */
  botLog: string,
  /** Logs of Message Edits/Deletes */
  modLog: string,
  /** Logs of Member Join/Leave  */
  userLog:string,
  /** Member Join/Leave enabled? */
  userLogging:boolean,
  /** Role IDs that can use staff only commands */
  staffRoles:string[],
  /** The behavior of warnings (first item in array is action for the first warning) */
  warnBehavior:WarnBehavior[],
  /** Tickets: Channel where to start tickets */
  supportChannelId:string,
  /** Tickets: Role to be pinged when new ticket is open*/
  supportRoleId:string,
  /** bit.ly token for /lmgtfy command */
  bitly_token?:string,
  /** Message to be sent when ticket is closed */
  ticketCloseMessage?:string
}

export interface GitHubRelease {
  tag_name:string,
  published_at:Date,
  assets:any
}


export interface DeepseaDb {
  lastFetchDate:number,
  releaseApi:GitHubRelease[]
}

declare module 'discord.js' {
    interface Client {
      commands: Collection<string, Command>
      messageCommands: Collection<string, MessageCommand>
      buttonCommands: Collection<string, ButtonCommand>
      ctxCommands: Collection<string, ContextMenuCommand>,
      createSupportThread(options:{
        shortDesc:string,
        userId:string,
        privateTicket:boolean
      }):Promise<ThreadChannel>
      getSupportThreadData(userId:string):ActiveTicketsData
      closeSupportThread(options:{
        userId:string,
        channelId?:string,
        noApi?:boolean
      }):Promise<ThreadChannel>
    }
}


type SDLayoutOS = "win10" | "winxp" | "macos" | "mint20"

interface ThreadSettings {
	ownerId:string
}

interface PrivateThreadSettings extends ThreadSettings {
	authorizedUsers:string[],
	authorizedRoles:string[]
}

interface PublicThread {
	[threadId:string]:ThreadSettings
}

interface PrivateThread {
	[threadId:string]:PrivateThreadSettings
}

interface ActiveTicketsData {
  threadChannelId:string,
  userId:string,
  active:boolean,
  createdMs:number
}

interface ActiveTickets {
	[userId:string]:ActiveTicketsData
}