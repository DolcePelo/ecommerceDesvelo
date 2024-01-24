import { Router } from "express";
import Products from "../dao/dbManager/product.js";
import dotenv from "dotenv";

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

router.get("/realtime", async (req, res) => {
    const response = await products.getAll();
    res.render("realtime", {
        title: "Productos en tiempo real",
        products: response,
        style: "css/products.css",
    });
});
export default router