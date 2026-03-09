import express, { type Router } from "express";
import { generateFlow } from "../controllers/prompt.controllers.js";

const promptRouter: Router = express.Router();

promptRouter.get("/generate-flow", generateFlow);

export default promptRouter;