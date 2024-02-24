import express from "express";

import {
	registerValidation,
	loginValidation,
	eventValidation,
} from "./validations.js";

import checkAuth from "./utils/checkAuth.js";
import cors from 'cors';
import cookieParser from 'cookie-parser';

import * as dotenv from "dotenv";
import cli from "cli-color";

import * as UserController from "./controllers/UserController.js";
import * as EventsController from "./controllers/EventsController.js";

dotenv.config({path: 'src/utils/.env'});
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.post("/auth/login", loginValidation, UserController.login);
app.post("/auth/register", registerValidation, UserController.register);
app.post("/auth/logout", UserController.logout);
app.get("/activate/:link", UserController.activate);
app.get("/auth/refresh", UserController.refresh);
app.get("/auth/me", checkAuth, UserController.getMe);

app.get("/events", EventsController.getAll);
app.get("/events/:id", EventsController.getOne);
app.delete("/events/:id", checkAuth, EventsController.remove);
app.patch("/events/:id",checkAuth, eventValidation, EventsController.update);
app.post("/events/:id/signup", checkAuth, EventsController.signUp);
app.post("/events", checkAuth, eventValidation, EventsController.createEvent);

app.listen(process.env.PORT, (err?: Error): void => {
	if (err) {
		console.log(err);
		return;
	}
	console.log(cli.green("Server OK"));
});
