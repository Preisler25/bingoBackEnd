import { TDbConfig } from "types/type_db_config";
import { Client, connect } from "ts-postgres";

export class DbService {
  private static db_config: TDbConfig = {
    host: process.env.DB_HOST || "bingo-db",
    port: parseInt(process.env.DB_PORT || "5431"),
    database: process.env.POSTGRES_DB || "alma",
    user: process.env.POSTGRES_USER || "alma",
    password: process.env.POSTGRES_PASSWORD || "alma",
  };

  private static client: Client;

  public static async init() {
    await this.connectToDB();
    console.log("Database service initialized");
  }

  private static async connectToDB() {
    try {
      const client = await connect({
        host: this.db_config.host,
        port: this.db_config.port,
        database: this.db_config.database,
        user: this.db_config.user,
        password: this.db_config.password,
      });
      this.client = client;
      console.log("Connected to the database");
    } catch (error) {
      console.error("Error connecting to the database:", error);
    }
  }

  public static async query(query: string, params?: any[]) {
    try {
      if (!this.client) {
        await this.connectToDB();
      }
      if (params) {
        const result = await this.client.query(query, params);
        return result;
      }
      const result = await this.client.query(query);
      return result;
    } catch (error) {
      console.error("Error executing query:", error);
    }
  }

  static [Symbol.dispose]() {
    console.log("Disposing the database connection");
    this.client.end();
  }
}
