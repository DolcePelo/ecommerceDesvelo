import { Router } from "express";
import Products from "../dao/dbManager/product.js";
import { CartModel } from "../dao/models/cart.js";
import Ticket from "../dao/dbManager/ticket.js";
import carrouselService from "../dao/dbManager/carrouse.js";
import dotenv from "dotenv";
import { auth } from "../middlewares/index.js";

dotenv.config();

const router = Router();

const DB_URL = process.env.DB_URL || "mongodb:localhost:27017/ecommerce";
const products = new Products(DB_URL);
const ticketService = new Ticket(DB_URL);
const carrousels = new carrouselService(DB_URL);

const CARROUSEL_ID = process.env.CARROUSEL_ID;

router.get("/products", async (req, res) => {
    const { page = 1, limit = 4, sort = "asc", query } = req.query;

    const decodedQuery = query ? JSON.parse(decodeURIComponent(query)) : {};

    const productsData = await products.getAll(page, limit, sort, decodedQuery);

    const { docs, hasPrevPage, hasNextPage, totalPages, prevPage, nextPage } = productsData;

    const productsDocs = docs;

    const carrouselImages = await carrousels.getCarrouselById(CARROUSEL_ID);
    
    const carrouselItems = carrouselImages.items;

    res.render("products", {
        title: "Lista de productos",
        products: productsDocs,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        style: "css/products.css",
        carrouselImages: carrouselItems
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
        welcomeMessage: `Bienvenido: ${req.session.user}`,
    });
});

router.get("/cart/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await CartModel.findById(cid).populate('products.product').lean();
        if (cart) {
            res.render("cart", {
                cart: cart._id.toString(),
                products: cart.products,
                style: "/css/cart.css",
            })
        } else {
            res.status(404).json({ status: "error", error: "Cart not found" })
        }
    } catch (error) {
        res.status(500).json({ status: "error", error: "Internal error" })
    }
});

router.get("/ticket/:tid", async (req, res) => {
    try {
        const { tid } = req.params;
        console.log(tid);
        const ticket = await ticketService.getTicketById(tid);
        if (ticket) {
            res.render("ticket", {
                ticket: {
                    id: ticket._id.toString(),
                    code: ticket.code,
                    purchase_datetime: ticket.purchase_datetime,
                    amount: ticket.amount,
                    purchaser: ticket.purchaser,
                    products: ticket.products.map(p => ({
                        product: p.product,
                        quantity: p.quantity
                    }))
                },
                style: "/css/ticket.css",
            });
        } else {
            res.status(404).json({
                status: "error", error: "Ticket not found"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "error", error: "Internal error" })
    }
});


export default router