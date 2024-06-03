import ticketModel from "../models/ticket.js";

export default class Ticket {
    constructor(){
        console.log("Working tickets with database in mongodb")
    }
    
    getTickets = async () => {
        try {
            return await ticketModel.find();
        } catch (error) {
            console.error("Error al obtener las ordenes", error);
        }
    };

    getTicketById = async (id) => {
        try {
            return await ticketModel.findById(id)
            .populate('purchaser')
            .populate('products.product')
            .lean();
        } catch (error) {
            console.error("Error al obtener la orden", error)
        }
    };

    createTicket = async (ticket) => {
        try {
            const newTicket = new ticketModel(ticket);
            await newTicket.save();
            return newTicket;
        } catch (error) {
            console.error('Error al crear una nueva Orden', error);
            throw error;
        }
    };

    resolveTicket = async (id, order) => {
        try {
            let result = ticketModel.findByIdAndUpdate(id, order);
            return result;
        } catch (error) {
            console.error("Error al modificar la orden", error);
            throw error;
        }
    };
}