import { generateProducts } from "../utils.js";

const createMokingProduct = () => {
    let products = [];
    for (let i = 0; i < 10; i++) {
        let tempProduct = generateProducts();
        products.push(tempProduct)
    }

    res.json({
        count: products.length,
        data: products
    })
}

export { createMokingProduct }