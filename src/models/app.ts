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
    this.init = this.init.bind(this);
    this.init();
  }

  public async init() {
    console.log("Initializing the app");
    await DbService.init();
  }
}
