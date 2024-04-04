import { UserEvent } from "types/type_user_event";
import { DbService } from "./db_service";
import { GameOnStatus } from "types/type_game_on_status";

export class EventService {
  public static async endGame(): Promise<void> {
    try {
      await DbService.query(`DROP TABLE "game_table"`);
      console.log("Game ended");
    } catch (error) {
      console.error("Error ending game:", error);
    }
  }

  public static async isOnline(): Promise<GameOnStatus> {
    try {
      const result = await DbService.query(
        `SELECT EXISTS(
            SELECT FROM information_schema.tables 
            WHERE  table_name = 'game_table'
        );`
      );

      if (!result) {
        return { db: false, game: false };
      }
      if (typeof result.rows[0][0] != "boolean") {
        return { db: false, game: false };
      }
      return { db: true, game: result.rows[0][0] };
    } catch (error) {
      console.error("Error checking online status:", error);
      return { db: false, game: false };
    }
  }

  public static addEvent(event: UserEvent): void {
    try {
      DbService.query(`INSERT INTO "event_table" (event) VALUES ($1)`, [
        event.event,
      ]);
    } catch (error) {
      console.error("Error adding event:", error);
    }
  }
}
