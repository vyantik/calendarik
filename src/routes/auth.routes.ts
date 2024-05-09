import express from "express";
import * as UserController from "../controllers/UserController.js";
import { loginValidation, registerValidation } from "../validations.js";

const authRouter = express.Router();

authRouter.post("/login", loginValidation, UserController.login);
authRouter.post("/register", registerValidation, UserController.register);
authRouter.post("/logout", UserController.logout);
authRouter.get("/refresh", UserController.refresh);

export default authRouter;
