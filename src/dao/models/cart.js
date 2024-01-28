import mongoose from "mongoose";

const cartCollection = "cart";

const CartSchema = new mongoose.Schema({
    products: {
        type: Array,
        default: []
    }
});

export const CartModel = mongoose.model(cartCollection, CartSchema)