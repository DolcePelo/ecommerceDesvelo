import { Router } from "express";
import { loginRender } from "../controller/login.controller.js";

const router = Router();

router.get("/", loginRender);

export default router;