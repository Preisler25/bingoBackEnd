import express from "express";
import { DbService } from "./services/db_service";
import { createServer } from "http";
import { Server } from "socket.io";
import { SockerService } from "services/socker_service";

export class App {
  private app: express.Application;
  private port: number;
  private server: any;

  constructor() {
    this.port = parseInt(process.env.APP_PORT || "3001");
    this.app = express();
    this.server = createServer(this.app);
    SockerService.init(new Server(this.server));

    SockerService.on("connection", (socket: any) => {
      console.log("User connected");

      socket.emit("message", "Hello from the server");

      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });

    this.server.listen(this.port);
    this.init = this.init.bind(this);
    this.init();
  }

  public async init() {
    console.log("Initializing the app");
    await DbService.init();
  }
}
