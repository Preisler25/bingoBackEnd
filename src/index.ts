import { App } from "./models/app";
import dotenv from "dotenv";

dotenv.config();
const app = new App();
app.init();
