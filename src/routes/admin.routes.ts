import express from "express";
import * as AdminController from "../controllers/AdminController.js";
import * as ProductController from "../controllers/ProductController.js";

const adminRouter = express.Router();

adminRouter.get("/adm/getall", AdminController.getAll);
adminRouter.patch("/adm/setVisited", AdminController.setVisited);

adminRouter.post("/adm/product", ProductController.create);
adminRouter.patch("/adm/product/:id", ProductController.update);
adminRouter.delete("/adm/product/:id", ProductController.remove);

export default adminRouter;
