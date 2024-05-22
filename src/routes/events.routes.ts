import express from "express";
import * as EventsController from "../controllers/EventsController.js";
import { eventValidation } from "../validations.js";
import authChecker from "../utils/auth-checker.js";

const eventsRouter = express.Router();

eventsRouter.get("/events", authChecker, EventsController.getAll);
eventsRouter.get("/events/:id", authChecker, EventsController.getAllUsers);
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
	EventsController.create,
);
eventsRouter.get(
	"/events/visited/:id",
	authChecker,
	EventsController.getAllVisited,
);
eventsRouter.get(
	"/events/signed/:id",
	authChecker,
	EventsController.getAllSigned,
);
eventsRouter.get(
	"/events/comments/:id",
	authChecker,
	EventsController.getComments,
);

export default eventsRouter;
