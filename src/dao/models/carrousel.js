import mongoose from "mongoose";

const carrouselCollection = "carrousel";

const carrouselSchema = new mongoose.Schema({
    name: String,
    items: [{
        imageUrl: String,
        altText: String,
        videoUrl: String
    }]
});

const carrouselModel = mongoose.model(carrouselCollection, carrouselSchema);

export default carrouselModel;