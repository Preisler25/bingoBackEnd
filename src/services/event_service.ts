import { UserEvent } from "types/type_user_event";
import { DbService } from "./db_service";

export class EventService {
  public static async endGame(): Promise<void> {
    try {
      await DbService.query(`DROP TABLE "game_table"`);
      console.log("Game ended");
    } catch (error) {
      console.error("Error ending game:", error);
    }
  }

  public static async isOnline(): Promise<boolean> {
    try {
      const result = await DbService.query(
        `SELECT EXISTS(
            SELECT FROM information_schema.tables 
            WHERE  table_name = 'game_table'
        );`
      );

      if (!result) {
        return false;
      }
      if (typeof result.rows[0][0] != "boolean") {
        return false;
      }
      return result.rows[0][0];
    } catch (error) {
      console.error("Error checking online status:", error);
      return false;
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
