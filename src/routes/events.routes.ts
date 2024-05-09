import express from "express";
import * as EventsController from "../controllers/EventsController.js";
import { eventValidation } from "../validations.js";
import authChecker from "../utils/auth-checker.js";

const eventsRouter = express.Router();

eventsRouter.get("/", EventsController.getAll);
eventsRouter.get("/:id", EventsController.getAllUsers);
eventsRouter.delete("/:id", authChecker, EventsController.remove);
eventsRouter.patch(
	"/:id",
	authChecker,
	eventValidation,
	EventsController.update,
);
eventsRouter.post(
	"/",
	authChecker,
	eventValidation,
	EventsController.createEvent,
);
eventsRouter.get("/visited/:id", EventsController.getAllVisited);
eventsRouter.get("/signed/:id", EventsController.getAllSigned);

export default eventsRouter;
