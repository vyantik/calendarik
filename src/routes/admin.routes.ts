import express from "express";
import * as AdminController from "../controllers/AdminController.js";
import * as ProductController from "../controllers/ProductController.js";
import authChecker from "../utils/auth-checker.js";

const adminRouter = express.Router();

adminRouter.get("/adm/getall", authChecker, AdminController.getAll);
adminRouter.patch("/adm/setVisited", authChecker, AdminController.setVisited);

adminRouter.post("/adm/product", authChecker, ProductController.create);
adminRouter.patch("/adm/product/:id", authChecker, ProductController.update);
adminRouter.delete("/adm/product/:id", authChecker, ProductController.remove);

export default adminRouter;
