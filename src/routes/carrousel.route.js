import { Router } from "express";
import { getCarrousels, getCarrouselById, createCarrousel, updateCarrousel, deleteCarrousel, addItemToCarrousel, removeItemFromCarrousel  } from "../controller/carrousel.controller.js";

const router = Router();

router.get("/", getCarrousels);
router.get("/:id", getCarrouselById);
router.post("/", createCarrousel);
router.put("/:id", updateCarrousel);
router.delete("/:id", deleteCarrousel);
router.put("/newitem/:id", addItemToCarrousel);
router.delete("/:cid/item/:iid", removeItemFromCarrousel);

export default router;