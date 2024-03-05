import { Router } from "express";
import { getCarts, getCartById, createCart,saveProductToCart, deleteProductFromCart, deleteCartById }  from '../controller/cart.controller.js';

const router = Router();

router.get("/", getCarts);

router.get("/:cid",getCartById);

router.post("/", createCart);
// Agregamos un producto al carrito
router.put("/:cid/product/:pid", saveProductToCart);

    // Eliminamos un producto del carrito
    router.delete("/:cid/product/:pid", deleteProductFromCart);

router.delete("/:cid", deleteCartById)

export default router