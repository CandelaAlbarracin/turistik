const express = require('express')
const router = express.Router()

const passport = require("passport");

//ruta para renderizar el formulario
router.get("/signup",(req,res) => {
    res.render("auth/signup");  
});

//ruta para recibir los datos del formulario
router.post("/signup", passport.authenticate("local.signup", {
    successRedirect : "/profile",
    failureRedirect : "/signup",
    failureFlash : true
}));

//ruta del perfil de usuario
router.get("/profile", (req,res) => {
    res.send("perfil de usuario");
});

module.exports=router;