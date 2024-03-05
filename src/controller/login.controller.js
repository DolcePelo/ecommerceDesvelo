
const loginRender = (req,res) => {
    res.render("login", {
        title: "Inicia sesión",
        style: "/css/login.css"
    });
}

export { loginRender } 