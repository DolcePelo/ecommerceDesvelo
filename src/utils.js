import { fileURLToPath } from "url";
import { dirname } from "path";
import { faker } from "@faker-js/faker";

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