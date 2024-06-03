import UserModel from "../dao/models/user.js";
import { auth } from "../middlewares/index.js";
import { createHash, isValidPass } from "../utils.js";

const loginSession = async (req, res) => {
    const { email, password } = req.body;
    const result = await UserModel.findOne({ email });

    if (result === null) {
        res.status(400).json({
            error: "Usuario o contraseña incorrectos",
        });
    } else if (!isValidPass(password, result)) {
        res.status(401).json({
            error: "Usuario o contraseña incorrectos",
        });
    } else {
        req.session.user = email;
        req.session.name = result.first_name;
        req.session.last_name = result.last_name;
        req.session.role = result.role;
        res.status(200).json({
            respuesta: "ok",
            result,
        });
    }
}

const registerSession = async (req, res) => {
    res.send({ response: "success", message: "user registered" });
}

const registerError = (err, req, res, next) => {
    res.status(400).json({
        error: err.message,
    })
}

const forgotRender = async (req,res) => {
    res.render("forgot", {
        style: "css/login.css"
    });
}

const forgotLogic = async (req,res) => {
    const { email, newPassword } = req.body;
    const result = await UserModel.find({
        email: email,
    });

    if (result.length === 0) {
        return res.status(401).json({
            error: "Usuario o contraseña incorrectos",
        });
    } else {
        const respuesta = await UserModel.findByIdAndUpdate(result[0]._id, {
            password: createHash(newPassword),
        });
        res.status(200).json({
            respuesta: "ok",
            datos: respuesta,
        });
    }
}


export {loginSession, registerSession, registerError, forgotRender, forgotLogic}