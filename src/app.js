import express from "express";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import handlebars from "express-handlebars";
import productRouter from "./routes/products.route.js";
import cartRouter from "./routes/cart.route.js";
import viewsRouter from "./routes/views.route.js";
import { __dirname } from "./utils.js";
import Products from "./dao/dbManager/product.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

const DB_URL = process.env.DB_URL || "mongodb:localhost:27017/ecommerce";

const productManager = new Products(DB_URL);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

////////////////////////////
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
////////////////////////////

app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/", viewsRouter);

const server = app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});

mongoose
    .connect(DB_URL)
    .then(() => {
        console.log("Connected to MongoDB " + DB_URL);
    })
    .catch((error) => {
        console.log("Error connecting to MongoDB", error);
    })

const socketServer = new Server(server);

socketServer.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");
    socket.on("addProduct", async (product) => {
        const name = product.name;
		const description = product.description;
		const price = product.price;
		const imageUrl = product.imageUrl;
		const code = product.code;
		const stock = product.stock;
        const category = product.category
        const newProduct = {name,description,price,imageUrl,code,stock,category}
        try {
            const result = await productManager.saveProduct(
                newProduct
            );

            const allProducts = await productManager.getAll();

            socketServer.emit("updateProducts", {
                allProducts,
                success: result.success,
                message: result.message,
            });
        } catch (error) {
            console.log(error);
            socketServer.emit("updateProducts", {
                success: false,
                message: error.message,
            });
        }
    })

    socket.on("deleteProduct", async (id) => {
        try {
            const result = await productManager.deleteProduct(id);
            const allProducts = await productManager.getAll();

            socketServer.emit("updateProducts", {
                allProducts,
                success: result.success,
				message: result.message,
            });
        } catch (error) {
            console.log(error)
        }
    });
}); 