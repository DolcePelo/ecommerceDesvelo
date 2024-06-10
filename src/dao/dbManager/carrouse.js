import carrouselModel from "../models/carrousel.js";

export default class Carrousel {
    constructor() {
        console.log("Working carrousel with database in mongodb")
    }

    getCarrousels = async () => {
        try {
            return await carrouselModel.find();
        } catch (error) {
            console.error("Error al obtener los carrousels", error);
            throw error;
        }
    };

    getCarrouselById = async (id) => {
        try {
            return await carrouselModel.findById(id).lean();
        } catch (error) {
            console.error("Error al obtener el carrousel", error);
            throw error
        }
    };

    createCarrousel = async (carrousel) => {
        try {
            const newCarrousel = new carrouselModel(carrousel);
            await newCarrousel.save();
            return newCarrousel;
        } catch (error) {
            console.error("Error al crear el nuevo carrousel", error);
            throw error
        }
    };

    updateCarrousel = async (id, carrousel) => {
        try {
            return await carrouselModel.findByIdAndUpdate(id, carrousel, { new: true });
        } catch (error) {
            console.error("Error al modificar el carrousel", error);
            throw error;
        }
    };

    deleteCarrousel = async (id) => {
        try {
            return await carrouselModel.findByIdAndDelete(id);
        } catch (error) {
            console.error("Error al eliminar el carrousel", error);
            throw error
        }
    };

    addItemToCarrousel = async (carrouselId, item) => {
        try {
            const carrousel = await carrouselModel.findById(carrouselId);
            if (carrousel) {
                carrousel.items.push(item);
                await carrousel.save();
                return carrousel;
            } else {
                throw new Error("Carrousel no encontrado")
            }
        } catch (error) {
            console.error("Error al agregar el elemento al carrousel", error);
            throw error
        }
    };

    removeItemFromCarrousel = async (carrouselId, itemId) => {
        try {
            const carrousel = await carrousel.findById(carrouselId);
            if(carrousel) {
                const item = carrousel.items.id(itemId);
                if (item) {
                    item.remove();
                    await carrousel.save();
                    return carrousel;
                } else {
                    throw new Error("Elemento no encontrado en el carrousel")
                }
            } else {
                throw new Error("Carrousel no encontrado");
            }
        } catch (error) {
            console.error("Error al eliminar el elemento del carrousel", error)
            throw error;
        }
    };
}