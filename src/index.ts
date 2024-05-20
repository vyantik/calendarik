import express from "express";

import cors from "cors";
import cookieParser from "cookie-parser";

import * as dotenv from "dotenv";
import cli from "cli-color";

import authRouter from "./routes/auth.routes.js";
import eventsRouter from "./routes/events.routes.js";
import userRouter from "./routes/user.routes.js";

import * as AdminController from "./controllers/AdminController.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(
	cors({
		credentials: true,
		origin: "http://localhost:5173",
	}),
);
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/", eventsRouter);
app.use("/user", userRouter);

//app.get("/activate/:link", UserController.activate);

app.get("/adm/getall", AdminController.getAll);
app.patch("/adm/setVisited", AdminController.setVisited);

//app.get("/test", authChecker, authorize(["user"]));

app.listen(process.env.PORT, (err?: Error): void => {
	if (err) {
		console.log(err);
		return;
	}
	console.log(cli.green("Server OK"));
});
