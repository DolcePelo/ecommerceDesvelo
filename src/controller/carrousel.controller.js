import carrouselService from "../dao/dbManager/carrouse.js";

const carrousels = new carrouselService();

const getCarrousels = async (req, res) => {
    const result = await carrousels.getCarrousels();
    res.json(result);
};

const getCarrouselById = async (req, res) => {
    const { id } = req.params;
    const carrousel = await carrousels.getCarrouselById(id);
    if (!carrousel) {
        return res.status(404).send({ message: 'Carrousel no encontrado' });
    }
    res.json(carrousel);
};

const createCarrousel = async (req, res) => {
    const { name, items } = req.body;
    try {
        const newCarrousel = await carrousels.createCarrousel({ name, items });

        res.status(201).json(newCarrousel);
    } catch (error) {
        console.error("Error al crear el carrousel:", error);
        res.status(500).json({ message: "Error al crear el carrousel" });
    }
};

const updateCarrousel = async (req,res) => {
    const { id } = req.params;
    const newCarrousel = req.body;

    let carrouselById = await carrousels.getCarrouselById(id);
    if (!carrouselById) {
        return res.status(404).send({ message: 'No se ha encontrado el carrousel.' });
    }

    const updatedCarrousel = await carrousels.updateCarrousel(id, newCarrousel);

    res.json({
        status: "success",
        date: updatedCarrousel
    });
};

const deleteCarrousel = async (req,res) => {
    const { id } = req.params;
    try {
        const response = await carrousels.deleteCarrousel(id);
        res.json(response);
    } catch (error) {
        console.log("Error eliminado el carrousel", error);
    };
};

const addItemToCarrousel = async (req,res) => {
    const { id } = req.params;
    const { items } = req.body;
    try {
        const response = await carrousels.addItemToCarrousel(id, items);
        res.json({
            message: "Item agregado con exito",
            data: response
        });
    } catch (error) {
        console.log("Error al agregar el item al carrousel", error);
    }
};

const removeItemFromCarrousel = async (req,res) => {
    const { cid, iid } = req.params;
    const carrouselId = await carrousels.getCarrouselById(cid);
    if (!carrouselId) {
        return res.status(404).json({ message: 'Carrusel no encontrado' });
    }

    const itemIndex = carrouselId.items.findIndex(item => item._id.toString() === iid);
    if (itemIndex === -1) {
        return res.status(404).json({ message: 'Elemento no encontrado en el carrusel' });
    }
    carrouselId.items.splice(itemIndex, 1); 

    const updatedCarrousel = await carrousels.updateCarrousel(cid, carrouselId);

    res.json({
        message: "Elemento eliminado del carrousel",
        data: updatedCarrousel
    });
};

export { getCarrousels, getCarrouselById, createCarrousel, updateCarrousel, deleteCarrousel,  addItemToCarrousel, removeItemFromCarrousel };
