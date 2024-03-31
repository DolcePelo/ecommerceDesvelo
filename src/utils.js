import { fileURLToPath } from "url";
import { dirname } from "path";
import { faker } from "@faker-js/faker";
import winston from "winston";
import dotenv from "dotenv";

dotenv.config();

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

//-----------------------------------------------//

import { hashSync, genSaltSync, compareSync } from "bcrypt";

//registro
export const createHash = (password) => {
    return hashSync(password, genSaltSync(10));
};

//login

/**
 * 
 * @param {*} password contraseña proporsionada por usuario sin hashear
 * @param {*} user usuario existente en BD 
 * @returns booleano
 */
export const isValidPass = (password, user) => {
    return compareSync(password, user.password);
};

//---------------------------------------------//

export const generateProducts = () => {
    return {
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
        category: faker.commerce.productAdjective(),
        stock: Math.floor(Math.random() * 100),
        id: faker.database.mongodbObjectId(),
        imageUrl: faker.image.url(),
        code: faker.commerce.isbn(),
        description: faker.commerce.productDescription(),
    };
};

//---------------------------------------------//
const MODE = process.env.MODE || "dev";

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({ level: 'http' }),
        new winston.transports.File({ filename: "./errors.log", level: "warn" }),
    ]
});

const checkEnvirontment = () => {
    if (MODE.toUpperCase() === "DEV") {
        return devLogger;
    }
    return prodLogger;
};

const devLogger = winston.createLogger({
    transports: [
        new winston.transports.Console({ level: "verbose" }),
    ],
});

const prodLogger = winston.createLogger({
    transports: [
        new winston.transports.Console({ level: "http" }),
        new winston.transports.File({ filename: "./criticalErrors.log", level: "warn" }),
    ],
});

export const addLogger = (req, res, next) => {

    req.logger = checkEnvirontment();
    const textDate = new Date().toISOString();
    req.logger.http(`${req.method} - ${req.url} - ${textDate}`);
    next();
};