import { existsSync, writeFileSync } from "fs";
import r, { Connection, ConnectionOptions, WriteResult } from "rethinkdb";

export interface TicketTranscriptEntry  {
  id:string;

  ticket_channel_id:string;
  ticket_author:string;

  message_content:string;
  message_embeds?:any[];
  message_components?:any[];
  message_id:string;
  message_author_id:string;
  message_author_avatar_url:string;
  message_mentions:{
    id:string,
    name:string
  }[]
  /** Outgoing */
  message_author_name?:string;
  /** Outgoing */
  message_link?:string;
  message_deleted?:boolean;
  
  ticket_public:boolean;

  message_index?:number;
}

class Database {
  private logging: any;
  private dbConnection: Connection;
  private connectionOptions: ConnectionOptions;
  private dbConnectionSuccessful: boolean;
  constructor(options?: ConnectionOptions) {
    this.logging = {
      error: console.error,
      info: console.info,
      ready:console.log
    };
    this.connectionOptions = options;
    this.dbConnectionSuccessful = false;
    if (options) this.connectDB(options);
  }

  async connectDB(options: ConnectionOptions): Promise<boolean> {
    try {
      this.connectionOptions = options;
      r.connect(options, (err, conn) => {
        if (err) {
          this.logging.error(
            `Failed to connect to DB ${options.db || "test"} on ${
              options.host || "localhost"
            }`
          );
          this.logging.error(err);
          this.dbConnectionSuccessful = false;
          return false;
        }
        this.logging.ready(
          `DB ${options.db || "test"} ready on ${options.host || "localhost"}`
        );
        this.dbConnection = conn;
        this.dbConnectionSuccessful = true;
        // Setup Database (DB, Tables)
        this.setupDatabaseDataCheck();
      });
    } catch (err) {
      this.logging.error(err);
      return false;
    }
  }

  async reconnectDB(): Promise<boolean> {
    if (this.dbConnectionSuccessful) {
      try {
        let dbConnection = await this.dbConnection.reconnect();
        this.dbConnection = dbConnection;
        this.dbConnectionSuccessful = true;
        return true;
      } catch {
        this.dbConnectionSuccessful = false;
        return false;
      }
    } else {
      try {
        let res = await this.connectDB(this.connectionOptions);
        return res;
      } catch {
        return false;
      }
    }
  }

  async setupDatabaseDataCheck(): Promise<boolean> {
    if (existsSync("./database_created.flag")) {
      this.logging.info("Database already setup");
      return true;
    }
    let res = await this.setupDatabase();
    if (res === true) {
      this.logging.ready("Database successfully setup");
      writeFileSync("./database_created.flag", "true");
      return true;
    }
    if (res === false) {
      this.logging.error("Database failed to be setup");
      return false;
    }
  }

  // Setup (ONE TIME ONLY!)
  async setupDatabase(): Promise<boolean> {
    try {
      await r.dbCreate(this.connectionOptions.db).run(this.dbConnection);
      await r
        .db(this.connectionOptions.db)
        .tableCreate("ticket_transcripts")
        .run(this.dbConnection);
      return true;
    } catch (err) {
      this.logging.error(err);
      return false;
    }
  }

  async addTicketData(ticketDetails:TicketTranscriptEntry):Promise<boolean> {
    try {
      let currentCount = await r.db(this.connectionOptions.db)
      .table("ticket_transcripts")
      .filter({ticket_channel_id:ticketDetails.ticket_channel_id})
      .count()
      .run(this.dbConnection);
      ticketDetails.message_index = currentCount;
      console.log("ticketDetails", ticketDetails)
      let res = await r
        .db(this.connectionOptions.db)
        .table("ticket_transcripts")
        .insert(ticketDetails)
        .run(this.dbConnection);
      if (res.errors > 0) return false;
      return true;
    } catch (err) {
      this.logging.error(err);
      throw err;
    }
  }

  // NOT READY
  private async editTicketMessageData(ticketDetails:TicketTranscriptEntry):Promise<boolean> {
    try {
      let res = await r
        .db(this.connectionOptions.db)
        .table("ticket_transcripts")
        .get(ticketDetails.id)
        .update({})
        .run(this.dbConnection);
        console.log(res)
      if (res.errors > 0) return false;
      return true;
    } catch (err) {
      this.logging.error(err);
      throw err;
    }
  }

  async removeTicketMessageData(messageId:string):Promise<boolean> {
    try {
      if(!messageId)
      throw "Missing messageId"
      let res = await r
        .db(this.connectionOptions.db)
        .table("ticket_transcripts")
        .get(messageId)
        .update({
          message_content:"",
          message_deleted:true,
          message_mentions:[],
          message_author_avatar_url:"",
          message_embeds:[],
          message_components:[]
        })
        .run(this.dbConnection);
        console.log(res)
      if (res.errors > 0) return false;
      return true;
    } catch (err) {
      this.logging.error(err);
      throw err;
    }
  }

  async getTicketTranscript(channelId:string):Promise<TicketTranscriptEntry[]> {
    try {
      let res = await r
        .db(this.connectionOptions.db)
        .table("ticket_transcripts")
        .filter({ticket_channel_id:channelId})
        .run(this.dbConnection);
      let json = await res.toArray()
      json = json.sort()
      console.log(json)
      return json;
    } catch (err) {
      this.logging.error(err);
      throw err;
    }
  }
}

export default Database;
