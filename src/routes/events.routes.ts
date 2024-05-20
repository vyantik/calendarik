import express from "express";
import * as EventsController from "../controllers/EventsController.js";
import { eventValidation } from "../validations.js";
import authChecker from "../utils/auth-checker.js";

const eventsRouter = express.Router();

eventsRouter.get("/events", EventsController.getAll);
eventsRouter.get("/events/:id", EventsController.getAllUsers);
eventsRouter.delete("/events/:id", authChecker, EventsController.remove);
eventsRouter.patch(
	"/events/:id",
	authChecker,
	eventValidation,
	EventsController.update,
);
eventsRouter.post(
	"/events/",
	authChecker,
	eventValidation,
	EventsController.createEvent,
);
eventsRouter.get("/events/visited/:id", EventsController.getAllVisited);
eventsRouter.get("/events/signed/:id", EventsController.getAllSigned);
eventsRouter.get("/events/comments/:id", EventsController.getComments);

export default eventsRouter;
