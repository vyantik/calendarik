import express from "express";
import * as UserController from "../controllers/UserController.js";

const userRouter = express.Router();

userRouter.get("/:id", UserController.getPoints);
userRouter.get("/events/signed/:id", UserController.getSignedEvents);
userRouter.get("/events/visited/:id", UserController.getVisitedEvents);
userRouter.post("/event/signup", UserController.signUp);
userRouter.delete("/event/signup", UserController.unsubscribe);

userRouter.delete("/event/comment", UserController.deleteComment);
userRouter.get("/event/comment", UserController.getComments);
userRouter.post("/event/comment", UserController.addComment);

export default userRouter;
