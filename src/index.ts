import express from "express";

import {
	registerValidation,
	loginValidation,
	eventValidation,
} from "./validations.js";

import checkAuth from "./utils/checkAuth.js";

import cli from "cli-color";

import * as UserController from "./controllers/UserController.js";
import * as EventsController from "./controllers/EventsController.js";

const app = express();
app.use(express.json());

app.post("/auth/login", loginValidation, UserController.login);
app.post("/auth/register", registerValidation, UserController.register);
app.get("/auth/me", checkAuth, UserController.getMe);

app.get("/events", EventsController.getAll);
app.get("/events/:id", EventsController.getOne);
app.delete("/events/:id", checkAuth, EventsController.remove);
app.patch("/events/:id",checkAuth, eventValidation, EventsController.update);
app.post("/events/:id/signup", checkAuth, EventsController.signUp);
app.post("/events", checkAuth, eventValidation, EventsController.createEvent);

app.listen(8080, (err?: Error): void => {
	if (err) {
		console.log(err);
		return;
	}

	console.log(cli.green("Server OK"));
});
