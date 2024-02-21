import mongoose from "mongoose";

const cartCollection = "cart";

const CartSchema = new mongoose.Schema({
    products: {
        type: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product',
            },
            quantity: {
                type: Number,
                default: 1,
            },
        }],
        default: [],
    },
});

export const CartModel = mongoose.model(cartCollection, CartSchema)