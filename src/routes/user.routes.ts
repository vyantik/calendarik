import express from "express";
import * as UserController from "../controllers/UserController.js";
import * as ProductController from "../controllers/ProductController.js";
import authChecker from "../utils/auth-checker.js";

const userRouter = express.Router();

userRouter.get("/user/:id", authChecker, UserController.getPoints);
userRouter.get(
	"/user/events/signed/:id",
	authChecker,
	UserController.getSignedEvents,
);
userRouter.get(
	"/user/events/visited/:id",
	authChecker,
	UserController.getVisitedEvents,
);
userRouter.post("/user/event/signup", authChecker, UserController.signUp);
userRouter.delete(
	"/user/event/signup",
	authChecker,
	UserController.unsubscribe,
);

userRouter.delete(
	"/user/event/comment",
	authChecker,
	UserController.deleteComment,
);
userRouter.post("/user/event/comment", authChecker, UserController.addComment);

userRouter.post("/product/buy", authChecker, ProductController.buyProduct);
userRouter.get("/products", authChecker, ProductController.getAll);
userRouter.get("/leaderboard", UserController.getLeaderboard);

export default userRouter;
