import mongoose from "mongoose";

const productCollection = "product";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    brand: String,
    color: String,
    size: String,
    imageUrl: String,
    stock: {
        type: Number,
        default: 0,
        required: true
    }
});

export const ProductModel = mongoose.model(productCollection, ProductSchema)