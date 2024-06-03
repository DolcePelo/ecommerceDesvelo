import mongoose from "mongoose";

const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema({
    code: String,
    purchase_datetime: Date,
    amount: Number,
    purchaser: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    },
    products: {
        type: [{
            product: {
                type: mongoose.Types.ObjectId,
                ref: 'product',
            },
            quantity: {
                type: Number,
                default: 1,
            }
        }]
    }
});

const ticketModel = mongoose.model(ticketCollection, ticketSchema);

export default ticketModel;