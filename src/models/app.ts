import express from "express";
import { DbService } from "../services/db_service";

export class App {
  private app: express.Application;
  private port: number;

  constructor() {
    this.port = parseInt(process.env.APP_PORT || "3001");
    this.app = express();
    this.app.listen(this.port, () => {
      console.log(`server running on port ${this.port}`);
    });
  }

  public async init() {
    console.log("Initializing the app");
    await DbService.init();
    DbService.query("SELECT now();")
      .then((result) => {
        console.log("Query result:", result);
      })
      .catch((error) => {
        console.error("Error executing query:", error);
      });
  }
}
