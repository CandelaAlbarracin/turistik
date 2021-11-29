const express = require('express')
const router = express.Router()
const {isLoggedInUsuario,isLoggedInAdm,isLoggedInEmp}=require('../lib/auth')
const passport = require("passport");


//ruta para renderizar el formulario de registro
router.get("/signup",(req,res) => {
    res.render("auth/signup");  
});

//ruta para recibir los datos del formulario de registro
router.post("/signup", passport.authenticate("local.signup", {
    successRedirect : "/profile",
    failureRedirect : "/signup",
    failureFlash : true
}));

//ruta para renderizar el formulario de login
router.get("/signin",(req,res) => {
    res.render("auth/signin");
});

//autenticacion para el login
router.post("/signin",(req,res,next) => {
    passport.authenticate("local.signin", {
        successRedirect: "/profile",
        failureRedirect: "/signin",
        failureFlash: true
    }) (req,res,next);
});

//ruta del perfil de usuario
router.get("/profile", (req,res) => {
    if(req.user.tipo=='U'){
        res.render("profile");
    }
    if (req.user.tipo=='A') {
        res.redirect("/actividades")
    }
    if (req.user.tipo=='E'){
        res.redirect("/misemprendimientos")
    }      
});

//ruta de cerrar sesion
router.get("/logout",(req,res) =>{
    req.logOut();
    res.redirect("/signin");
});

module.exports=router;