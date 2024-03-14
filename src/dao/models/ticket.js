import mongoose from "mongoose";

const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema({
    code: String,
    purchase_datetime: Date,
    amout: Number,
    purchaser: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    }
});

const ticketModel = mongoose.model(ticketCollection, ticketSchema);

export default ticketModel;