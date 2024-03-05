import { Router } from "express";
import {getProducts,getProductById,createProduct,editProduct,deleteProduct} from '../controller/product.controller.js'

const router = Router();

router.get("/", getProducts);

router.get("/:id", getProductById);

router.post("/", createProduct);

router.put("/:id", editProduct);

router.delete("/:id", deleteProduct);

export default router;