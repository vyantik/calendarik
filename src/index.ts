import express from "express";

import {
	registerValidation,
	loginValidation,
	eventValidation,
} from "./validations.js";

import cors from 'cors';
import cookieParser from 'cookie-parser';

import * as dotenv from "dotenv";
import cli from "cli-color";

import * as UserController from "./controllers/UserController.js";
import * as EventsController from "./controllers/EventsController.js";
import * as AdminController from "./controllers/AdminController.js";
import authChecker from "./utils/auth-checker.js";
import { authorize } from "./utils/check-role.js";

dotenv.config({path: 'src/utils/.env'});
const app = express();
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}));
app.use(cookieParser());

app.post("/auth/login", loginValidation, UserController.login);
app.post("/auth/register", registerValidation, UserController.register);
app.post("/auth/logout", UserController.logout);
app.get("/activate/:link", UserController.activate);
app.get("/auth/refresh", UserController.refresh);

app.get("/adm/getall", AdminController.getAll);
app.patch("/adm/setVisited", AdminController.setVisited);
app.get('/test', authChecker, authorize(['user']));

app.get("/events", EventsController.getAll);
app.get("/events/:id", EventsController.getAllUsers);
app.get("/user/event/visited/:id", UserController.getAllVisited);
app.get("/user/event/signup/:id", UserController.getAllSigned);
app.post("/user/event/signup", UserController.signUp);
app.delete("/user/event/signup", UserController.unsubscribe);
app.delete("/events/:id", authChecker, EventsController.remove);
app.patch("/events/:id",authChecker, eventValidation, EventsController.update);
app.post("/events", authChecker, eventValidation, EventsController.createEvent);

app.listen(process.env.PORT, (err?: Error): void => {
	if (err) {
		console.log(err);
		return;
	}
	console.log(cli.green("Server OK"));
});
