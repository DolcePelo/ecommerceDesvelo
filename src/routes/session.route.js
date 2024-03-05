    import { Router } from "express";
    import {loginSession, registerSession, registerError, forgotRender, forgotLogic} from "../controller/session.controller.js";
    import passport from "passport";

    const router = Router();

    router.post("/login", loginSession);

    router.post("/signup", passport.authenticate("register"), registerSession, registerError);

    router.get(
        "/github",
        passport.authenticate("github", { scope: ["user:email"] }),
        async (req, res) => {}
    );

    router.get(
        "/githubcallback",
        (req, res, next) => {
            console.log("GitHub Callback initiated");
            next();
        },
        passport.authenticate("github", { failureRedirect: "/login" }),
        async (req,res) => {
            console.log("GitHub Authentication Successful");
            req.session.user = req.user;
            req.session.role = true;
            res.redirect("/")
        },
        (err, req, res, next) => {
            console.error(err);
            res.redirect("/login"); 
        }
    );

    router.get("/forgot", forgotRender);

    router.post("/forgot", forgotLogic);

    export default router;