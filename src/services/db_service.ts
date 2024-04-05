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
    await this.createBaseTables();
  }

  /*
    Depending on the game, we need a 3x3, 4x4 or 5x5 grid. In the grid, we have the events

    User
    - id (primary key)
    - username (unique)
    - password (hashed)
    - win_count (default 0)

    EventTable
    - id (primary key)
    - event_name (unique)

    GameTable (3x3)
    - user_id (foreign key)
    - user_event_id_1 (foreign key)
    - user_event_id_2 (foreign key)
    - user_event_id_3 (foreign key)
    - user_event_id_4 (foreign key)
    - user_event_id_5 (foreign key)
    - user_event_id_6 (foreign key)
    - user_event_id_7 (foreign key)
    - user_event_id_8 (foreign key)
    - user_event_id_9 (foreign key)

    GameTable (4x4)
    - user_id (foreign key)
    - user_event_id_1 (foreign key)
    - user_event_id_2 (foreign key)
    - user_event_id_3 (foreign key)
    - user_event_id_4 (foreign key)
    - user_event_id_5 (foreign key)
    - user_event_id_6 (foreign key)
    - user_event_id_7 (foreign key)
    - user_event_id_8 (foreign key)
    - user_event_id_9 (foreign key)
    - user_event_id_10 (foreign key)
    - user_event_id_11 (foreign key)
    - user_event_id_12 (foreign key)
    - user_event_id_13 (foreign key)
    - user_event_id_14 (foreign key)
    - user_event_id_15 (foreign key)
    - user_event_id_16 (foreign key)

    GameTable (5x5)
    - user_id (foreign key)
    - user_event_id_1 (foreign key)
    - user_event_id_2 (foreign key)
    - user_event_id_3 (foreign key)
    - user_event_id_4 (foreign key)
    - user_event_id_5 (foreign key)
    - user_event_id_6 (foreign key)
    - user_event_id_7 (foreign key)
    - user_event_id_8 (foreign key)
    - user_event_id_9 (foreign key)
    - user_event_id_10 (foreign key)
    - user_event_id_11 (foreign key)
    - user_event_id_12 (foreign key)
    - user_event_id_13 (foreign key)
    - user_event_id_14 (foreign key)
    - user_event_id_15 (foreign key)
    - user_event_id_16 (foreign key)
    - user_event_id_17 (foreign key)
    - user_event_id_18 (foreign key)
    - user_event_id_19 (foreign key)
    - user_event_id_20 (foreign key)
    - user_event_id_21 (foreign key)
    - user_event_id_22 (foreign key)
    - user_event_id_23 (foreign key)
    - user_event_id_24 (foreign key)
    - user_event_id_25 (foreign key)

    We have to implement the following methods:
    - createUser(username, password)
    - createEvent(eventName)
    - createGame(user_id, event_ids)
    - getGame(user_id)
    - getGames()
    - updateWinCount(user_id)
    - deleteGame(user_id)
    - deleteUser(user_id)
    - deleteEvent(event_id)

    */

  private static async createBaseTables() {
    this.query(`
        CREATE TABLE IF NOT EXISTS "users" (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          win_count INT DEFAULT 0
          );
    `);
    this.query(`
            CREATE TABLE IF NOT EXISTS "event_table" (
            id SERIAL PRIMARY KEY,
            event VARCHAR(255) UNIQUE NOT NULL
        );
    `);
  }

  public static async createGameTable(table_size: number) {
    let query = `
        CREATE TABLE IF NOT EXISTS "game_table" (
            user_id INT REFERENCES "users"(id),
    `;
    for (let i = 1; i <= table_size * table_size; i++) {
      query += `user_event_id_${i} INT REFERENCES "event_table"(id),`;
    }
    query += `PRIMARY KEY (user_id)
    );`;
    this.query(query);
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
