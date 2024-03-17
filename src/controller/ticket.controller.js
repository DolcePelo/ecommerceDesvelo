import ticketService from "../dao/dbManager/ticket.js";
import UserModel from "../dao/models/user.js";
import { CartModel } from "../dao/models/cart.js";
import { ProductModel } from "../dao/models/product.js";

const tickets = new ticketService();

const getTickets = async (req, res) => {
    const result = await tickets.getTickets();
    res.json(result);
};

const getTicketById = async (req, res) => {
    const { id } = req.params;
    const ticket = await tickets.getTicketById(id);

    if (!ticket) {
        return res.status(404).send({ message: 'Ticket no encontrado' });
    }

    res.json(ticket)
};

const createTicket = async (req, res) => {
    const { cart, user } = req.body;
    let cartFound = await CartModel.findById(cart);
    let userFound = await UserModel.findById(user);

    let productDetails = cartFound.products.map(product => ({
        productId: product.product,
        quantity: product.quantity
    }));

    let productIds = productDetails.map(product => product.productId);

    let actualProducts = await ProductModel.find({ _id: { $in: productIds } });

    let productsWithQuantity = actualProducts.map(product => {
        let detail = productDetails.find(item => item.productId.equals(product._id));
        let quantity = detail ? detail.quantity : 0;
        return { ...product.toObject(), quantity };
    });

    let sum = productsWithQuantity.reduce((acc, product) => acc + product.price * product.quantity, 0);

    let ticketNumber = Date.now() + Math.floor(Math.random() * 1000);

    let newTicket = {
        number: ticketNumber,
        userFound,
        products: productsWithQuantity.map(product => ({
            productId: product._id,
            quantity: product.quantity
        })),
        totalPrice: sum,
    };

    let result = await tickets.createTicket(newTicket);
    res.json({
        user: userFound.email,
        cart: cartFound._id,
        totalPrice: sum,
        status: "success",
        result: result
    });
};

const resolveTicket = async (req, res) => {
    console.log("Entrando en resolveTicket");
    const { id } = req.params;
    const newTicket = req.body;
    let ticketById = await tickets.getTicketById(id);
    if (!ticketById) {
        return res.status(404).send({ message: 'No se ha encontrado la factura.' });
    }
    const ticket = await tickets.resolveTicket(id, newTicket);

    res.json({
        status: "success",
        data: ticket,
    });
};

export { getTickets, getTicketById, createTicket, resolveTicket };
