import express from "express";
import * as UserController from "../controllers/UserController.js";
import * as ProductController from "../controllers/ProductController.js";

const userRouter = express.Router();

userRouter.get("/user/:id", UserController.getPoints);
userRouter.get("/user/events/signed/:id", UserController.getSignedEvents);
userRouter.get("/user/events/visited/:id", UserController.getVisitedEvents);
userRouter.post("/user/event/signup", UserController.signUp);
userRouter.delete("/user/event/signup", UserController.unsubscribe);

userRouter.delete("/user/event/comment", UserController.deleteComment);
userRouter.post("/user/event/comment", UserController.addComment);

userRouter.post("/product/buy", ProductController.buyProduct);
userRouter.get("/products", ProductController.getAll);

export default userRouter;
