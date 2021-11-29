import {Message, Collection} from 'discord.js'
import ButtonCommand from '../src/classes/ButtonCommand'
import Command from '../src/classes/Command'
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
  token: string,
  botLog: string,
  modLog: string,
  userLog:string,
  userLogging:boolean,
  staffRoles:Array<string>,
  /** The behavior of warnings (first item in array is action for the first warning) */
  warnBehavior:WarnBehavior[],
  supportChannelId:string,
  supportRoleId:string,
  bitly_token?:string
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
  active:boolean
}

interface ActiveTickets {
	[userId:string]:ActiveTicketsData
}