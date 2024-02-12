    import { Router } from "express";
    import UserModel from "../dao/models/user.js";
    import { auth } from "../middlewares/index.js";
    import { createHash, isValidPass } from "../utils.js";
    import passport from "passport";

    const router = Router();

    router.post("/login", async (req, res) => {
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
            req.session.role = "admin";
            res.status(200).json({
                respuesta: "ok",
            });
        }
    });

    router.post(
        "/signup",
        passport.authenticate("register"),
        async (req, res) => {
            res.send({ response: "success", message: "user registered" });
        },
        (err, req, res, next) => {
            res.status(400).json({
                error: err.message,
            })
        }
    );

    router.get(
        "/github",
        passport.authenticate("github", { scope: ["user:email"] }),
        async (req, res) => {}
    );

    router.get(
        "/realtime/githubcallback",
        (req, res, next) => {
            console.log("GitHub Callback initiated");
            next();
        },
        passport.authenticate("github", { failureRedirect: "/login" }),
        async (req,res) => {
            console.log("GitHub Authentication Successful");
            req.session.user = req.user;
            req.session.role = true;
            res.redirect("/realtime")
        },
        (err, req, res, next) => {
            console.error(err);
            res.redirect("/login"); 
        }
    );

    router.get("/forgot", (req, res) => {
        res.render("forgot", {
            style: "css/login.css"
        });
    });

    router.post("/forgot", async (req, res) => {
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
    });

    export default router;