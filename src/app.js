import express from "express";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import handlebars from "express-handlebars";
import productRouter from "./routes/products.route.js";
import cartRouter from "./routes/cart.route.js";
import viewsRouter from "./routes/views.route.js";
import ticketRouter from "./routes/ticket.route.js";
import Products from "./dao/dbManager/product.js";
import MongoStore from "connect-mongo";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import initializeGitHubPassport from "./config/passportGithub.js";
import loginRouter from "./routes/login.route.js";
import signupRouter from "./routes/signup.route.js";
import sessionRouter from "./routes/session.route.js";
import mokingProduct from "./routes/mokingproducts.route.js"
import carrouselRouter from "./routes/carrousel.route.js";
import { __dirname } from "./utils.js";
import { addLogger } from "./utils.js";
import { helpers } from "./helper/handlebarsHelpers.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const COOKIESECRET = process.env.COOKIESECRET;
const DB_URL = process.env.DB_URL || "mongodb:localhost:27017/ecommerce";

const productManager = new Products(DB_URL);

// Configuración para la documentación de la app
const swaggerOptions= {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación Ecommerce API',
            version: '1.0.0',
            description:   'API creada para la documentacion del proyecto',
            contact: {
                name: 'Alejandro Pelozatto'
            },
            servers:  { url: `http://localhost:${PORT}`}
            },
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
};

const specs = swaggerJSDoc(swaggerOptions);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(cookieParser(COOKIESECRET))

// app.use(errorHandler)

// Configuración de la session
app.use(
    session({
        store: MongoStore.create({
            mongoUrl: DB_URL,
            ttl: 60 * 30, // 30 minutes
        }),
        secret: COOKIESECRET,
        resave: false,
        saveUninitialized: false,
    })
);

////////////////////////////
// Configuración de Handlebars
const hbs = handlebars.create({
    helpers,
    partialsDir: [`${__dirname}/views`]
});

app.engine("handlebars", hbs.engine);
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
////////////////////////////

// Inicializamos passport
initializePassport();
initializeGitHubPassport();
app.use(passport.initialize());
app.use(passport.session());

// Winston Logger
app.use(addLogger);

// Routes
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/ticket", ticketRouter);
app.use("/api/carrousel", carrouselRouter);
app.use("/", viewsRouter);
app.use("/login", loginRouter);
app.use("/signup", signupRouter);
app.use("/", sessionRouter);
app.use("/mokingproducts", mokingProduct);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));



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
        const newProduct = { name, description, price, imageUrl, code, stock, category }
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

    socket.on("deleteProduct", async (productId) => {
        try {
            const result = await productManager.deleteProduct(productId);
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