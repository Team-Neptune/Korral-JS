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
  /** List of channel IDs to not record message logs */
  modLogBlacklisted?: string[]
  /** Logs of Member Join/Leave  */
  userLog:string,
  /** Member Join/Leave enabled? */
  userLogging:boolean,
  /** Staff command usage logged to Config.modLog */
  staffCommandLogging?:boolean
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
  /** Where to send messages quoted using the 'Quote Message' CTX command */
  messageQuoteChannelId?:string,
  /** Prompt displayed before opening a ticket */
  openingTicketPrompt?:{
    /** Prompt enabled */
    enabled:boolean,
    /** Message to show before opening a ticket */
    message:string
  },
  closingTicketsSettings?:{
    /** Minimum amount of seconds the ticket has to be open before it can be closed */
    ticketsMinimumAge?:number,
    /** Message to be sent when ticket is closed */
    closeMessage?:string
  }
  /** Location of warnings.json */
  warningJsonLocation:string
  /** Location of userNotes.json */
  noteJsonLocation:string
  /** Guild ID for setting up application commands */
  testingGuildId?:string
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
      updateSupportThread(options:{userId:string, threadId:string, newType?:TicketType, newName?:string}):Promise<boolean>
      closeSupportThread(options:{
        userId:string,
        channelId?:string,
        noApi?:boolean
      }):Promise<ThreadChannel>
    }
}


type SDLayoutOS = "win" | "macos"

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

type TicketType = "PUBLIC" | "PRIVATE"

interface ActiveTicketsData {
  threadChannelId:string,
  userId:string,
  active:boolean,
  createdMs:number,
  type:TicketType
}

interface ActiveTickets {
	[userId:string]:ActiveTicketsData
}