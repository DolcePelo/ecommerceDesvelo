import { Router } from "express";
import UserModel from "../dao/models/user.js";
import { auth } from "../middlewares/index.js";
import { createHash, isValidPass } from "../utils.js";

const router = Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const result = await UserModel.findOne({ email });
    if (result === null) {
        res.status(400).json({
            error: "Usuario o contraseña incorrectos",
        });
    } else {
        // Comparamos la contraseña encriptada con la que hemos recibido
        const isValid = isValidPass(password, result);
        if (!isValid) return false

        // Si son validas creamos el token y lo enviamos al usuario
            req.session.user = email;
            req.session.role = "admin";
            res.status(200).json({
                respuesta: "ok",
            });

    }
});

router.post("/signup", async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    const newUser = {
        first_name,
        last_name,
        email,
        password: createHash(password),
        role: "admin",
    };

    const result = await UserModel.create(newUser);

    if (result === null) {
        res.status(400).json({
            error: "Error al crear el usuario"
        });
    } else {
        req.session.user = email;
        req.session.role = "admin";
        res.status(201).json({
            respuesta: "Usuario creado con éxito",
        })
    }
});

// router.get("/realtime", auth, (req,res) => {
//     res.render("realtime", {
//         title: "Realtime",
//         user: req.session.user,
//     })
// })

export default router;