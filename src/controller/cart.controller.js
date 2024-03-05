import { CartModel } from "../dao/models/cart.js";
import { ProductModel } from "../dao/models/product.js";

const getCarts = async (req,res) => {
    try {
        const result = await CartModel.find();
        res.json({ message: result })
    } catch(error) {
        res.status(500).json({ status: "error", error: "Internal error"})
    }
}

const getCartById = async (req,res) => {
    try {
        const { cid } = req.params;
        const cart = await CartModel.findById(cid);
        res.json({ message: cart });
    }catch (error) {
        res.status(500).json({ status: "error", error: "Internal error"})
    }
}

const createCart = async (req,res) => {
    try {
        const response = await CartModel.create(req.body);
        res.json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", error: "Internal error"});
    }
}

const saveProductToCart = async (req,res) => {
    const {cid, pid} = req.params;

    const isCartValid = await CartModel.findById(cid);
    const isProductValid = await ProductModel.findById(pid);
    let hasChange = false;

    const newProduct = {
        product: pid,
        quantity: 1,
    };

    if(!isCartValid || !isProductValid){
        return res.status(400).json({
            status:"error",
            error:"Cart or product not found",
        });
    }
    
    const productIndex = isCartValid.products.findIndex(
        (product) => product.product.equals(pid)
    );

    if (productIndex === -1) {
        //Si el producto no existe en la lista lo agrego
        isCartValid.products.push(newProduct);
        hasChange=true;
    } else {
        isCartValid.products[productIndex].quantity++;
        hasChange=true;
    }
    
    if(hasChange) {
        const result = await CartModel.findByIdAndUpdate(cid, {
            products : isCartValid.products,
        });
        res.json({
            status:'ok',
            message: isCartValid,
            result: result,
        });
    }
}

const deleteProductFromCart = async (req,res) => {
    const {cid, pid} = req.params;
    
    const isCartValid = await CartModel.findById(cid);
    const isProductValid = await ProductModel.findById(pid);
    let hasChange = false;

    const newProduct = {
        product: pid,
        quantity: 1,
    };

    if(!isCartValid || !isProductValid){
        return res.status(400).json({
            status:"error",
            error:"Cart or product not found",
        });
    }

    const productIndex = isCartValid.products.findIndex(
        (product) => product.product.equals(pid)
    );

    if (productIndex === -1) {
        res.status(400).json({
            status: "error",
            message: "Product not found"
        });
    } else {
        isCartValid.products[productIndex].quantity--;
        if(isCartValid.products[productIndex].quantity === 0){
            isCartValid.products.splice(productIndex, 1);
        }
        hasChange=true;
    }
    
    if(hasChange) {
        const result = await CartModel.findByIdAndUpdate(cid, {
            products : isCartValid.products,
        });
        res.json({
            status:'ok',
            message: isCartValid,
            result: result,
        });
    }
}

const deleteCartById = async (req,res) => {
    try {
        const { cid } = req.params;
        const result = await CartModel.deleteOne({ _id: cid });
        res.json({ message: result });
        } catch (error) {
            console.log(error)
            res.status(500).json({ status: "error", error: "Internal error"})
        }
}

export { getCarts, getCartById, createCart, deleteProductFromCart,saveProductToCart, deleteCartById } 