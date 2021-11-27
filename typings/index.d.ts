import {Message, Collection} from 'discord.js'
import ButtonCommand from '../src/classes/ButtonCommand'
import Command from '../src/classes/Command'
export interface MessageCommand {
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
  prefix: Array<string>,
  token: string,
  botLog: string,
  modLog: string,
  userLog:string,
  userLogging:boolean,
  staffRoles:Array<string>,
  /** The behavior of warnings (first item in array is action for the first warning) */
  warnBehavior:Array<WarnBehavior>,
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
      createSupportThread(shortDesc:string, userId:string, privateTicket:boolean):Promise<ThreadChannel>
      supportThreadExists(userId:string):boolean
      closeSupportThread(channelId:string, userId:string):Promise<ThreadChannel>
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

interface ActiveTickets {
	[userId:string]:{
		threadChannelId:string,
		userId:string,
		active:boolean
	}
}