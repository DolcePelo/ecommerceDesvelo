import { Router } from "express";
import { createMokingProduct } from "../controller/mokingproduct.controller.js";

const router = Router();

router.get("/", createMokingProduct)

export default router;