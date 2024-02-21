    import { Router } from "express";
    import Products from "../dao/dbManager/product.js";
    import { CartModel } from "../dao/models/cart.js";
    import dotenv from "dotenv";
    import { auth } from "../middlewares/index.js";

    dotenv.config();

    const router = Router();
    const DB_URL = process.env.DB_URL || "mongodb:localhost:27017/ecommerce";
    const products = new Products(DB_URL)

    router.get("/products", async (req, res) => {
        const { page = 1, limit = 4, sort = "asc", query } = req.query;

        const decodedQuery = query ? JSON.parse(decodeURIComponent(query)) : {};

        const productsData = await products.getAll(page, limit, sort, decodedQuery);

        const { docs, hasPrevPage, hasNextPage, totalPages, prevPage, nextPage } = productsData;

        const productsDocs = docs;

        res.render("products", {
            title: "Lista de productos",
            products: productsDocs,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            style: "css/products.css"
        });
    });

    router.get("/realtime", auth, async (req, res) => {
        const { page = 1, limit = 8, sort = "", query } = req.query;

        const decodedQuery = query ? JSON.parse(decodeURIComponent(query)) : {};

        const productsData = await products.getAll(page, limit, sort, decodedQuery);
        
        const { docs, hasPrevPage, hasNextPage, totalPages, prevPage, nextPage } = productsData;

        const productsDocs = docs;
        res.render("realtime", {
            title: "Productos en tiempo real",
            products: productsDocs,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            style: "css/products.css",
            welcomeMessage:  `Bienvenido: ${req.session.user}`,
        });
    });

    router.get("/cart/:cid", async (req,res) => {
        try {
            const { cid } = req.params;
            const cart = await CartModel.findById(cid).populate('products.product').lean();
            if(cart){
            res.render("cart", {
                cart: cart._id.toString(),
                products: cart.products,
                style: "/css/cart.css",
            })
        } else {
            res.status(404).json({ status: "error", error: "Cart not found"})
        }
        } catch (error) {
            res.status(500).json({ status: "error", error: "Internal error"})
        }
    })
    export default router